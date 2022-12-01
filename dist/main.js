"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const context = github_1.default.context;
async function run() {
    try {
        const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
        const tagName = core_1.default.getInput("tag_name");
        if (!GITHUB_SHA) {
            core_1.default.setFailed("Missing GITHUB_SHA");
            return;
        }
        if (!GITHUB_TOKEN) {
            core_1.default.setFailed("Missing GITHUB_TOKEN");
            return;
        }
        if (!tagName) {
            core_1.default.setFailed("Missing tag_name");
            return;
        }
        const octokit = github_1.default.getOctokit(GITHUB_TOKEN);
        let ref;
        try {
            ref = await octokit.rest.git.getRef({
                ...context.repo,
                ref: `tags/${tagName}`,
            });
        }
        catch (e) {
            if (e.status === 404) {
                // Ignore tag not existing
            }
            else {
                throw e;
            }
        }
        if (!ref) {
            await octokit.rest.git.createRef({
                ...context.repo,
                ref: `refs/tags/${tagName}`,
                sha: GITHUB_SHA,
            });
        }
        else {
            await octokit.rest.git.updateRef({
                ...context.repo,
                ref: `tags/${tagName}`,
                sha: GITHUB_SHA,
            });
        }
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
}
run();
//# sourceMappingURL=main.js.map