class RecommendationEngine {
  static generate(metrics) {
    const recs = [];
    const successRate = parseFloat(metrics.success_rate);
    
    if (successRate < 80) recs.push('Increase error tolerance in Phase 7 auto-tuner');
    if (metrics.avg_tokens > 2500) recs.push('Review pattern library size and compression');
    if (metrics.cycles_total < 10) recs.push('Run more cycles to get reliable metrics');
    
    return recs;
  }
}
module.exports = RecommendationEngine;
