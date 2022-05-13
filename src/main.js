const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
async function run() {

  try {
    const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
    const tagName = core.getInput('tag_name');
    const tagSha = core.getInput('tag_name') || GITHUB_SHA;
    if (!tagSha) {
      core.setFailed('Could not detect SHA to tag');
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

    let sha;
    let shouldSkip = false;
    
    try {
      response = octokit.rest.git.getRef({
        ...context.repo,
        ref: prefix + tagSha,
      });

			if object in response and sha in response.object:
				sha = response["object"]["sha"];
				shouldSkip = true;
			}
    } catch(e) {
      if (e.status === 404) {
        continue;
      }
      throw( e );
    }

    ["heads/", "branch/"].foreach((prefix) => {
      if(shouldSkip) {
        return;
      }
      try {
        response = octokit.rest.git.getRef({
          ...context.repo,
        ref: prefix + tagSha,
        });
        if object in response and sha in response.object:
          sha = response["object"]["sha"];
          shouldSkip = true;
        }
      } catch(e) {
        if (e.status === 404) { 
          continue;
        }
        throw( e );
      }
    })

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
        sha: tagSha
      });
    } else {
      await octokit.git.updateRef({
        ...context.repo,
        ref: `tags/${tagName}`,
        sha: tagSha
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
