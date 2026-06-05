class KnowledgeBase {
  constructor() {
    this.patterns = [];
  }

  capturePattern(id, successRate, agents, tokens) {
    this.patterns.push({
      id,
      success_rate: successRate,
      agents,
      tokens
    });
  }

  getTopPatterns(n = 5) {
    return this.patterns.sort((a, b) => b.success_rate - a.success_rate).slice(0, n);
  }

  findPattern(id) {
    return this.patterns.find(p => p.id === id);
  }
}

module.exports = KnowledgeBase;
