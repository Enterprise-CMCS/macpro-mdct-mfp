# Postman Collection

This directory contains the Postman collection and environment configuration for MFP.

## Prerequisites

- [Postman](https://www.postman.com/downloads/)

## Setup

1. Open Postman
   > If this is your first time you will need to create an account. If your organization has Google SSO you can use that for ease.
2. Click "Import" in your workspace
3. Select the [MFP.postman_collection.json](./MFP.postman_collection.json) file from this folder and import it
4. Repeat steps 2 and 3 with the [environment](./MFP.postman_environment.json) file
5. Go to the MFP environment page (option in left sidebar) and set the following values:

- `state` will be the two letter abbreviation of the state associated with the state user you typically use locally. Ex: TX
- `stateName` will be the full name of the associated state. Ex: Texas

Unfortunately this GitHub repository will not automatically update your collection. If you need to update your local collection with the latest changes, repeat steps 2–4 above.

## Using the collection

### Folders

The collection has three folders: Banners, WP, and SAR. Each folder contains associated API requests. Some requests use state user credentials and some use admin user credentials. You can see which under the "Authorization" tab of any given request. Many requests have a "Body" as well. These are set with a reasonable default for that request. If you find issues with the bodies of requests, or you update the associated APIs, please update this collection.

### Environment

Ensure you've set your workspace environment to the MFP environment. The dropdown for this is in the upper right of your workspace view. It will say "No Environment" if you have none selected. Next to this dropdown is a quick access menu that is convenient for updating values without leaving the collections view. Simply hover over a table item and click the pencil icon to update the "Current value".

### Getting credentials

1. Start MFP locally
2. In your browser, log in as a state or admin user
3. Open the network tab and select any request that hit your local api (the banner request on the homepage is an easy choice)
4. Scroll to the bottom of the request headers and copy the `x-api-key` value
5. Paste this value in your environment "Current value" cell for that user type
6. Repeat steps 2–5 for the other user type

These credentials are valid for about 20 minutes. You can reuse the same credentials even after restarting MFP locally. If you change state users, you will need to get new credentials and update the `state` and `stateName` values in the environment.

### Working with reports

Requests in the WP and SAR folders interact with the associated reports. If you create a WP or SAR report, either in the browser or in Postman, be sure to copy the report `id` and put that in the MFP environment under `wp-id` or `sar-id` as appropriate. This ensures future requests, like filling out or submitting a report, interact with the expected report.

## Full example flow

At any time you can refresh the browser to verify each step

1. Perform steps 1–6 from [Getting credentials](#getting-credentials)
2. Open the "WP" folder
3. Go to "Create WP" and click "Send"
4. Copy the `id` from the response and put that in the `wp-id` environment variable
5. Select "Fill out WP Report" and click "Send"
6. Select "Submit WP Report" and click "Send"
7. Select "Approve WP Report" and click "Send"

You've now created, completely filled out, submitted, and approved a Work Plan report. You can repeat this with the SAR to finish the full app flow.
