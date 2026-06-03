const LearningLoopV2 = require('../src/learning/learning-loop-v2');
const RollbackLoop = require('../src/learning/rollback-loop');
const WeightUpdater = require('../src/learning/weight-updater');

describe('TRIAGE OS - Phase 2: Learning & Feedback', () => {

  describe('LearningLoopV2', () => {
    let learning;

    beforeEach(() => {
      learning = new LearningLoopV2();
    });

    test('should update weights on success', () => {
      const initialWeight = learning.agentWeights.code;
      learning.updateAgentWeights(['code'], true, 0.1);
      expect(learning.agentWeights.code).toBeGreaterThan(initialWeight);
    });

    test('should penalize on failure', () => {
      const initialWeight = learning.agentWeights.qa;
      learning.updateAgentWeights(['qa'], false, 0.2);
      expect(learning.agentWeights.qa).toBeLessThan(initialWeight);
    });

    test('should classify task types', () => {
      expect(learning.classifyTask('implement feature')).toBe('feature');
      expect(learning.classifyTask('fix bug')).toBe('bugfix');
    });

    test('should rank agents by weight', () => {
      const ranked = learning.rankAgents(['qa', 'code', 'risk']);
      expect(ranked.length).toBe(3);
      expect(['code', 'risk']).toContain(ranked[0]);
    });

    test('should refine patterns', () => {
      const patterns = [
        { id: 'p1', success_rate: 0.8, reuse_count: 0 }
      ];
      learning.refinePattern('p1', patterns, true);
      expect(patterns[0].success_rate).toBeGreaterThan(0.8);
    });
  });

  describe('RollbackLoop', () => {
    let rollback;

    beforeEach(() => {
      rollback = new RollbackLoop();
    });

    test('should classify failures', () => {
      expect(rollback.classifyFailure({ reason: 'test failed' })).toBe('test_failure');
    });

    test('should record failures', () => {
      rollback.recordFailure({
        timestamp: new Date().toISOString(),
        task: 'test',
        failed_agents: ['qa'],
        failure_reason: 'test',
        failure_type: 'test_failure',
        severity: 2
      });
      expect(rollback.failureLog.length).toBeGreaterThan(0);
    });

    test('should get failure stats', () => {
      const stats = rollback.getStats();
      expect(stats).toHaveProperty('total_failures');
    });
  });

  describe('WeightUpdater', () => {
    let updater;

    beforeEach(() => {
      updater = new WeightUpdater();
    });

    test('should get weight for agent', () => {
      const weight = updater.getWeight('code', 'feature');
      expect(weight).toBeGreaterThan(0);
    });

    test('should predict best agents', () => {
      const best = updater.predictBestAgents('feature', 2);
      expect(best.length).toBeLessThanOrEqual(2);
    });

    test('should normalize weights', () => {
      const normalized = updater.getNormalizedWeights();
      const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 1);
    });
  });
});
