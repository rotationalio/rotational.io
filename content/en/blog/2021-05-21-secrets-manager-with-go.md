---
title: "Using the Google Secrets API with Go"
slug: "secrets-manager-with-go"
date: "2021-05-21T08:26:38-04:00"
draft: true
image_webp: images/blog/doorknocker.webp
image: images/blog/doorknocker.jpg
author: Rebecca Bilbro
description: "Add Description Here"
---

Security is by definition an inconvenience. At the very least, it's about making access to data as challenging as possible, which can be measured in computation time. But good security also requires us to go above and beyond &mdash; adopting architectural and engineering practices that involve more forethought, more effort, and more testing than are strictly required to get a basic application running on the web. If you're here already, we don't need to convince you that the effort is well worth it; good security pays for itself in customer trust, not to mention helping to preclude the kinds of breaches that can (and should) bankrupt the careless. In this post, we'll dive into Google's Secret Manager service, walk through the setup steps, and explore some Go code to interact with the API.

The example code can be found at: [github.com/rotationalio/knock](https://github.com/rotationalio/knock).

## What is Google Secret Manager?

Google Secret Manager is a hosted service that allows users to store, manage, and access secure information. Information stored in Secret Manager is encrypted by default, and can only be accessed by an application if it has been granted valid credentials.

One of the big advantages of the Secret Manager implementation is it's flexibility in terms of what can be stored. These "secrets" can be text or arbitrary bytes (well, almost; there is a [64KiB limit](https://cloud.google.com/secret-manager/quotas)); meaning they can be passwords, API keys, or certificates.

Secrets are stored using a namespace-like convention, where the key that references the payload value takes the form of a path, e.g. `projects/projectID/secrets/exampleSecret`. Rather than storing encrypted payload data on the secret itself, Secret Manager exposes `versions` that store the actual secret data. When retrieving payloads, you retrieve them from the version, e.g. `projects/projectID/secrets/exampleSecret/versions/2`, which is immutable.


### SDK
download and install the sdk & add to PATH

### Project config
configure your Google Cloud project to use Secret Manager
https://cloud.google.com/secret-manager/docs/configuring-secret-manager

use the UI to
- create a new project (e.g. "knock-knock")
- enable the Google Secrets API for that project

run `gcloud init` to authenticate -- open a browser window where you'll select the correct gcloud account. Back on the command line, select the new project you just made.

### Assign IAM
your project > members > your name (edit) > add role > "Secret Manager Secret Version Manager"

### Make a Service Account

```bash
gcloud iam service-accounts create jeeves
gcloud projects add-iam-policy-binding knock-knock --member="serviceAccount:jeeves@knock-knock.iam.gserviceaccount.com" --role="roles/owner"
gcloud iam service-accounts keys create knock.json --iam-account=jeeves@knock-knock.iam.gserviceaccount.com
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/knock.json"
export GOOGLE_PROJECT_NAME="knock-knock"
```

### Create a New Secret

```golang
```

The secret payload is in `result.Payload.Data`.

### Access an Existing Secret

### Get All Secrets

### Delete a Secret


## Further Reading

- [Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Initializing Cloud SDK](https://cloud.google.com/sdk/docs/initializing)
- [Authenticating as a service account](https://cloud.google.com/docs/authentication/production)
- [Creating a service account](https://cloud.google.com/docs/authentication/production#create_service_account)
- [Creating and Accessing Secrets](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets)
- [A Go GCP Secret Manager by kioie](https://github.com/kioie/gsm)