/**
 * Phase 7: Auto-Tuning & Fine-Tuning
 * Continuous optimization of system parameters
 */

class AutoTuner {
  constructor() {
    this.params = {
      agent_weights: { code: 0.8, qa: 0.6, research: 0.5, risk: 0.7 },
      cache_threshold: 0.8,
      pattern_reuse_min: 0.75,
      error_tolerance: 0.05,
      learning_rate: 0.1
    };
    this.history = [];
  }

  tune(metrics, performance) {
    const adjustments = {};

    // Tune based on error rate
    if (performance.error_rate > this.params.error_tolerance) {
      adjustments.error_tolerance = performance.error_rate * 0.9;
      adjustments.learning_rate = this.params.learning_rate * 0.8;
    }

    // Tune cache threshold
    if (metrics.cache_hit_rate < 0.75) {
      adjustments.cache_threshold = Math.max(0.5, this.params.cache_threshold - 0.05);
    }

    // Tune pattern reuse
    if (metrics.pattern_reuse_success < 0.8) {
      adjustments.pattern_reuse_min = Math.max(0.5, this.params.pattern_reuse_min - 0.05);
    }

    this.applyAdjustments(adjustments);
    this.recordTuning(adjustments, metrics);
    
    return adjustments;
  }

  applyAdjustments(adjustments) {
    Object.assign(this.params, adjustments);
  }

  recordTuning(adjustments, metrics) {
    this.history.push({
      timestamp: new Date().toISOString(),
      adjustments,
      metrics: { ...metrics },
      params: { ...this.params }
    });
  }

  getOptimalParams() {
    if (this.history.length === 0) return this.params;
    
    const recent = this.history.slice(-10);
    const bestRun = recent.reduce((best, run) => 
      (run.metrics.overall_score || 0) > (best.metrics.overall_score || 0) ? run : best
    );
    
    return bestRun.params;
  }

  getTuningHistory(limit = 20) {
    return this.history.slice(-limit);
  }
}

module.exports = AutoTuner;
