class VolumeAnalyzer {
  static analyze(metrics) {
    const insights = [];
    if (metrics.cycles_total > 100) {
      insights.push(`High volume: ${metrics.cycles_total} cycles completed`);
    }
    return insights;
  }
}
module.exports = VolumeAnalyzer;
