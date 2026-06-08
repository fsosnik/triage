class MetricsCollector {
  constructor() {
    this.metrics = [];
  }

  collect(taskType, agents, result) {
    const metric = {
      timestamp: new Date().toISOString(),
      task_type: taskType,
      agents: agents,
      success: result.success,
      duration_ms: result.duration || 0,
      tests_passed: result.tests_passed || 0,
      tests_failed: result.tests_failed || 0,
      tokens_used: result.tokens_used || 0,
      build_time: result.build_time || 0
    };
    this.metrics.push(metric);
    return metric;
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageTokens() {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.tokens_used, 0);
    return (sum / this.metrics.length).toFixed(0);
  }

  getSuccessRate() {
    if (this.metrics.length === 0) return 0;
    const successes = this.metrics.filter(m => m.success).length;
    return ((successes / this.metrics.length) * 100).toFixed(1);
  }
}
module.exports = MetricsCollector;
