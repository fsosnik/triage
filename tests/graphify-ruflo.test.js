const GraphifyAdapter = require('../src/optimization/graphify-adapter');
const RufloOptimizer = require('../src/optimization/ruflo-optimizer');

describe('Graphify + Ruflo', () => {
  test('graphify initializes', () => {
    const g = new GraphifyAdapter();
    expect(g.nodes.length).toBeGreaterThan(0);
  });

  test('graphify finds patterns', () => {
    const g = new GraphifyAdapter();
    const p = g.findSimilarPatterns('authentication code');
    expect(p.length).toBeGreaterThan(0);
  });

  test('ruflo predicts tokens', () => {
    const r = new RufloOptimizer();
    expect(r.predictTokens('test')).toBeGreaterThan(0);
  });

  test('ruflo compresses', () => {
    const r = new RufloOptimizer();
    const c = r.compressPrompt('the quick brown fox');
    expect(c.ratio).toBeLessThan(1);
  });
});
