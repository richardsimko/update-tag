import * as github from '@actions/github';

async function run() {
  // @actions/core is ESM-only as of v3; it must be loaded via dynamic import
  // since this project compiles to CommonJS.
  const core = await import('@actions/core');
  try {
    const { GITHUB_SHA } = process.env;
    let { GITHUB_TOKEN } = process.env;
    const tagName = core.getInput('tag_name');
    if (!GITHUB_SHA) {
      core.setFailed('Missing GITHUB_SHA');
      return;
    }

    if (!GITHUB_TOKEN) {
      GITHUB_TOKEN = core.getInput('github_token');
    }

    if (!tagName) {
      core.setFailed('Missing tag_name');
      return;
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);
    let ref;
    try {
      ref = await octokit.rest.git.getRef({
        ...github.context.repo,
        ref: `tags/${tagName}`,
      });
    } catch (e) {
      if (e.status === 404) {
        // Ignore tag not existing
      } else {
        throw e;
      }
    }
    if (!ref) {
      await octokit.rest.git.createRef({
        ...github.context.repo,
        ref: `refs/tags/${tagName}`,
        sha: GITHUB_SHA,
      });
    } else {
      await octokit.rest.git.updateRef({
        ...github.context.repo,
        ref: `tags/${tagName}`,
        sha: GITHUB_SHA,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
