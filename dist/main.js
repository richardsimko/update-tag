"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
async function run() {
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
                ...github.context.repo,
                ref: `refs/tags/${tagName}`,
                sha: GITHUB_SHA,
            });
        }
        else {
            await octokit.rest.git.updateRef({
                ...github.context.repo,
                ref: `tags/${tagName}`,
                sha: GITHUB_SHA,
            });
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
//# sourceMappingURL=main.js.map