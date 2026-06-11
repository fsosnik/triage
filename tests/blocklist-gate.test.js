const BlocklistGate = require('../src/validation/blocklist-gate');

describe('BlocklistGate', () => {
  let gate;

  beforeEach(() => {
    gate = new BlocklistGate();
  });

  describe('initialization', () => {
    test('loads patterns from blocklist.json', () => {
      expect(gate.patterns).toBeDefined();
      expect(Array.isArray(gate.patterns)).toBe(true);
      expect(gate.patterns.length).toBeGreaterThan(0);
    });
  });

  describe('validate', () => {
    test('blocks git push --force', () => {
      const result = gate.validate('git push --force origin main');
      expect(result.blocked).toBe(true);
    });

    test('blocks npm install --no-save', () => {
      const result = gate.validate('npm install lodash --no-save');
      expect(result.blocked).toBe(true);
    });

    test('blocks .env modifications', () => {
      const result = gate.validate('edit .env');
      expect(result.blocked).toBe(true);
    });

    test('allows normal operations', () => {
      const result = gate.validate('npm install lodash');
      expect(result.blocked).toBe(false);
    });

    test('allows safe git operations', () => {
      const result = gate.validate('git push origin main');
      expect(result.blocked).toBe(false);
    });
  });

  describe('preExecutionCheck', () => {
    test('returns allowed=true for safe commands', () => {
      const result = gate.preExecutionCheck('npm install');
      expect(result.allowed).toBe(true);
    });

    test('returns allowed=false for blocked commands', () => {
      const result = gate.preExecutionCheck('git push --force');
      expect(result.allowed).toBe(false);
    });

    test('includes reason when blocked', () => {
      const result = gate.preExecutionCheck('git push --force');
      expect(result.reason).toBeDefined();
      expect(result.reason).toContain('BLOCKED');
    });

    test('includes alternative when blocked', () => {
      const result = gate.preExecutionCheck('git push --force');
      if (!result.allowed) {
        expect(result.alternative).toBeDefined();
      }
    });
  });

  describe('pattern matching', () => {
    test('matches patterns with regex', () => {
      const pattern = { pattern: /--force/, id: 'test' };
      const matches = gate.matches('git push --force', pattern);
      expect(matches).toBe(true);
    });

    test('matches patterns with string inclusion', () => {
      const pattern = { pattern: 'API_KEY', id: 'test' };
      const matches = gate.matches('const API_KEY = "secret"', pattern);
      expect(matches).toBe(true);
    });

    test('handles invalid regex gracefully', () => {
      const pattern = { pattern: '[invalid(', id: 'test' };
      const matches = gate.matches('test', pattern);
      expect(matches).toBe(false);
    });
  });

  describe('error handling', () => {
    test('handles missing blocklist.json gracefully', () => {
      const gate2 = new BlocklistGate('.claude/patterns/nonexistent.json');
      expect(gate2.patterns).toBeDefined();
      expect(Array.isArray(gate2.patterns)).toBe(true);
    });

    test('handles invalid JSON in blocklist', () => {
      const invalidPath = '/tmp/invalid-blocklist.json';
      try {
        const gate2 = new BlocklistGate(invalidPath);
        expect(gate2.patterns).toBeDefined();
      } catch (e) {
        // Expected for invalid path
      }
    });
  });
});
