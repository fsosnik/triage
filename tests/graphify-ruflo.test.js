const GraphifyAdapter = require('../src/optimization/graphify-adapter');
const RufloOptimizer = require('../src/optimization/ruflo-optimizer');

describe('Graphify + Ruflo Integration', () => {
  test('graphify finds similar patterns', () => {
    const g = new GraphifyAdapter();
    const patterns = g.findSimilarPatterns('implement authentication code');
    expect(patterns.length).toBeGreaterThan(0);
  });

  test('ruflo predicts tokens', () => {
    const r = new RufloOptimizer();
    const tokens = r.predictTokens('this is a test prompt');
    expect(tokens).toBeGreaterThan(0);
  });

  test('ruflo compresses prompts', () => {
    const r = new RufloOptimizer();
    const compressed = r.compressPrompt('the quick brown fox jumps over the lazy dog');
    expect(compressed.ratio).toBeLessThan(1);
  });

  test('ruflo optimizes for provider', () => {
    const r = new RufloOptimizer();
    const opt = r.optimizeForProvider('implement authentication system', 'anthropic');
    expect(opt.savings).toBeDefined();
    expect(opt.compression_ratio).toBeDefined();
  });
});
