/**
 * Phase 15: Advanced Testing Suite
 */

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.results = [];
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    const startTime = Date.now();
    
    for (const test of this.tests) {
      try {
        await test.fn();
        this.results.push({
          test: test.description,
          status: 'PASS',
          duration: Date.now() - startTime
        });
      } catch (error) {
        this.results.push({
          test: test.description,
          status: 'FAIL',
          error: error.message,
          duration: Date.now() - startTime
        });
      }
    }

    return this.getReport();
  }

  getReport() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    return {
      suite: this.name,
      total,
      passed,
      failed,
      pass_rate: (passed / total * 100).toFixed(1) + '%',
      results: this.results
    };
  }
}

module.exports = TestSuite;
