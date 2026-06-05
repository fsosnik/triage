class TrendAnalyzer {
  constructor(data = []) {
    this.data = data;
  }

  calculateTrend(metric) {
    if (this.data.length < 2) return 'stable';
    const recent = this.data.slice(-5);
    let sum = 0;
    for (let i = 1; i < recent.length; i++) {
      sum += (recent[i][metric] || 0) - (recent[i-1][metric] || 0);
    }
    return sum > 0 ? 'improving' : 'declining';
  }

  predictNext(metric) {
    if (this.data.length === 0) return 0;
    const avg = this.data.reduce((a, d) => a + (d[metric] || 0), 0) / this.data.length;
    return avg;
  }
}

module.exports = TrendAnalyzer;
