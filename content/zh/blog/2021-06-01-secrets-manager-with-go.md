---
title: "Using Google's Secret Manager API with Go"
slug: "secrets-manager-with-go"
date: "2021-06-01T08:26:38-04:00"
draft: false
image_webp: images/media/2021-06-01-secrets-manager-with-go/doorknocker.webp
image: images/media/2021-06-01-secrets-manager-with-go/doorknocker.jpg
author: Rebecca Bilbro
description: "In this post, we'll dive into Google's Secret Manager service, walk through the setup steps, and explore some Go code to interact with the API."
---

Security is by definition an inconvenience. At the very least, it's about making access to data as challenging as possible for the baddies, conveniently measured in computation time. But good security also requires us good folks to go above and beyond &mdash; adopting architectural and engineering practices that involve more forethought, more effort, and more testing than are strictly required to get a basic application running on the web. If you're here already, we don't need to convince you that the effort is well worth it; good security pays for itself in customer trust, not to mention helping to preclude the kinds of breaches that can get careless folks in hot water. In this post, we'll dive into Google's Secret Manager service, walk through the setup steps, and explore some Go code to interact with the API.

The example code can be found at: [github.com/rotationalio/knock](https://github.com/rotationalio/knock).

## What is Google Secret Manager?

[Google Secret Manager](https://cloud.google.com/secret-manager) is a hosted service that allows users to store, manage, and access secure information. Information stored in Secret Manager is encrypted by default, and can only be accessed by an application if it has been granted valid credentials. Access can be granted (and revoked) on a very granular level, meaning that you can give out [role-based permissions](https://cloud.google.com/secret-manager/docs/access-control) for individual secrets using the [principle of least privilege](https://cloud.google.com/secret-manager/docs/access-control#least-privilege).

One big advantage of the Secret Manager implementation is its flexibility in terms of what can be stored. "Secrets" can be text or arbitrary bytes (well, almost; there is a [64KiB limit](https://cloud.google.com/secret-manager/quotas)); meaning they can be passwords, API keys, or certificates.

Secrets are stored using a namespace-like convention, where the key that references the payload value takes the form of a path, e.g.

```bash
projects/projectID/secrets/exampleSecret
```

Rather than storing encrypted payload data on the secret itself, Secret Manager exposes `versions` that store the actual secret data. When retrieving payloads, you retrieve them from the version, which is immutable, e.g.

```bash
projects/projectID/secrets/exampleSecret/versions/2
```

## Getting Started with Google Secret Manager

The setup requires you to navigate between the Google Console UI and the command line.

- First, [download and install the SDK](https://cloud.google.com/sdk/docs/install) that matches your os, and make sure to add it to your `PATH`.
- Next, navigate to the Console UI and [configure](https://cloud.google.com/secret-manager/docs/configuring-secret-manager) your Google Cloud project to use Secret Manager. You'll use the UI to do both of the following:
    - create a new project (e.g. in this example, we'll use "knock-knock")
    - enable the Google Secrets API (via the [API Console](https://console.cloud.google.com/apis/dashboard)) for that project
- Now, return to the command line and run `gcloud init` to authenticate. This will open a browser window, where you'll select the correct gcloud account. Back on the command line, select the new project you just made.
- Next we'll assign IAM privileges. Using the Google Console UI, navigate to the [IAM page](https://console.cloud.google.com/iam-admin/iam), select the correct project, and select your name from the members list. You'll need to add a role, e.g. "Secret Manager Secret Version Manager", that will allow you to create and manage secrets.
- Now, back in the command line, we'll make a Service Account, which will generate a local JSON file containing the service account credentials for a hypothetical user named Jeeves.
    ```bash
    gcloud iam service-accounts create jeeves
    gcloud projects add-iam-policy-binding knock-knock --member="serviceAccount:jeeves@knock-knock.iam.gserviceaccount.com" --role="roles/secretmanager.secretVersionManager"
    gcloud iam service-accounts keys create knock.json --iam-account=jeeves@knock-knock.iam.gserviceaccount.com
    ```
- Next we'll add the path to those credentials to our PATH so that we can access them as environment variables; let's also add the project name as an environment variable.
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="/home/user/knock.json"
    export GOOGLE_PROJECT_NAME="knock-knock"
    ```

Ok, now we're ready to start creating secrets!

## Interacting with the Secret Manager API in Go

There are a few good tutorials for interacting with the Secret Manager using languages like [Python](https://codelabs.developers.google.com/codelabs/secret-manager-python#0) and [Node](https://github.com/googleapis/nodejs-secret-manager/tree/master/samples). Since there's not much available that demonstrates Golang examples, this post will focus on Go.

The example implementation can be seen in full [here](https://github.com/rotationalio/knock); it takes the following imports:

```golang
import (
	"context"
	"errors"
	"fmt"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"google.golang.org/api/iterator"
	secretmanagerpb "google.golang.org/genproto/googleapis/cloud/secretmanager/v1"
)
```


### Create a New Secret

First let's write a function to create a new secret. This function will take as input two parameters:
- a `parent`, which should be a string path, e.g. "projects/project-name".
- a `secretID`, which should be a string name to uniquely refer to the secret (though not the same as the key for the payload; that will come later when we create a secret version).

Our function will return a string representation of the path where the new secret is stored, e.g "projects/projectID/secrets/secretID", and an error if any occurs.

```golang
// CreateSecret creates a new secret in the Google Cloud Manager top-
// level directory, specified as `parent`, using the `secretID` provided
// as the name.
func CreateSecret(parent string, secretID string) (string, error) {

	// Create the client.
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		// The most likely causes of the error are:
		//     1 - google application creds failed
		//     2 - secret already exists
		return "", fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.CreateSecretRequest{
		Parent:   parent,
		SecretId: secretID,
		Secret: &secretmanagerpb.Secret{
			Replication: &secretmanagerpb.Replication{
				Replication: &secretmanagerpb.Replication_Automatic_{
					Automatic: &secretmanagerpb.Replication_Automatic{},
				},
			},
		},
	}

	// Call the API.
	result, err := client.CreateSecret(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to create secret: %v", err)
	}
	fmt.Printf("created secret: %s\n", result.Name)
	return result.Name, nil
}
```

### Add a New Secret Version

To store a payload, we need to create a version inside the secret namespace we've just created. Let's write a new function for creating versions that takes as input the full path to the secret, e.g. "projects/projectID/secrets/secretID" and the payload as a slice of bytes. It will return the path to the secret version, e.g. "projects/projectID/secrets/secretID/versions/1" and an error if one occurs.

```golang
// AddSecretVersion adds a new secret version to the given secret path with the
// provided payload.
func AddSecretVersion(path string, payload []byte) (string, error) {

	// Create the client.
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.AddSecretVersionRequest{
		Parent: path,
		Payload: &secretmanagerpb.SecretPayload{
			Data: payload,
		},
	}

	// Call the API.
	result, err := client.AddSecretVersion(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to add secret version: %v", err)
	}

	fmt.Printf("added secret version: %s\n", result.Name)
	return result.Name, nil
}
```

### Access an Existing Secret

To access a secret version, we need the full path to the secret version, which can reference the version number as a string (e.g. "5") or an alias (e.g. "latest"), i.e. "projects/projectID/secrets/secretID/versions/latest" or "projects/projectID/secrets/secretID/versions/5".

Our `AccessSecretVersion` will use this path to return the payload, else an error:

```golang
// AccessSecretVersion returns the payload for the given secret version if one
// exists.
func AccessSecretVersion(version string) ([]byte, error) {

	// Create the client.
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.AccessSecretVersionRequest{
		Name: version,
	}

	// Call the API.
	result, err := client.AccessSecretVersion(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to access secret version: %v", err)
	}

	fmt.Printf("retrieved payload for: %s\n", result.Name)
	return result.Payload.Data, nil
}
```

### Get All Secrets

If you try to add a secret to a project when that secret already exists, you'll get an error. For that reason, it will be useful to list out the secrets (again, these are the namespace keys, not the actual versions that store the encrypted payload). Our `ListSecrets` function will take as input the path to the `parent`, e.g. "projects/my-project", and returns a slice of strings representing the paths to the retrieved secrets, and a matching slice of errors for each failed retrieval.

```golang
// ListSecrets retrieves the names of all secrets in the project,
// given the `parent` (string).
func ListSecrets(parent string) (secrets []string, errors []error) {

	// Create the client.
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return secrets, append(errors, err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.ListSecretsRequest{
		Parent: parent,
	}

	// Call the API.
	it := client.ListSecrets(ctx, req)

	for {
		resp, err := it.Next()
		if err == iterator.Done {
			break
		}

		if err != nil {
			errors = append(errors, err)
			secrets = append(secrets, "")
			continue
		}
		secrets = append(secrets, resp.Name)
		errors = append(errors, nil)
	}
	return secrets, errors
}
```

### Delete a Secret

Secrets can be configured to automatically expire after a certain amount of time ([example here](https://github.com/rotationalio/knock/blob/main/knock.go#L58-L72)), but you can also delete them explicitly (assuming your [role permissions](https://cloud.google.com/secret-manager/docs/access-control) allow you delete access). Note that deletion is irreversible, and deleting a secret will delete all of the versions inside the namespace for that secret. Any service or workload that attempts to access a deleted secret receives a Not Found error.

Here's an example function that deletes a secret given the  path to the secret, e.g. "projects/projectID/secrets/secretID".

```golang
// DeleteSecret deletes the secret with the given `name`, and all of its versions.
func DeleteSecret(name string) error {

	// Create the client.
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.DeleteSecretRequest{
		Name: name,
	}

	// Call the API.
	if err := client.DeleteSecret(ctx, req); err != nil {
		return fmt.Errorf("failed to delete secret: %v", err)
	}
	return nil
}
```

With the ability to create, list, and delete secrets, and to add and access versions we're getting close to a complete Golang implementation that would allow you to systematically interact with the Secret Manager API from an application!

## Conclusion

The everyday systems we interact with increasingly store our private data, so the need to raise the bar on data encryption has never been stronger. The flexibility of tools like the Google Secret Manager API means that we can and should be securing all kinds of information; not just passwords and credentials, but other types of information such as personally identifiable information (PII), as well.

When it comes to security in big data systems, it's not about _if_ there will be a breach, but _when_. Prevention methods become out-of-date as soon as new attack vectors are devised, and there are no silver bullets. That's why security is (and should be!) hard. Thankfully, as we've seen in this post, with tools like Secret Manager, and its IAM controls, default encryption, and developer API, building software with a security-first principle can become more straightforward and programmatic.



## Further Reading

- [Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Initializing Cloud SDK](https://cloud.google.com/sdk/docs/initializing)
- [Authenticating as a service account](https://cloud.google.com/docs/authentication/production)
- [Creating a service account](https://cloud.google.com/docs/authentication/production#create_service_account)
- [Creating and Accessing Secrets](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets)
- [Using Secret Manager with Python by Katie McLaughlin](https://codelabs.developers.google.com/codelabs/secret-manager-python#0)
- [NodeJS Secret Manager](https://github.com/googleapis/nodejs-secret-manager)
- [A Go GCP Secret Manager by kioie](https://github.com/kioie/gsm)
