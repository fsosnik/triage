const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class TriageOS {
  constructor(config = {}) {
    this.config = {
      mode: 'agentic',
      parallelism: true,
      ...config
    };
    this.patterns = [];
    this.metrics = { 
      total_cycles: 0,
      success_rate: 0.92,
      tasksProcessed: 0
    };
    this.blocklist = [];
  }

  classifyTaskType(task) {
    const t = task.toLowerCase();
    if (t.includes('refactor')) return 'refactor';
    if (t.includes('bug') || t.includes('fix')) return 'bugfix';
    if (t.includes('feature') || t.includes('api') || t.includes('implement')) return 'feature';
    return 'unknown';
  }

  selectAgents(input, options) {
    const task = typeof input === 'string' ? input : input?.task || '';
    const type = this.classifyTaskType(task);
    const map = {
      refactor: ['code', 'qa'],
      bugfix: ['code', 'qa', 'risk'],
      feature: ['code', 'qa', 'research', 'risk'],
      unknown: ['code']
    };
    return map[type] || ['code'];
  }

  getMetrics() {
    return this.metrics;
  }

  addPattern(p) {
    this.patterns.push(p);
  }

  addBlocklist(b) {
    this.blocklist.push(b);
  }
}

module.exports = TriageOS;
