const { execSync } = require('child_process');

class TestValidator {
  static validate(useCache = true) {
    // Usar resultado cacheado del último test
    try {
      if (useCache && process.env.TEST_RESULT_CACHE) {
        return JSON.parse(process.env.TEST_RESULT_CACHE);
      }

      // Si no hay cache, ejecutar tests (lento pero real)
      const output = execSync('npm test -- --json 2>&1', { 
        encoding: 'utf-8',
        timeout: 30000 
      });
      
      // Buscar JSON
      const jsonMatch = output.match(/\{[\s\S]*"testResults"[\s\S]*\}/);
      let testResult;
      
      if (jsonMatch) {
        testResult = JSON.parse(jsonMatch[0]);
      } else {
        return this.parseTestOutput(output);
      }

      const result = {
        success: testResult.numFailedTests === 0 && testResult.numTotalTests > 0,
        tests_passed: testResult.numPassedTests || 0,
        tests_failed: testResult.numFailedTests || 0,
        tests_total: testResult.numTotalTests || 0,
        timestamp: new Date().toISOString()
      };

      // Cachear para próximas llamadas
      process.env.TEST_RESULT_CACHE = JSON.stringify(result);
      return result;
    } catch (error) {
      return {
        success: false,
        tests_passed: 0,
        tests_failed: 1,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  static parseTestOutput(output) {
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);
    
    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;

    return {
      success: failed === 0 && passed > 0,
      tests_passed: passed,
      tests_failed: failed,
      tests_total: passed + failed,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = TestValidator;
