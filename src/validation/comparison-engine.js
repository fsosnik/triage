class ComparisonEngine {
  static compare(prediction, reality) {
    const mismatches = [];

    if (prediction.tests_passed && reality.tests_passed) {
      if (prediction.tests_passed !== reality.tests_passed) {
        mismatches.push({
          field: 'tests_passed',
          predicted: prediction.tests_passed,
          actual: reality.tests_passed,
          override: 'reality'
        });
      }
    }

    if (prediction.success !== reality.success) {
      mismatches.push({
        field: 'success',
        predicted: prediction.success,
        actual: reality.success,
        override: 'reality'
      });
    }

    return {
      matches: mismatches.length === 0,
      mismatches: mismatches,
      verdict: mismatches.length === 0 ? 'VALID' : 'MISMATCH',
      trusted_source: 'reality'
    };
  }
}
module.exports = ComparisonEngine;
