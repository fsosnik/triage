class AgentAnalyzer {
  static getSuccessRate(history, agent, taskType) {
    const filtered = history.filter(h => h.agent === agent && h.task_type === taskType);
    if (filtered.length === 0) return 0.5;
    const successes = filtered.filter(h => h.success).length;
    return (successes / filtered.length).toFixed(2);
  }

  static getDecliningSeries(baseWeights, history) {
    const declining = [];
    Object.keys(baseWeights).forEach(agent => {
      const recent = history.filter(h => h.agent === agent).slice(-10);
      if (recent.length >= 5) {
        const successRate = recent.filter(h => h.success).length / recent.length;
        if (successRate < 0.5) {
          declining.push({
            agent,
            recent_success_rate: (successRate * 100).toFixed(1) + '%',
            weight: baseWeights[agent]
          });
        }
      }
    });
    return declining;
  }

  static getReliabilityReport(baseWeights, history) {
    const report = {};
    Object.keys(baseWeights).forEach(agent => {
      const agentHistory = history.filter(h => h.agent === agent);
      const successes = agentHistory.filter(h => h.success).length;
      const avgTime = agentHistory.length > 0
        ? (agentHistory.reduce((sum, h) => sum + h.execution_time, 0) / agentHistory.length).toFixed(3)
        : 'N/A';
      report[agent] = {
        weight: baseWeights[agent],
        total_uses: agentHistory.length,
        successes,
        success_rate: agentHistory.length > 0 ? (successes / agentHistory.length * 100).toFixed(1) + '%' : 'N/A',
        avg_execution_time: avgTime
      };
    });
    return report;
  }

  static predictBestAgents(baseWeights, history, taskType, count = 3) {
    const agents = Object.keys(baseWeights);
    const ranked = agents.map(agent => ({
      agent,
      weight: baseWeights[agent],
      success_rate: this.getSuccessRate(history, agent, taskType)
    })).sort((a, b) => b.weight - a.weight);
    return ranked.slice(0, count);
  }
}
module.exports = AgentAnalyzer;
