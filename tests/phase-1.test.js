const LearningLoop = require('../src/learning/learning-loop');
const PatternExtractor = require('../src/learning/pattern-extractor');
const PatternStorage = require('../src/learning/pattern-storage');

describe('Phase 1: Learning Loop', () => {
  let loop;

  beforeEach(() => {
    loop = new LearningLoop();
  });

  test('should capture successful task result', async () => {
    const result = {
      success: true,
      duration: 50,
      tests_passed: 100,
      tests_failed: 0,
      tokens_used: 1500
    };

    const pattern = await loop.processResult('oauth2', ['code', 'qa'], result);
    expect(pattern).toBeDefined();
    expect(pattern.name).toBe('oauth2');
    expect(pattern.agents_used).toContain('code');
  });

  test('should extract reusable pattern', () => {
    const pattern = {
      id: 'p1',
      name: 'auth',
      success_rate: 95,
      agents_used: ['code', 'qa', 'risk']
    };

    const reusable = PatternExtractor.isReusable(pattern);
    expect(reusable).toBe(true);
  });

  test('should identify non-reusable pattern', () => {
    const pattern = {
      id: 'p1',
      name: 'test',
      success_rate: 60,
      agents_used: ['code']
    };

    const reusable = PatternExtractor.isReusable(pattern);
    expect(reusable).toBe(false);
  });

  test('should collect metrics', () => {
    const result = { success: true, duration: 100, tokens_used: 2000 };
    loop.collector.collect('feature', ['code'], result);

    const metrics = loop.getMetrics();
    expect(metrics.total_metrics).toBe(1);
    expect(metrics.avg_tokens).toBe('2000');
  });

  test('should find similar patterns', () => {
    const similar = PatternStorage.findSimilar('authentication');
    expect(Array.isArray(similar)).toBe(true);
  });
});
