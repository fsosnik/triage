const AnalyticsEngine = require('../src/analytics/analytics-engine');
const Reporter = require('../src/analytics/reporting');
const InsightEngine = require('../src/analytics/insights');

describe('Phase 9: Analytics & Reporting', () => {
  
  test('AnalyticsEngine should record events', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    expect(analytics.events.length).toBe(1);
  });

  test('should calculate success rate', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    analytics.recordEvent('cycle_complete', { success: false, tokens: 1200, duration_ms: 150 });
    expect(analytics.getSuccessRate()).toContain('50');
  });

  test('should get average tokens', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1000 });
    analytics.recordEvent('cycle_complete', { success: true, tokens: 2000 });
    expect(analytics.getAverageTokens()).toBe(1500);
  });

  test('Reporter should generate summary', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    const reporter = new Reporter(analytics);
    const summary = reporter.generateSummary();
    expect(summary).toContain('TRIAGE OS Analytics Report');
  });

  test('Reporter should export JSON', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    const reporter = new Reporter(analytics);
    const json = reporter.exportJSON();
    expect(json.metrics).toBeDefined();
  });

  test('InsightEngine should generate insights', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    const insights = new InsightEngine(analytics);
    const generated = insights.generateInsights();
    expect(Array.isArray(generated)).toBe(true);
  });

  test('InsightEngine should provide recommendations', () => {
    const analytics = new AnalyticsEngine();
    analytics.recordEvent('cycle_complete', { success: true, tokens: 3000, duration_ms: 100 });
    const insights = new InsightEngine(analytics);
    const recs = insights.getRecommendations();
    expect(recs.length).toBeGreaterThan(0);
  });
});
