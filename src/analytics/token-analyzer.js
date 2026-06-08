class TokenAnalyzer {
  static analyze(metrics) {
    const insights = [];
    if (metrics.avg_tokens > 2000) {
      insights.push('Token usage high, consider pattern optimization');
    } else if (metrics.avg_tokens < 800) {
      insights.push('Excellent token efficiency achieved');
    }
    return insights;
  }

  static analyzeTrend(trend) {
    if (trend.length < 5) return [];
    const recent = trend.slice(-5).map(t => t.value);
    const older = trend.slice(-10, -5).map(t => t.value);
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    if (recentAvg < olderAvg * 0.9) return ['✓ Token usage trending down (improving)'];
    if (recentAvg > olderAvg * 1.1) return ['⚠️  Token usage trending up (degrading)'];
    return [];
  }
}
module.exports = TokenAnalyzer;
