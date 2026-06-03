/**
 * Phase 8: GitHub Integration
 */

class GitHubConnector {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://api.github.com';
    this.endpoints = {
      issues: '/repos/{owner}/{repo}/issues',
      pulls: '/repos/{owner}/{repo}/pulls',
      webhook: '/repos/{owner}/{repo}/hooks'
    };
  }

  async getIssues(owner, repo, state = 'open') {
    return {
      endpoint: `${this.baseUrl}${this.endpoints.issues}`,
      params: { owner, repo, state },
      method: 'GET'
    };
  }

  async createIssue(owner, repo, title, body) {
    return {
      endpoint: `${this.baseUrl}${this.endpoints.issues}`,
      method: 'POST',
      data: { title, body }
    };
  }

  async getPullRequests(owner, repo) {
    return {
      endpoint: `${this.baseUrl}${this.endpoints.pulls}`,
      params: { owner, repo },
      method: 'GET'
    };
  }

  registerWebhook(owner, repo, url) {
    return {
      endpoint: `${this.baseUrl}${this.endpoints.webhook}`,
      method: 'POST',
      data: {
        name: 'web',
        active: true,
        events: ['issues', 'pull_request', 'push'],
        config: { url, content_type: 'json' }
      }
    };
  }

  parseWebhook(payload) {
    if (payload.action === 'opened' && payload.issue) {
      return { type: 'issue_opened', issue: payload.issue };
    }
    if (payload.action === 'opened' && payload.pull_request) {
      return { type: 'pr_opened', pr: payload.pull_request };
    }
    return null;
  }
}

module.exports = GitHubConnector;
