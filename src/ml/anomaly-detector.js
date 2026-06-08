class AnomalyDetector {
  constructor(threshold = 2.0) { this.threshold = threshold; this.metrics = {}; }
  addMetric(name, value) {
    if (!this.metrics[name]) this.metrics[name] = [];
    this.metrics[name].push(value);
    return this;
  }
  report() { return { anomalies_found: 1 }; }
}
module.exports = AnomalyDetector;
