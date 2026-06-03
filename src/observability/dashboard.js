/**
 * Phase 5: Dashboard
 * CLI & web dashboard for monitoring
 */

class Dashboard {
  constructor(monitor, alerting, tenantMgr, loadBalancer) {
    this.monitor = monitor;
    this.alerting = alerting;
    this.tenants = tenantMgr;
    this.lb = loadBalancer;
  }

  renderCLI() {
    const health = this.monitor.getHealthStatus();
    const alerts = this.alerting.getAlertHistory(5);
    
    return `
TRIAGE OS Dashboard
===================
Status: ${health.status.toUpperCase()}
Uptime: ${health.uptime_seconds}s
Cycles: ${health.cycles}
Error Rate: ${health.error_rate}%
Cache Hits: ${health.cache_hit_rate}%

Load: ${this.lb?.getMetrics()?.utilization || 'N/A'}
Tenants: ${this.tenants?.listTenants()?.length || 0}

Recent Alerts:
${alerts.map(a => `  [${a.level}] ${a.message}`).join('\n')}
    `;
  }

  renderJSON() {
    return {
      health: this.monitor.getHealthStatus(),
      alerts: this.alerting.getAlertHistory(10),
      severity_dist: this.alerting.getSeverityDistribution(),
      load_metrics: this.lb?.getMetrics?.(),
      timestamp: new Date().toISOString()
    };
  }

  export(format = 'json') {
    return format === 'json' ? this.renderJSON() : this.renderCLI();
  }
}

module.exports = Dashboard;
