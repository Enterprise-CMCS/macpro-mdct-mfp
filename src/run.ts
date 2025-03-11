import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
import { execSync } from "child_process";
import readline from "node:readline";
import {
  CloudFormationClient,
  DeleteStackCommand,
  DescribeStacksCommand,
  waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { writeLocalUiEnvFile } from "./write-ui-env-file.js";

// load .env
dotenv.config();

const deployedServices = [
  "database",
  "uploads",
  "topics",
  "app-api",
  "ui",
  "ui-auth",
  "ui-src",
];

const project = process.env.PROJECT;
const region = process.env.REGION_A;

async function confirmDestroyCommand(stack: string) {
  const orange = "\x1b[38;5;208m";
  const reset = "\x1b[0m";

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = async (message: string) => {
    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  };

  const confirmation = await question(`
${orange}********************************* STOP *******************************
You've requested a destroy for:

    ${stack}

Continuing will irreversibly delete all data and infrastructure
associated with ${stack} and its nested stacks.

Do you really want to destroy it?
Re-enter the stack name (${stack}) to continue:
**********************************************************************${reset}
`);

  if (confirmation !== stack) {
    throw new Error(`
${orange}**********************************************************************
The destroy operation has been aborted.
**********************************************************************${reset}
`);
  }
}

// Function to update .env files using 1Password CLI
function updateEnvFiles() {
  try {
    execSync("op inject --in-file .env.tpl --out-file .env --force", {
      stdio: "inherit",
    });
    execSync(
      "op inject --in-file services/ui-src/.env.tpl --out-file services/ui-src/.env --force",
      { stdio: "inherit" }
    );
    execSync("sed -i '' -e 's/# pragma: allowlist secret//g' .env");
    execSync(
      "sed -i '' -e 's/# pragma: allowlist secret//g' services/ui-src/.env"
    );
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to update .env files using 1Password CLI.");
    process.exit(1);
  }
}

async function run_fe_locally(runner: LabeledProcessRunner) {
  const apiUrl = await getCloudFormationStackOutputValue(
    "mfp-localstack",
    "ApiUrl"
  );
  await writeLocalUiEnvFile(apiUrl!);
  runner.run_command_and_output("ui", ["npm", "start"], "services/ui-src");
}

async function run_cdk_watch(
  runner: LabeledProcessRunner,
  options: { stage: string }
) {
  await runner.run_command_and_output(
    "CDK watch",
    [
      "yarn",
      "cdk",
      "watch",
      "--context",
      `stage=${options.stage}`,
      "--no-rollback",
    ],
    "."
  );
}

function isColimaRunning() {
  try {
    return execSync("colima status", {
      encoding: "utf-8",
      stdio: "pipe",
    }).includes("running");
  } catch {
    return false;
  }
}

function isLocalStackRunning() {
  try {
    return execSync("localstack status", {
      encoding: "utf-8",
      stdio: "pipe",
    }).includes("running");
  } catch {
    return false;
  }
}

async function run_watch(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);

  run_cdk_watch(runner, options);
  run_fe_locally(runner);
}

async function getCloudFormationStackOutputValue(
  stackName: string,
  outputName: string
) {
  const cloudFormationClient = new CloudFormationClient({ region });
  const command = new DescribeStacksCommand({ StackName: stackName });
  const response = await cloudFormationClient.send(command);
  return response.Stacks?.[0]?.Outputs?.find(
    (output) => output.OutputKey === outputName
  )?.OutputValue;
}

async function run_local() {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);

  if (!isColimaRunning()) {
    throw "Colima needs to be running.";
  }

  if (!isLocalStackRunning()) {
    throw "LocalStack needs to be running.";
  }

  process.env.AWS_DEFAULT_REGION = "us-east-1";
  process.env.AWS_ACCESS_KEY_ID = "localstack";
  process.env.AWS_SECRET_ACCESS_KEY = "localstack";
  process.env.AWS_ENDPOINT_URL = "http://localhost:4566";

  await runner.run_command_and_output(
    "CDK local bootstrap",
    [
      "yarn",
      "cdklocal",
      "bootstrap",
      "aws://000000000000/us-east-1",
      "--context",
      "stage=localstack",
    ],
    "."
  );
  await runner.run_command_and_output(
    "CDK local prerequisite deploy",
    [
      "yarn",
      "cdklocal",
      "deploy",
      "--app",
      '"npx tsx deployment/prerequisites.ts"',
    ],
    "."
  );

  const deployPrequisitesCmd = [
    "yarn",
    "cdklocal",
    "deploy",
    "--app",
    '"npx tsx deployment/prerequisites.ts"',
  ];
  await runner.run_command_and_output(
    "CDK prerequisite deploy",
    deployPrequisitesCmd,
    "."
  );

  const deployCmd = [
    "yarn",
    "cdklocal",
    "deploy",
    "--context",
    "stage=localstack",
    "--all",
    "--no-rollback",
  ];
  await runner.run_command_and_output("CDK deploy", deployCmd, ".");

  const watchCmd = [
    "yarn",
    "cdklocal",
    "watch",
    "--context",
    "stage=localstack",
    "--no-rollback",
  ];

  runner.run_command_and_output("CDK watch", watchCmd, ".");
  run_fe_locally(runner);
}

// TODO: may not be needed anymore.
async function install_deps_for_services(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "Installing Dependencies",
    ["yarn", "install", "--frozen-lockfile"],
    `services/${service}`
  );
}

