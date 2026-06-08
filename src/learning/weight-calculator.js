class WeightCalculator {
  static calculateDelta(success, executionTime) {
    let delta = success ? 0.08 : -0.15;
    if (success && executionTime < 0.15) delta += 0.05;
    return delta;
  }

  static applyDelta(currentWeight, delta) {
    return Math.max(0.1, Math.min(1.0, currentWeight + delta));
  }

  static getTaskSpecificAdjustment(history, agent, taskType) {
    const filtered = history.filter(h => h.agent === agent && h.task_type === taskType);
    if (filtered.length === 0) return 0;
    const successRate = filtered.filter(h => h.success).length / filtered.length;
    return (successRate - 0.5) * 0.2;
  }

  static getWeight(baseWeight, adjustment) {
    return Math.max(0.1, Math.min(1.0, baseWeight + adjustment));
  }

  static normalize(weights) {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    const normalized = {};
    Object.entries(weights).forEach(([agent, weight]) => {
      normalized[agent] = parseFloat((weight / sum).toFixed(3));
    });
    return normalized;
  }
}
module.exports = WeightCalculator;
