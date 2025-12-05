import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";
import { createPrBody } from "./commit-list";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const prLabel = process.env.PR_LABEL!;
const prNumber = process.env.PR_NUMBER!;

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });

  const { data: commits } = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number: Number(prNumber),
    per_page: 100,
  });

  const body = await createPrBody({ commits, octokit, owner, prLabel, repo });

  octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: Number(prNumber),
    body,
  });
}

run();
