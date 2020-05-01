const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
async function run() {

  try {
    const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
    const tagName = core.getInput('tag_name');
    if (!GITHUB_SHA) {
      core.setFailed('Missing GITHUB_SHA');
      return;
    }

    if (!GITHUB_TOKEN) {
      core.setFailed('Missing GITHUB_TOKEN');
      return;
    }

    if (!tagName) {
      core.setFailed('Missing tag_name');
      return;
    }


    const octokit = new GitHub(GITHUB_TOKEN);
    let ref;
    try {

      ref = await octokit.git.getRef({
        ...context.repo,
        ref: `tags/${tagName}`
      });
    } catch (e) {
      if (e.status === 404) {
        // Ignore tag not existing
      } else {
        throw e;
      }
    }
    if (!ref) {
      await octokit.git.createRef({
        ...context.repo,
        ref: `refs/tags/${tagName}`,
        sha: GITHUB_SHA
      });
    } else {
      await octokit.git.updateRef({
        ...context.repo,
        ref: `tags/${tagName}`,
        sha: GITHUB_SHA
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
