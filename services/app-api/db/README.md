# db:seed

This directory contains files to seed the MFP database via command line with interactive prompts.

## Setup

1. Set environment variables for `SEED_ADMIN_USER`, `SEED_ADMIN_PASSWORD`, `SEED_STATE_USER`, `SEED_STATE_PASSWORD`, `SEED_STATE`, and `SEED_STATE_NAME`
2. Start MFP locally
3. In a new terminal, run `yarn db:seed`

## Using the script

### Work Plan (WP)

Choosing this option will reveal more options to create a WP with a specific status. You can also get a single WP or all WPs from a state, and the JSON resppnse will print in the terminal.

### Semi-Annual Report (SAR)

Choosing this option will reveal more options to create a SAR with a specific status. Creating a SAR also creates an approved WP to associate with it. You can also get a single SAR or all SARs from a state, and the JSON resppnse will print in the terminal.

### Create filled WP and filled SAR

Choosing this option will create two WPs, one filled out but not submitted WP and one approved WP, and a filled out by not submitted SAR.

### Banner

Choosing this option will reveal options to create, get, or delete a banner with the `admin-banner-id` key.
