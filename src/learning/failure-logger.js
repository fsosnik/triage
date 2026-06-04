class FailureLogger {
  constructor() {
    this.failures = [];
  }
  
  log(taskId, agents, reason) {
    this.failures.push({
      timestamp: new Date(),
      taskId,
      agents,
      reason
    });
  }
  
  getFailureHistory(agent) {
    return this.failures.filter(f => f.agents.includes(agent));
  }
}

module.exports = FailureLogger;
