const TestValidator = require('./test-validator');
const BuildValidator = require('./build-validator');
const GitValidator = require('./git-validator');
const ProductionValidator = require('./production-validator');
const ComparisonEngine = require('./comparison-engine');

class ValidationGate {
  validate(prediction = {}) {
    console.log('\n' + '═'.repeat(60));
    console.log('🔍 VALIDATION GATE - Reality Check');
    console.log('═'.repeat(60) + '\n');

    const reality = {};

    const tests = TestValidator.validate();
    reality.tests_passed = tests.tests_passed;
    reality.tests_failed = tests.tests_failed;
    console.log(`  ✓ Tests: ${tests.tests_passed} pass, ${tests.tests_failed} fail`);

    const build = BuildValidator.validate();
    reality.build_success = build.success;
    console.log(`  ${build.success ? '✓' : '✗'} Build: ${build.message}`);

    const git = GitValidator.validate();
    reality.git_clean = git.git_status === 'clean';
    console.log(`  ${git.success ? '✓' : '✗'} Git: ${git.git_status}`);

    const production = ProductionValidator.validate();
    reality.production_up = production.success;
    console.log(`  ${production.success ? '✓' : '✗'} Production: ${production.status_code}`);

    reality.success = reality.tests_failed === 0 && reality.build_success && reality.git_clean && reality.production_up;

    const comparison = ComparisonEngine.compare(prediction, reality);
    console.log(`\n${reality.success ? '✅' : '❌'} GATE: ${reality.success ? 'VALID' : 'FAILED'}`);

    return { reality, comparison, gate_passes: reality.success };
  }
}

module.exports = ValidationGate;
