# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Getting Started

1. The `scripts` section defines 2 jobs:
   - `yarn test`
     - runs two parallel processes:
       1. `yarn start`, which is a wrapper to `./run local`, and runs the local application
       1. `yarn cypress`, which opens cypress using chrome against the local instance
   - `yarn test:ci`
     - to be run in pipelines/actions
     - runs cypress headless against the branch-specific instance of the application
     - can also be used locally to run the test suite in the terminal (requires you to run ./run local separately)

## Configuration

`cypress.config.js` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Running tests

To run cypress tests locally you will go to the root of the project and you'll need an upadated .env with variables for the state user and admin user passwords. To accomplish this ther are multiple options. 

1. If you have a 1Password account and 1Password CLI installed locally you can run 
`./run update-env` to pull values from 1Password and create an updated .env

2. Alternatively, if you do not have a 1Password account you can copy the contents of the `.env.tpl` file to a `.env` file at the top level of the repo and reach out to the team for appropriate values to be populated by hand.

3. When you have an updated `.env` file can run tests from the top level of the repo using the `yarn test` command.


## Troubleshooting

If you run into errors after trying to run the cypress test command:

- run `yarn` in this folder
- run `nvm use` in the root directory
