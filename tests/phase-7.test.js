const AutoTuner = require('../src/tuning/auto-tuner');
const PerformanceProfiler = require('../src/tuning/performance-profiler');
const FeedbackLoop = require('../src/tuning/feedback-loop');

describe('Phase 7: Fine-tuning & Continuous Improvement', () => {
  
  test('AutoTuner should adjust parameters', () => {
    const tuner = new AutoTuner();
    const adjustments = tuner.tune(
      { cache_hit_rate: 0.5 },
      { error_rate: 0.08 }
    );
    expect(adjustments).toBeDefined();
  });

  test('PerformanceProfiler should profile cycles', () => {
    const profiler = new PerformanceProfiler();
    profiler.profile({
      duration_ms: 100,
      tokens_used: 1500,
      success: true,
      agents: ['code', 'qa'],
      cache_hit: true,
      error_rate: 0.02,
      latency_p95: 150
    });
    const analysis = profiler.analyze();
    expect(analysis.cycles).toBe(1);
  });

  test('FeedbackLoop should process feedback', () => {
    const tuner = new AutoTuner();
    const profiler = new PerformanceProfiler();
    const loop = new FeedbackLoop(tuner, profiler);
    
    loop.recordFeedback({
      id: 1,
      success: true,
      metrics: { tokens_used: 1500, cache_hit_rate: 0.85 }
    });
    
    const recs = loop.getRecommendations();
    expect(Array.isArray(recs)).toBe(true);
  });
});
