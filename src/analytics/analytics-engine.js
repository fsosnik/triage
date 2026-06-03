/**
 * Phase 9: Analytics Engine
 * Track, analyze, report system metrics
 */

const fs = require('fs');
const path = require('path');

class AnalyticsEngine {
  constructor() {
    this.events = [];
    this.metrics = {
      cycles_total: 0,
      success_total: 0,
      errors_total: 0,
      tokens_total: 0,
      duration_total: 0
    };
    this.loadEvents();
  }

  recordEvent(type, data) {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      data
    };
    this.events.push(event);
    this.updateMetrics(event);
    this.persist();
  }

  updateMetrics(event) {
    if (event.type === 'cycle_complete') {
      this.metrics.cycles_total++;
      this.metrics.tokens_total += event.data.tokens || 0;
      this.metrics.duration_total += event.data.duration_ms || 0;
      if (event.data.success) {
        this.metrics.success_total++;
      } else {
        this.metrics.errors_total++;
      }
    }
  }

  getSuccessRate() {
    return this.metrics.cycles_total > 0
      ? (this.metrics.success_total / this.metrics.cycles_total * 100).toFixed(1) + '%'
      : 'N/A';
  }

  getAverageTokens() {
    return this.metrics.cycles_total > 0
      ? Math.round(this.metrics.tokens_total / this.metrics.cycles_total)
      : 0;
  }

  getAverageDuration() {
    return this.metrics.cycles_total > 0
      ? (this.metrics.duration_total / this.metrics.cycles_total / 1000).toFixed(2) + 's'
      : '0s';
  }

  getMetrics() {
    return {
      ...this.metrics,
      success_rate: this.getSuccessRate(),
      avg_tokens: this.getAverageTokens(),
      avg_duration: this.getAverageDuration(),
      total_events: this.events.length
    };
  }

  getTrend(metric, intervals = 10) {
    const recent = this.events.filter(e => e.type === 'cycle_complete').slice(-intervals);
    if (recent.length === 0) return [];

    return recent.map((e, idx) => ({
      index: idx,
      value: e.data[metric] || 0,
      timestamp: e.timestamp
    }));
  }

  persist() {
    try {
      const dir = path.join(process.cwd(), '.claude/analytics');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(
        path.join(dir, 'events.json'),
        JSON.stringify(this.events.slice(-1000), null, 2)
      );
    } catch (e) {
      // Skip
    }
  }

  loadEvents() {
    try {
      const file = path.join(process.cwd(), '.claude/analytics/events.json');
      if (fs.existsSync(file)) {
        this.events = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.events.forEach(e => this.updateMetrics(e));
      }
    } catch (e) {
      this.events = [];
    }
  }
}

module.exports = AnalyticsEngine;
