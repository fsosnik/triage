/**
 * Phase 12: REST API Server
 */

class APIServer {
  constructor(triageOS, port = 3000) {
    this.os = triageOS;
    this.port = port;
    this.routes = new Map();
    this.setupRoutes();
  }

  setupRoutes() {
    this.route('POST', '/orchestrate', this.handleOrchestrate.bind(this));
    this.route('GET', '/metrics', this.handleMetrics.bind(this));
    this.route('GET', '/patterns', this.handlePatterns.bind(this));
    this.route('GET', '/health', this.handleHealth.bind(this));
  }

  route(method, path, handler) {
    const key = `${method}:${path}`;
    this.routes.set(key, handler);
  }

  async handleRequest(method, path, body) {
    const key = `${method}:${path}`;
    const handler = this.routes.get(key);
    if (!handler) return { status: 404, body: { error: 'Not found' } };
    
    try {
      const result = await handler(body);
      return { status: 200, body: result };
    } catch (error) {
      return { status: 500, body: { error: error.message } };
    }
  }

  async handleOrchestrate(body) {
    return this.os.orchestrate(body);
  }

  async handleMetrics(body) {
    return this.os.getMetrics();
  }

  async handlePatterns(body) {
    return { count: this.os.patterns.length, patterns: this.os.patterns.slice(0, 10) };
  }

  async handleHealth(body) {
    return {
      status: 'healthy',
      version: '0.12.0',
      cycles: this.os.metrics.total_cycles
    };
  }

  getRoutes() {
    return Array.from(this.routes.keys());
  }
}

module.exports = APIServer;
