/**
 * Phase 16: Production Health Checks
 */

class HealthCheck {
  constructor() {
    this.checks = [];
  }

  async check(name, fn) {
    const startTime = Date.now();
    try {
      const result = await fn();
      this.checks.push({
        name,
        status: 'healthy',
        duration: Date.now() - startTime,
        message: result
      });
      return true;
    } catch (error) {
      this.checks.push({
        name,
        status: 'unhealthy',
        duration: Date.now() - startTime,
        error: error.message
      });
      return false;
    }
  }

  async runAll() {
    const healthy = this.checks.filter(c => c.status === 'healthy').length;
    const unhealthy = this.checks.filter(c => c.status === 'unhealthy').length;

    return {
      timestamp: new Date().toISOString(),
      total: this.checks.length,
      healthy,
      unhealthy,
      status: unhealthy === 0 ? 'green' : 'red',
      checks: this.checks
    };
  }

  clear() {
    this.checks = [];
  }
}

module.exports = HealthCheck;
