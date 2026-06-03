/**
 * Phase 7: Feedback Loop
 * Capture learnings & drive continuous improvement
 */

class FeedbackLoop {
  constructor(autoTuner, profiler) {
    this.tuner = autoTuner;
    this.profiler = profiler;
    this.feedbacks = [];
  }

  recordFeedback(cycle_result) {
    const feedback = {
      timestamp: new Date().toISOString(),
      cycle_id: cycle_result.id,
      success: cycle_result.success,
      metrics: cycle_result.metrics,
      suggested_improvements: []
    };

    if (!cycle_result.success) {
      feedback.suggested_improvements.push('Increase error tolerance');
    }
    if (cycle_result.metrics.tokens_used > 2500) {
      feedback.suggested_improvements.push('Reduce pattern library size');
    }
    if (cycle_result.metrics.cache_hit_rate < 0.75) {
      feedback.suggested_improvements.push('Optimize cache strategy');
    }

    this.feedbacks.push(feedback);
    this.processFeedback(feedback);
  }

  processFeedback(feedback) {
    const analysis = this.profiler.analyze();
    const tuneResult = this.tuner.tune(analysis, {
      error_rate: 1 - (analysis.success_rate / 100),
      cache_hit_rate: parseFloat(analysis.avg_cache_hit),
      pattern_reuse_success: 0.85
    });

    return tuneResult;
  }

  getRecommendations() {
    const recent = this.feedbacks.slice(-20);
    const improvements = {};

    recent.forEach(f => {
      f.suggested_improvements.forEach(imp => {
        improvements[imp] = (improvements[imp] || 0) + 1;
      });
    });

    return Object.entries(improvements)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([improvement, count]) => `${improvement} (${count}x)`);
  }
}

module.exports = FeedbackLoop;
