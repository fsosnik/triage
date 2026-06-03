/**
 * Phase 18: Anomaly Detection
 */

class AnomalyDetector {
  constructor(threshold = 2.0) {
    this.threshold = threshold;
    this.metrics = [];
  }

  addMetric(name, value) {
    this.metrics.push({ name, value, timestamp: Date.now() });
  }

  calculateMean(values) {
    return values.reduce((a, b) => a + b) / values.length;
  }

  calculateStdDev(values, mean) {
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  detectAnomalies() {
    const grouped = {};
    this.metrics.forEach(m => {
      if (!grouped[m.name]) grouped[m.name] = [];
      grouped[m.name].push(m.value);
    });

    const anomalies = [];
    for (const [name, values] of Object.entries(grouped)) {
      if (values.length < 2) continue;

      const mean = this.calculateMean(values);
      const stdDev = this.calculateStdDev(values, mean);

      values.forEach((value, idx) => {
        const zscore = Math.abs((value - mean) / (stdDev || 1));
        if (zscore > this.threshold) {
          anomalies.push({
            metric: name,
            value,
            zscore: zscore.toFixed(2),
            expected: Math.round(mean)
          });
        }
      });
    }

    return anomalies;
  }

  report() {
    const anomalies = this.detectAnomalies();
    return {
      total_metrics: this.metrics.length,
      anomalies_found: anomalies.length,
      threshold: this.threshold,
      anomalies
    };
  }
}

module.exports = AnomalyDetector;
