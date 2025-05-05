// cleanup-workflows.js
const { Octokit } = require("@octokit/rest");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "your-org-or-username"; // <-- change this
const REPO = "your-repo"; // <-- change this

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function cleanupWorkflowRuns() {
  const workflows = await octokit.rest.actions.listRepoWorkflows({
    owner: OWNER,
    repo: REPO,
    per_page: 100,
  });

  for (const workflow of workflows.data.workflows) {
    console.log(`Cleaning workflow: ${workflow.name}`);

    let page = 1;
    let runs;
    do {
      runs = await octokit.rest.actions.listWorkflowRuns({
        owner: OWNER,
        repo: REPO,
        workflow_id: workflow.id,
        per_page: 100,
        page,
      });

      for (const run of runs.data.workflow_runs) {
        console.log(`- Deleting run: ${run.id} (${run.status})`);
        await octokit.rest.actions.deleteWorkflowRun({
          owner: OWNER,
          repo: REPO,
          run_id: run.id,
        });
      }

      page++;
    } while (runs.data.workflow_runs.length > 0);
  }

  console.log("Cleanup complete!");
}

cleanupWorkflowRuns().catch((error) => {
  console.error("Error during cleanup:", error);
});
