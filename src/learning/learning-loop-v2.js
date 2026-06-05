class LearningLoopV2 {
  constructor() {
    this.agentWeights = {
      code: 0.7,
      qa: 0.1,
      research: 0.5,
      risk: 0.8
    };
    this.events = [];
    this.stats = {
      total_learning_events: 0,
      most_reliable_agent: { agent: 'code', rate: 0.9 },
      learning_trend: 'improving'
    };
  }

  updateAgentWeights(agents, success, duration) {
    const delta = success ? 0.15 : -0.15;
    agents.forEach(agent => {
      if (this.agentWeights[agent] !== undefined) {
        this.agentWeights[agent] += delta;
        this.agentWeights[agent] = Math.max(0, Math.min(1, this.agentWeights[agent]));
      }
    });
  }

  analyzeSuccess(task, agents, results, duration) {
    this.events.push({
      task,
      agents,
      duration,
      timestamp: new Date()
    });
    this.stats.total_learning_events++;
  }

  refinePattern(patternId, patterns, success) {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return false;
    if (success) {
      pattern.success_rate = Math.min(1, pattern.success_rate + 0.05);
      pattern.reuse_count++;
    }
    return true;
  }

  classifyTask(task) {
    const lower = task.toLowerCase();
    if (lower.includes('fix') || lower.includes('bug')) return 'bugfix';
    if (lower.includes('implement') || lower.includes('feature')) return 'feature';
    if (lower.includes('refactor')) return 'refactor';
    return 'general';
  }

  rankAgents(agents) {
    return agents.sort((a, b) => (this.agentWeights[b] || 0) - (this.agentWeights[a] || 0));
  }

  getStats() {
    return this.stats;
  }
}

module.exports = LearningLoopV2;
