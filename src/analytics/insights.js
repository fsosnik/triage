const SuccessRateAnalyzer = require('./success-rate-analyzer');
const TokenAnalyzer = require('./token-analyzer');
const VolumeAnalyzer = require('./volume-analyzer');
const RecommendationEngine = require('./recommendation-engine');

class InsightEngine {
  constructor(analyticsEngine) {
    this.analytics = analyticsEngine;
  }

  generateInsights() {
    const metrics = this.analytics.getMetrics();
    const insights = [];

    insights.push(...SuccessRateAnalyzer.analyze(metrics));
    insights.push(...TokenAnalyzer.analyze(metrics));
    insights.push(...VolumeAnalyzer.analyze(metrics));

    const tokenTrend = this.analytics.getTrend('tokens', 10);
    insights.push(...TokenAnalyzer.analyzeTrend(tokenTrend));

    return insights;
  }

  getRecommendations() {
    const metrics = this.analytics.getMetrics();
    return RecommendationEngine.generate(metrics);
  }
}

module.exports = InsightEngine;
