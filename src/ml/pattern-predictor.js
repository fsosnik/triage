/**
 * Phase 18: ML-based Pattern Predictor
 */

class PatternPredictor {
  constructor() {
    this.history = [];
    this.predictions = [];
  }

  observe(taskType, result, duration, tokens) {
    this.history.push({
      type: taskType,
      result: result === 'success' ? 1 : 0,
      duration,
      tokens,
      timestamp: Date.now()
    });
  }

  predictSuccess(taskType) {
    const matching = this.history.filter(h => h.type === taskType);
    if (matching.length === 0) return 0.5;
    
    const successes = matching.filter(h => h.result === 1).length;
    return successes / matching.length;
  }

  predictTokens(taskType) {
    const matching = this.history.filter(h => h.type === taskType);
    if (matching.length === 0) return 1000;
    
    const total = matching.reduce((sum, h) => sum + h.tokens, 0);
    return Math.round(total / matching.length);
  }

  predictDuration(taskType) {
    const matching = this.history.filter(h => h.type === taskType);
    if (matching.length === 0) return 60000;
    
    const total = matching.reduce((sum, h) => sum + h.duration, 0);
    return Math.round(total / matching.length);
  }

  getInsights() {
    const taskTypes = [...new Set(this.history.map(h => h.type))];
    
    return taskTypes.map(type => ({
      type,
      success_rate: (this.predictSuccess(type) * 100).toFixed(1) + '%',
      avg_tokens: this.predictTokens(type),
      avg_duration_ms: this.predictDuration(type),
      samples: this.history.filter(h => h.type === type).length
    }));
  }
}

module.exports = PatternPredictor;
