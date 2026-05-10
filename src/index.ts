import dotenv from "dotenv";
import { Octokit } from "octokit";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function main() {
  const prs = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: "microsoft",
    repo: "vscode",
    state: "open",
    per_page: 5,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  console.log("Open PRs:");
  prs.data.forEach((pr) => {
    console.log(`#${pr.number} - ${pr.title}`);
  });

  const firstPrNumber = prs.data[1].number;

  const files = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: "microsoft",
      repo: "vscode",
      pull_number: firstPrNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(`\nFiles changed in PR #${firstPrNumber}:`);

  files.data.forEach((file) => {
    console.log({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch?.slice(0, 300),
    });
  });
}

main();