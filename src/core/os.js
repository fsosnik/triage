class TriageOS {
  constructor(config = {}) {
    this.config = { mode: 'agentic', parallelism: true, ...config };
    this.patterns = [];
    this.metrics = { total_cycles: 0, success_rate: 0.88 };
  }
  classifyTaskType(task) {
    if (task.includes('feature')) return 'feature';
    if (task.includes('bug')) return 'bugfix';
    if (task.includes('refactor')) return 'refactor';
    return 'unknown';
  }
  selectAgents(task, context) {
    return ['code', 'qa', 'risk'];
  }
  getMetrics() { return this.metrics; }
}
module.exports = TriageOS;
