function cleanMessage(msg: string) {
  let m = msg;
  // Remove PR number
  m = m.replace(/\(#\d+\)$/, "");
  // Remove CMDCT tickets
  m = m.replace(/cmdct[ -]?\d+/gi, "");
  // Remove brackets
  m = m.replace(/\[[^\]]+\]/g, "");
  // Remove non-alphanumeric characters
  m = m.replace(/^[^a-zA-Z0-9()"]+|[^a-zA-Z0-9()"]+$/g, "");
  // Remove leading/trailing whitespaces
  return m.trim();
}

// Extract PR number from the end of the commit message. e.g. (#12345)
function extractPrNumber(line: string) {
  const match = line.match(/\(#(\d+)\)$/);
  return match ? match[1] : null;
}

// Extract CMDCT tickets
function extractTickets(text: string) {
  const lower = text.toLowerCase();
  const tickets = new Set();
  // Match with or without -
  const regex = /cmdct[ -]?(\d+)/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    tickets.add(`CMDCT-${match[1]}`);
  }
  return [...tickets];
}

async function formatMessage({ message, octokit, owner, repo }: any) {
  const cleaned = cleanMessage(message);
  const prNumber = extractPrNumber(message);
  let tickets = extractTickets(message);

  // If no tickets are in message, get it from the PR body
  if (tickets.length === 0 && prNumber) {
    const prBody = await fetchPrBody({ octokit, owner, prNumber, repo });
    tickets = extractTickets(prBody.toLowerCase());
  }

  const ticketText = tickets.length > 0 ? `(${tickets.join(", ")})` : "";
  return `- ${cleaned} ${ticketText}`;
}

async function fetchPrBody({ octokit, owner, prNumber, repo }: any) {
  try {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    return data.body || "";
  } catch (err: any) {
    console.error(`Error fetching PR ${prNumber}:`, err.message);
    return "";
  }
}

export async function commitList({ commits, octokit, owner, repo }: any) {
  const lines = [];
  // Filter merge commits
  const prCommits = commits.filter((commit: any) => commit.parents.length == 1);
  // Use first line of commit message only
  const commitMessages = prCommits.map((commit: any) =>
    commit.commit.message.split("\n")[0].trim()
  );

  for (const message of commitMessages) {
    const line = await formatMessage({ message, octokit, owner, repo });
    lines.push(line);
  }

  return lines.reverse().join("\n");
}
