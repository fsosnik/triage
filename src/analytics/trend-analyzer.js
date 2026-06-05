class TrendAnalyzer {
  constructor() {
    this.dataPoints = {};
  }

  addDataPoint(metric, value) {
    if (!this.dataPoints[metric]) this.dataPoints[metric] = [];
    this.dataPoints[metric].push(value);
  }

  calculateTrend(metric) {
    const data = this.dataPoints[metric] || [];
    if (data.length < 2) return 'stable';
    const first = data[0];
    const last = data[data.length - 1];
    return last > first ? 'improving' : 'declining';
  }

  predictNext(metric) {
    const data = this.dataPoints[metric] || [];
    if (data.length === 0) return 0;
    return data.reduce((a, v) => a + v, 0) / data.length;
  }
}
module.exports = TrendAnalyzer;
