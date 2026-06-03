/**
 * Phase 9: Reporting
 * Generate reports from analytics
 */

class Reporter {
  constructor(analyticsEngine) {
    this.analytics = analyticsEngine;
  }

  generateSummary() {
    const metrics = this.analytics.getMetrics();
    return `
TRIAGE OS Analytics Report
==========================

Performance:
  Total Cycles: ${metrics.cycles_total}
  Success Rate: ${metrics.success_rate}
  Avg Duration: ${metrics.avg_duration}
  Avg Tokens: ${metrics.avg_tokens}

Totals:
  Successful: ${metrics.success_total}
  Errors: ${metrics.errors_total}
  Total Tokens: ${metrics.tokens_total}
  Total Time: ${(metrics.duration_total / 1000 / 60).toFixed(1)}m
    `;
  }

  generateTrendReport(metric) {
    const trend = this.analytics.getTrend(metric, 20);
    if (trend.length === 0) return 'No data';

    const values = trend.map(t => t.value);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return `
${metric.toUpperCase()} Trend (Last 20 cycles)
===============================
Min: ${min}
Max: ${max}
Avg: ${avg.toFixed(2)}

Trend: ${values.length > 5 ? (values[values.length - 1] < values[0] ? 'Improving' : 'Degrading') : 'N/A'}
    `;
  }

  exportJSON() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.analytics.getMetrics(),
      trends: {
        tokens: this.analytics.getTrend('tokens', 20),
        duration: this.analytics.getTrend('duration_ms', 20)
      }
    };
  }

  exportCSV() {
    const events = this.analytics.events.filter(e => e.type === 'cycle_complete');
    const header = 'timestamp,success,tokens,duration_ms\n';
    const rows = events.map(e =>
      `${e.timestamp},${e.data.success},${e.data.tokens},${e.data.duration_ms}`
    ).join('\n');

    return header + rows;
  }
}

module.exports = Reporter;
