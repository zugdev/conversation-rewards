import { config } from "dotenv";
import { IssueParams, parseGitHubUrl } from "../start";
import linkPulls from "./link-pulls";

import ISSUE_CROSS_REPO_LINK from "./fixtures/issue-89.json"; // pr188 is linked to this issue
import ISSUE_SAME_REPO_LINK from "./fixtures/issue-90.json"; // pr91 is linked to this issue
import ISSUE_NO_LINK from "./fixtures/issue-92.json"; // no link

import PR_CROSS_REPO_LINK from "./fixtures/pr-188.json";
import PR_SAME_REPO_LINK from "./fixtures/pr-91.json";

const PARAMS_ISSUE_CROSS_REPO_LINK: IssueParams = parseGitHubUrl(ISSUE_CROSS_REPO_LINK.html_url); // cross repo link
const PARAMS_ISSUE_SAME_REPO_LINK: IssueParams = parseGitHubUrl(ISSUE_SAME_REPO_LINK.html_url); // same repo link
const PARAMS_ISSUE_NO_LINK: IssueParams = parseGitHubUrl(ISSUE_NO_LINK.html_url); // no link
// const PARAMS_PR_CROSS_REPO_LINK: IssueParams = parseGitHubUrl(PR_CROSS_REPO_LINK.html_url);
// const PARAMS_PR_SAME_REPO_LINK: IssueParams = parseGitHubUrl(PR_SAME_REPO_LINK.html_url);

config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.warn("GITHUB_TOKEN is not set");
}
// Mock process.argv
process.argv = ["path/to/node", "path/to/script", `--auth=${GITHUB_TOKEN}`];

describe("mock scenarios", () => {
  it("should return null if there is no link event on the issue", async () => {
    const result = await linkPulls(PARAMS_ISSUE_NO_LINK);
    expect(result).toEqual([]);
  });

  it("should find the merged, linked PULL REQUESTS, starting from the ISSUE, in the SAME REPOSITORY", async () => {
    const result = await linkPulls(PARAMS_ISSUE_SAME_REPO_LINK);
    const expectedUrl = PR_SAME_REPO_LINK.html_url;
    const matchingLinks = result.filter((link) => link.source.issue.html_url === expectedUrl);
    expect(matchingLinks.length).toBe(1);
  });

  it("should find the merged, linked PULL REQUESTS, starting from the ISSUE, across ANY REPOSITORY (within the organization)", async () => {
    const result = await linkPulls(PARAMS_ISSUE_CROSS_REPO_LINK);
    const expectedUrl = PR_CROSS_REPO_LINK.html_url;
    const matchingLinks = result.filter((link) => link.source.issue.html_url === expectedUrl);
    expect(matchingLinks.length).toBe(1);
  });
});

describe("real scenarios", () => {
  it("ubiquibot/comment-incentives/issues/22: should find the merged, linked PULL REQUESTS, starting from the ISSUE, in the SAME REPOSITORY", async () => {
    const result = await linkPulls(parseGitHubUrl("https://github.com/ubiquibot/comment-incentives/issues/22"));
    const expectedUrl = "https://github.com/ubiquibot/comment-incentives/pull/25";
    result.forEach((res) => expect(res.source.issue.html_url).toMatch(/\/pull\/\d+$/));
    const matchingLinks = result.filter((res) => res.source.issue.html_url === expectedUrl);
    expect(matchingLinks.length).toBeGreaterThan(0);
  });

  it("ubiquibot/comment-incentives/issues/3: should find the merged, linked PULL REQUESTS, starting from the ISSUE, in the SAME REPOSITORY", async () => {
    const result = await linkPulls(parseGitHubUrl("https://github.com/ubiquibot/comment-incentives/issues/3"));
    const expectedUrl = "https://github.com/ubiquibot/comment-incentives/pull/4";
    result.forEach((res) => expect(res.source.issue.html_url).toMatch(/\/pull\/\d+$/));
    const matchingLinks = result.filter((res) => res.source.issue.html_url === expectedUrl);
    expect(matchingLinks.length).toBeGreaterThan(0);
  });

  it("ubiquibot/comment-incentives/issues/15: should find the merged, linked PULL REQUESTS, starting from the ISSUE, in the SAME REPOSITORY", async () => {
    const result = await linkPulls(parseGitHubUrl("https://github.com/ubiquibot/comment-incentives/issues/15"));
    const expectedUrl = "https://github.com/ubiquibot/comment-incentives/pull/16";
    result.forEach((res) => expect(res.source.issue.html_url).toMatch(/\/pull\/\d+$/));
    const matchingLinks = result.filter((res) => res.source.issue.html_url === expectedUrl);
    expect(matchingLinks.length).toBeGreaterThan(0);
  });

  it("ubiquibot/comment-incentives/issues/19: should find the merged, linked PULL REQUESTS, starting from the ISSUE, in the SAME REPOSITORY", async () => {
    const result = await linkPulls(parseGitHubUrl("https://github.com/ubiquibot/comment-incentives/issues/19"));
    const expectedUrls = ["https://github.com/ubiquibot/comment-incentives/pull/21", "https://github.com/ubiquibot/comment-incentives/pull/23"];
    expectedUrls.forEach((url) => {
      const matchingLinks = result.filter((res) => res.source.issue.html_url === url);
      expect(matchingLinks.length).toBeGreaterThan(0);
    });
  });
});

// @DEV: no need to over-engineer. We only need to link the pull request from the issue, not the other way around.

// it("should find the linked ISSUE, starting from the PULL REQUEST, in the SAME REPOSITORY", async () => {
//   const result = await linkPulls(PARAMS_PR_SAME_REPO_LINK);

//   const expected = [{ issue: { node_id: ISSUE_SAME_REPO_LINK.node_id } }];
//   expect(result).toMatchObject(expected);
// });

// it("should find the linked ISSUE, starting from the PULL REQUEST, across ANY REPOSITORY (within the organization)", async () => {
//   const result = await linkPulls(PARAMS_PR_CROSS_REPO_LINK);
//   const expected = [{ issue: { node_id: ISSUE_CROSS_REPO_LINK.node_id } }];
//   expect(result).toMatchObject(expected);
// });
