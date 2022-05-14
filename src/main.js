const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');
async function run() {
  try {
    const {GITHUB_SHA, GITHUB_TOKEN} = process.env;
    const tagName = core.getInput('tag_name');
    const tagSha = core.getInput('tag_name');

    let sha;
    if (!tagSha) {
      sha = GITHUB_SHA;
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

    if (sha === undefined) {
      try {
        response = octokit.git.getRef({
          ...context.repo,
          ref: prefix + tagSha,
        });

        if ('object' in response && 'sha' in response.object) {
          sha = response.object.sha;
        }
      } catch (e) {
        if (e.status === 404) {}
        throw ( e );
      }
    }

    ['heads/', 'branch/'].foreach((prefix) => {
      if (sha !== undefined) {
        return;
      }
      try {
        response = octokit.rest.git.getRef({
          ...context.repo,
          ref: prefix + tagSha,
        });
        if ('object' in response && 'sha' in response.object) {
          sha = response.object.sha;
        }
      } catch (e) {
        if (e.status === 404) {
          return;
        }
        throw ( e );
      }
    });

    if (sha === undefined) {
      core.setFailed(
          'ref ${tagSha} could not be detected as a sha, branch, or tag!');
      return;
    }

    let ref;
    try {
      ref = await octokit.git.getRef({
        ...context.repo,
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
      await octokit.git.createRef({
        ...context.repo,
        ref: `refs/tags/${tagName}`,
        sha: sha,
      });
    } else {
      await octokit.git.updateRef({
        ...context.repo,
        ref: `tags/${tagName}`,
        sha: sha,
      });
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
