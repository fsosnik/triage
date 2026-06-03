/**
 * Phase 12: API Client
 */

class APIClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async orchestrate(task, context = '', constraints = []) {
    return { method: 'POST', path: '/orchestrate', body: { task, context, constraints } };
  }

  async getMetrics() {
    return { method: 'GET', path: '/metrics' };
  }

  async getPatterns() {
    return { method: 'GET', path: '/patterns' };
  }

  async getHealth() {
    return { method: 'GET', path: '/health' };
  }
}

module.exports = APIClient;
