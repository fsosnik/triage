/**
 * Phase 7: Performance Profiler
 * Track & analyze system performance for optimization
 */

class PerformanceProfiler {
  constructor() {
    this.profiles = [];
    this.baseline = null;
  }

  profile(cycle_data) {
    const profile = {
      timestamp: new Date().toISOString(),
      duration_ms: cycle_data.duration_ms,
      tokens_used: cycle_data.tokens_used,
      success: cycle_data.success,
      agents: cycle_data.agents,
      cache_hit: cycle_data.cache_hit,
      error_rate: cycle_data.error_rate,
      latency_p95: cycle_data.latency_p95
    };

    this.profiles.push(profile);
    if (!this.baseline && profile.success) {
      this.baseline = profile;
    }
    
    return this.analyze();
  }

  analyze() {
    if (this.profiles.length < 2) return { status: 'insufficient_data' };

    const recent = this.profiles.slice(-10);
    const successful = recent.filter(p => p.success);
    
    return {
      cycles: recent.length,
      success_rate: (successful.length / recent.length * 100).toFixed(1) + '%',
      avg_duration_ms: Math.round(recent.reduce((sum, p) => sum + p.duration_ms, 0) / recent.length),
      avg_tokens: Math.round(recent.reduce((sum, p) => sum + p.tokens_used, 0) / recent.length),
      avg_cache_hit: (recent.filter(p => p.cache_hit).length / recent.length * 100).toFixed(1) + '%',
      bottleneck: this.identifyBottleneck(recent)
    };
  }

  identifyBottleneck(profiles) {
    const durations = profiles.map(p => p.duration_ms);
    const max = Math.max(...durations);
    const slow = profiles.find(p => p.duration_ms === max);
    
    if (max > 5000) {
      return `Slow cycle: ${max}ms, agents: ${slow.agents.join(',')}`;
    }
    return 'No bottleneck detected';
  }

  getComparison() {
    if (!this.baseline) return null;
    
    const recent = this.profiles.slice(-5).filter(p => p.success);
    if (recent.length === 0) return null;

    const current = recent[recent.length - 1];
    return {
      duration_improvement: ((this.baseline.duration_ms - current.duration_ms) / this.baseline.duration_ms * 100).toFixed(1) + '%',
      token_reduction: ((this.baseline.tokens_used - current.tokens_used) / this.baseline.tokens_used * 100).toFixed(1) + '%',
      cache_improvement: current.cache_hit > this.baseline.cache_hit ? 'improved' : 'degraded'
    };
  }
}

module.exports = PerformanceProfiler;
