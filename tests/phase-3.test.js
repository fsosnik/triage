const FeedbackEngine = require('../src/core/feedback-engine');
const AutoCheckpoint = require('../src/core/auto-checkpoint');
const TriageOSCore = require('../src/core/triage-os-core');

describe('Phase 3: Feedback Loop Integration', () => {
  test('FeedbackEngine should route success', async () => {
    const engine = new FeedbackEngine();
    const result = await engine.process('oauth2', ['code', 'qa'], 
      { success: true }, 
      { success: true }
    );
    expect(result).toBeDefined();
  });

  test('FeedbackEngine should route failure', async () => {
    const engine = new FeedbackEngine();
    const result = await engine.process('oauth2', ['code'], 
      { success: true }, 
      { success: false }
    );
    expect(result).toBeDefined();
  });

  test('AutoCheckpoint should save', () => {
    const filename = AutoCheckpoint.save({
      task: 'test',
      status: 'VALIDATED'
    });
    expect(filename).toBeDefined();
    expect(filename).toContain('checkpoint');
  });

  test('AutoCheckpoint should list', () => {
    const list = AutoCheckpoint.list();
    expect(Array.isArray(list)).toBe(true);
  });

  test('TriageOSCore should execute full cycle', async () => {
    const core = new TriageOSCore();
    const result = await core.executeCycle('feature', ['code', 'qa'], { success: true });
    expect(result).toHaveProperty('validation');
    expect(result).toHaveProperty('feedback');
    expect(result).toHaveProperty('checkpoint');
  });
});
