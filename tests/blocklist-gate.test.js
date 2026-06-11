const BlocklistGate = require('../src/validation/blocklist-gate');

describe('BlocklistGate', () => {
  let gate;

  beforeEach(() => {
    gate = new BlocklistGate();
  });

  describe('preExecutionCheck', () => {
    test('allows normal operations', () => {
      const result = gate.preExecutionCheck('npm install lodash');
      expect(result.allowed).toBe(true);
    });

    test('blocks git push --force', () => {
      const result = gate.preExecutionCheck('git push --force origin main');
      expect(result.allowed).toBe(false);
    });

    test('blocks npm install --no-save', () => {
      const result = gate.preExecutionCheck('npm install lodash --no-save');
      expect(result.allowed).toBe(false);
    });

    test('blocks .env modification', () => {
      const result = gate.preExecutionCheck('edit .env');
      expect(result.allowed).toBe(false);
    });

    test('allows safe git operations', () => {
      const result = gate.preExecutionCheck('git push origin main');
      expect(result.allowed).toBe(true);
    });
  });

  describe('pattern matching', () => {
    test('loads patterns from blocklist.json', () => {
      expect(gate.patterns.length).toBeGreaterThan(0);
    });

    test('validates input against patterns', () => {
      const result = gate.validate('git push --force');
      expect(result.blocked).toBeDefined();
    });
  });
});
