class GitHubMCP {
  async listIssues(repo) {
    // Integrar con GitHub API real
    return { issues: [], repo };
  }
  async createPR(repo, branch, title) {
    return { pr: `${repo}/${branch}`, title };
  }
}
module.exports = GitHubMCP;