async function install_deps(runner: LabeledProcessRunner, service: string) {
  await runner.run_command_and_output(
    "Installing dependencies",
    ["yarn", "install", "--frozen-lockfile"],
    `services/${service}`
  );
}

async function prepare_services(runner: LabeledProcessRunner) {
  for (const service of deployedServices) {
    await install_deps(runner, service);
    // TODO: may not need the below? or the above?
    await runner.run_command_and_output(
      "Installing Dependencies",
      ["yarn", "install", "--frozen-lockfile"],
      `services/${service}`
    );
  }
}

async function deploy_prerequisites() {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);
  const deployPrequisitesCmd = [
    "yarn",
    "cdk",
    "deploy",
    "--app",
    '"npx tsx deployment/prerequisites.ts"',
  ];
  await runner.run_command_and_output(
    "CDK prerequisite deploy",
    deployPrequisitesCmd,
    "."
  );
}

const stackExists = async (stackName: string): Promise<boolean> => {
  const client = new CloudFormationClient({ region });
  try {
    await client.send(new DescribeStacksCommand({ StackName: stackName }));
    return true;
  } catch (error: any) {
    return false;
  }
};

async function deploy(options: { stage: string }) {
  const stage = options.stage;
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  // TODO: the line above or below, not both
  await prepare_services(runner);
  if (await stackExists("mfp-prerequisites")) {
    const deployCmd = [
      "yarn",
      "cdk",
      "deploy",
      "--context",
      `stage=${stage}`,
      "--method=direct",
      "--all",
    ];
    await runner.run_command_and_output("CDK deploy", deployCmd, ".");
  } else {
    console.error(
      "MISSING PREREQUISITE STACK! Must deploy it before attempting to deploy the application."
    );
  }
}

const waitForStackDeleteComplete = async (
  client: CloudFormationClient,
  stackName: string
) => {
  return waitUntilStackDeleteComplete(
    { client, maxWaitTime: 3600 },
    { StackName: stackName }
  );
};

async function destroy({
  stage,
  wait,
  verify,
}: {
  stage: string;
  wait: boolean;
  verify: boolean;
}) {
  const stackName = `${project}-${stage}`;

  if (/prod/i.test(stage)) {
    console.log("Error: Destruction of production stages is not allowed.");
    process.exit(1);
  }

  if (verify) await confirmDestroyCommand(stackName);

  const client = new CloudFormationClient({ region });
  await client.send(new DeleteStackCommand({ StackName: stackName }));
  console.log(`Stack ${stackName} delete initiated.`);

  if (wait) {
    console.log(`Waiting for stack ${stackName} to be deleted...`);
    const result = await waitForStackDeleteComplete(client, stackName);
    console.log(
      result.state === "SUCCESS"
        ? `Stack ${stackName} deleted successfully.`
        : `Error: Stack ${stackName} deletion failed.`
    );
  } else {
    console.log(
      `Stack ${stackName} delete initiated. Not waiting for completion as --wait is set to false.`
    );
  }

  await delete_topics(options);
}

async function delete_topics(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  let data = { project: "mfp", stage: options.stage };
  const deployCmd = [
    "sls",
    "invoke",
    "--stage",
    "main",
    "--function",
    "deleteTopics",
    "--data",
    JSON.stringify(data),
  ];
  await runner.run_command_and_output(
    "Remove topics",
    deployCmd,
    "services/topics"
  );
}

async function list_topics(options: { stage: string | undefined }) {
  const runner = new LabeledProcessRunner();
  await install_deps_for_services(runner);
  let data = { stage: options.stage };
  const deployCmd = [
    "sls",
    "invoke",
    "--stage",
    "main",
    "--function",
    "listTopics",
    "--data",
    JSON.stringify(data),
  ];
  await runner.run_command_and_output(
    "List topics",
    deployCmd,
    "services/topics"
  );
}

/*
 * The command definitons in yargs
 * All valid arguments to dev should be enumerated here, this is the entrypoint to the script
 */
yargs(process.argv.slice(2))
  .command(
    "watch",
    "run cdk watch and react together",
    { stage: { type: "string", demandOption: true } },
    run_watch
  )
  .command(
    "local",
    "run our app via cdk deployment to localstack locally and react locally together",
    {},
    run_local
  )
  .command(
    "deploy-prerequisites",
    "deploy the app's AWS account prerequisites with cdk to the cloud",
    () => {},
    deploy_prerequisites
  )
  .command(
    "deploy",
    "deploy the app with cdk to the cloud",
    { stage: { type: "string", demandOption: true } },
    deploy
  )
  .command(
    "destroy",
    "destroy a cdk stage in AWS",
    {
      stage: { type: "string", demandOption: true },
      wait: { type: "boolean", demandOption: false, default: true },
      verify: { type: "boolean", demandOption: false, default: true },
    },
    destroy
  )
  .command(
    "delete-topics",
    "delete topics tied to serverless stage",
    {
      stage: { type: "string", demandOption: true },
    },
    delete_topics
  )
  .command(
    "list-topics",
    "list topics for the project or for the stage",
    {
      stage: { type: "string", demandOption: false },
    },
    list_topics
  )
  .command(
    "update-env",
    "update environment variables using 1Password",
    () => {},
    updateEnvFiles
  )
  .scriptName("run")
  .strict()
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand
