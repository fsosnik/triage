/**
 * Phase 5: Observability & Monitoring
 * Real-time system health, alerts, dashboards
 */

const EventEmitter = require('events');

class Monitor extends EventEmitter {
  constructor() {
    super();
    this.alerts = [];
    this.metrics = {
      uptime: Date.now(),
      cycles_total: 0,
      errors_total: 0,
      cache_hit_rate: 0,
      avg_latency: 0,
      tokens_per_cycle: 0
    };
    this.thresholds = {
      error_rate_percent: 5,
      latency_ms: 5000,
      cache_hit_rate_percent: 75,
      memory_mb: 512
    };
  }

  recordMetric(name, value) {
    this.metrics[name] = value;
    this.checkThresholds(name, value);
  }

  checkThresholds(metric, value) {
    const threshold = this.thresholds[metric];
    if (!threshold) return;

    if (metric === 'error_rate_percent' && value > threshold) {
      this.emit('alert', {
        level: 'critical',
        metric,
        value,
        threshold,
        message: `Error rate ${value}% exceeds threshold ${threshold}%`
      });
    }

    if (metric === 'latency_ms' && value > threshold) {
      this.emit('alert', {
        level: 'warning',
        metric,
        value,
        message: `Latency ${value}ms exceeds threshold`
      });
    }

    if (metric === 'cache_hit_rate_percent' && value < threshold) {
      this.emit('alert', {
        level: 'info',
        metric,
        value,
        message: `Cache hit rate ${value}% below target ${threshold}%`
      });
    }
  }

  getHealthStatus() {
    const uptime = Date.now() - this.metrics.uptime;
    const errorRate = (this.metrics.errors_total / Math.max(1, this.metrics.cycles_total) * 100);

    return {
      status: errorRate > 10 ? 'unhealthy' : errorRate > 5 ? 'degraded' : 'healthy',
      uptime_seconds: Math.floor(uptime / 1000),
      error_rate: errorRate.toFixed(1),
      cycles: this.metrics.cycles_total,
      cache_hit_rate: this.metrics.cache_hit_rate,
      avg_latency_ms: this.metrics.avg_latency
    };
  }

  getAlerts() {
    return this.alerts.slice(-20);  // Last 20
  }

  clearAlerts() {
    this.alerts = [];
  }
}

module.exports = Monitor;
