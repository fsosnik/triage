class SuccessRateAnalyzer {
  static analyze(metrics) {
    const rate = parseFloat(metrics.success_rate);
    const insights = [];
    if (rate > 90) insights.push('System performing excellently (>90% success)');
    else if (rate < 70) insights.push('⚠️  Success rate below 70%, investigate errors');
    return insights;
  }
}
module.exports = SuccessRateAnalyzer;
