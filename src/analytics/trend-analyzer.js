class TrendAnalyzer {
  constructor(data = []) {
    this.data = data || [];
  }

  calculateTrend(metric) {
    if (this.data.length < 2) return 'stable';
    const first = this.data[0][metric] || 0;
    const last = this.data[this.data.length - 1][metric] || 0;
    return last > first ? 'improving' : 'declining';
  }

  predictNext(metric) {
    if (this.data.length === 0) return 0;
    return this.data.reduce((a, d) => a + (d[metric] || 0), 0) / this.data.length;
  }
}
module.exports = TrendAnalyzer;
