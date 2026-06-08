const ValidationGate = require('../src/validation/validation-gate');
const TestValidator = require('../src/validation/test-validator');
const BuildValidator = require('../src/validation/build-validator');
const GitValidator = require('../src/validation/git-validator');
const ComparisonEngine = require('../src/validation/comparison-engine');

describe('Phase 2: Validation Gate', () => {
  test('TestValidator should detect test results', () => {
    const result = TestValidator.validate();
    expect(result).toHaveProperty('tests_passed');
    expect(result).toHaveProperty('tests_failed');
  });

  test('BuildValidator should check build status', () => {
    const result = BuildValidator.validate();
    expect(result).toHaveProperty('success');
  });

  test('GitValidator should check git status', () => {
    const result = GitValidator.validate();
    expect(['clean', 'dirty', 'error']).toContain(result.git_status);
  });

  test('ComparisonEngine should detect mismatches', () => {
    const prediction = { success: true, tests_passed: 100 };
    const reality = { success: false, tests_passed: 95 };
    const result = ComparisonEngine.compare(prediction, reality);
    expect(result.verdict).toBe('MISMATCH');
  });

  test('ValidationGate should run all checks', () => {
    const gate = new ValidationGate();
    const result = gate.validate();
    expect(result).toHaveProperty('reality');
    expect(result).toHaveProperty('gate_passes');
  });
});
