class AgentPenalizer {
  penalize(agent, weights, amount = 0.15) {
    weights[agent] = Math.max(0.1, (weights[agent] || 0.5) - amount);
    return weights[agent];
  }
  
  reward(agent, weights, amount = 0.15) {
    weights[agent] = Math.min(1.0, (weights[agent] || 0.5) + amount);
    return weights[agent];
  }
}

module.exports = AgentPenalizer;
