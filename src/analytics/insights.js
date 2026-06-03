/**
 * Phase 9: Insights
 * Auto-generate insights from analytics
 */

class InsightEngine {
  constructor(analyticsEngine) {
    this.analytics = analyticsEngine;
  }

  generateInsights() {
    const metrics = this.analytics.getMetrics();
    const insights = [];

    // Success rate insight
    const successRate = parseFloat(metrics.success_rate);
    if (successRate > 90) {
      insights.push('System performing excellently (>90% success)');
    } else if (successRate < 70) {
      insights.push('⚠️  Success rate below 70%, investigate errors');
    }

    // Token usage insight
    if (metrics.avg_tokens > 2000) {
      insights.push('Token usage high, consider pattern optimization');
    } else if (metrics.avg_tokens < 800) {
      insights.push('Excellent token efficiency achieved');
    }

    // Volume insight
    if (metrics.cycles_total > 100) {
      insights.push(`High volume: ${metrics.cycles_total} cycles completed`);
    }

    // Trend analysis
    const tokenTrend = this.analytics.getTrend('tokens', 10);
    if (tokenTrend.length >= 5) {
      const recent = tokenTrend.slice(-5).map(t => t.value);
      const older = tokenTrend.slice(-10, -5).map(t => t.value);
      const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b) / older.length;

      if (recentAvg < olderAvg * 0.9) {
        insights.push('✓ Token usage trending down (improving)');
      } else if (recentAvg > olderAvg * 1.1) {
        insights.push('⚠️  Token usage trending up (degrading)');
      }
    }

    return insights;
  }

  getRecommendations() {
    const metrics = this.analytics.getMetrics();
    const recs = [];

    const successRate = parseFloat(metrics.success_rate);
    if (successRate < 80) {
      recs.push('Increase error tolerance in Phase 7 auto-tuner');
    }

    if (metrics.avg_tokens > 2500) {
      recs.push('Review pattern library size and compression');
    }

    if (metrics.cycles_total < 10) {
      recs.push('Run more cycles to get reliable metrics');
    }

    return recs;
  }
}

module.exports = InsightEngine;
