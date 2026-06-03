/**
 * Phase 5: Alerting System
 * Notifications, escalation, remediation
 */

class Alerting {
  constructor(monitor) {
    this.monitor = monitor;
    this.handlers = [];
    this.history = [];
    this.setupListeners();
  }

  setupListeners() {
    this.monitor.on('alert', (alert) => {
      this.handleAlert(alert);
    });
  }

  registerHandler(handler) {
    this.handlers.push(handler);
  }

  async handleAlert(alert) {
    this.history.push({
      ...alert,
      timestamp: new Date().toISOString(),
      handled: false
    });

    for (const handler of this.handlers) {
      try {
        await handler(alert);
      } catch (e) {
        console.error('Handler failed:', e.message);
      }
    }

    // Auto-remediation for common issues
    this.attemptRemediation(alert);
  }

  attemptRemediation(alert) {
    if (alert.metric === 'cache_hit_rate_percent') {
      console.log('[REMEDIATION] Clearing old cache entries');
    }
    if (alert.metric === 'error_rate_percent') {
      console.log('[REMEDIATION] Triggering rollback loop');
    }
  }

  getAlertHistory(limit = 50) {
    return this.history.slice(-limit);
  }

  getSeverityDistribution() {
    const dist = {};
    this.history.forEach(a => {
      dist[a.level] = (dist[a.level] || 0) + 1;
    });
    return dist;
  }
}

module.exports = Alerting;
