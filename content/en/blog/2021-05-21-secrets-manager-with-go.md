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



### SDK
download and install the sdk & add to PATH

### Project config
configure your Google Cloud project to use Secret Manager
https://cloud.google.com/secret-manager/docs/configuring-secret-manager

use the UI to
- create a new project
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