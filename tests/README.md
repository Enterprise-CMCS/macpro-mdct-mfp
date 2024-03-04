# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Getting Started

1. The `scripts` section defines 2 jobs:
   - `yarn test`
     - runs two parallel processes:
       1. `yarn start`, which is a wrapper to `./dev local`, and runs the local application
       1. `yarn cypress`, which opens cypress using chrome against the local instance
   - `yarn test:ci`
     - to be run in pipelines/actions
     - runs cypress headless against the branch-specific instance of the application
     - can also be used locally to run the test suite in the terminal (requires you to run ./dev local separately)

## Configuration

`cypress.config.js` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Running tests

To run cypress tests locally you will go to the root of the project and you'll need to pass in environment variables for the state user and admin user passwords.
The final command will look something like this:

`CYPRESS_ADMIN_USER_PASSWORD=passwordhere CYPRESS_STATE_USER_PASSWORD=passwordhere yarn test`

_These variables are included in GitHub secrets for CI stages._

These are the same passwords you use to log in with Cognito locally. If you don't have these passwords you can find them in AWS SSM parameters in the mdct-mfp-dev account. Look for the parameter with a name like `/configuration/default/cognito/bootstrapUsers/password`. Ask a repository contributor for help if needed.

## Troubleshooting

If you run into errors after trying to run the cypress test command:

- run `yarn` in this folder
- run `nvm use` in the root directory
