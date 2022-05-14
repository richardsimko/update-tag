const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');
async function run() {
  try {
    const {GITHUB_SHA, GITHUB_TOKEN} = process.env;
    const tagName = core.getInput('tag_name');
    const tagRef = core.getInput('tag_ref');

    let sha;
    if (!tagRef) {
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
      console.log("Checking if we're a commit hash")
      try {
        response = await octokit.git.getCommit({
          ...context.repo,
          commit_sha: tagRef,
        });

        if ('object' in response && 'sha' in response.object) {
          sha = response.object.sha;
        }
      } catch (e) {
        if (e.status != 404) {
          throw ( e );
        }
      }
    }

    for (const prefix of ['heads/', 'tags/']) {
      if (sha !== undefined) {
        break;
      }
      let requestRef = prefix + tagRef
      console.log(`Checking if prefix ${requestRef}`)
      try {
        console.log(requestRef);
        response = await octokit.git.getRef({
          ...context.repo,
          ref: requestRef,
        });
        if ('object' in response && 'sha' in response.object) {
          sha = response.object.sha;
        }
      } catch (e) {
        if (e.status == 404) {
            continue
        }
        throw ( e );
      }
    }

    if (sha === undefined) {
      core.setFailed(
          `ref ${tagRef} could not be detected as a sha, branch, or tag!`);
      return;
    }

    console.log(`Found ref ${tagRef} as commit ${sha}`)

    let ref;
    try {
      console.log(`Seeing if tag ${tagName} already exists`);
      ref = await octokit.git.getRef({
        ...context.repo,
        ref: `tags/${tagName}`,
      });
      console.log(`Tag ${tagName} already exists`);
    } catch (e) {
      if (e.status == 404) {
        console.log(`Tag ${tagName} does not already exist`);
        // Ignore tag not existing
      } else {
        throw e;
      }
    }
    if (!ref) {
      console.log(`Creating tag ${tagName}`);
      await octokit.git.createRef({
        ...context.repo,
        ref: `refs/tags/${tagName}`,
        sha: sha,
      });
    } else {
      console.log(`Updating tag ${tagName}`);
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
