/**
 * Phase 18: Trend Analysis
 */

class TrendAnalyzer {
  constructor() {
    this.data = [];
  }

  addDataPoint(metric, value, timestamp = Date.now()) {
    this.data.push({ metric, value, timestamp });
  }

  calculateTrend(metric, window = 10) {
    const points = this.data
      .filter(d => d.metric === metric)
      .slice(-window);

    if (points.length < 2) return 'insufficient_data';

    const values = points.map(p => p.value);
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b) / n;

    const numerator = values.reduce((sum, y, i) => sum + (i - xMean) * (y - yMean), 0);
    const denominator = Array.from({length: n}, (_, i) => Math.pow(i - xMean, 2)).reduce((a, b) => a + b);

    const slope = numerator / denominator;
    return slope > 0.1 ? 'improving' : slope < -0.1 ? 'degrading' : 'stable';
  }

  predictNext(metric) {
    const points = this.data.filter(d => d.metric === metric).slice(-5);
    if (points.length < 2) return null;

    const trend = this.calculateTrend(metric, 5);
    const last = points[points.length - 1].value;

    if (trend === 'improving') return Math.round(last * 1.1);
    if (trend === 'degrading') return Math.round(last * 0.9);
    return last;
  }

  report() {
    const metrics = [...new Set(this.data.map(d => d.metric))];
    return {
      metrics_tracked: metrics.length,
      data_points: this.data.length,
      trends: metrics.map(m => ({
        metric: m,
        trend: this.calculateTrend(m),
        predicted_next: this.predictNext(m)
      }))
    };
  }
}

module.exports = TrendAnalyzer;
