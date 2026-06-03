/**
 * TRIAGE OS - Tools & Utilities
 * Layer 4: Execution Tools
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class Tools {
  /**
   * Run npm command
   */
  static runNpm(command) {
    try {
      console.log(`    → npm ${command}`);
      const output = execSync(`npm ${command}`, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      return { success: true, output };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Run tests
   */
  static runTests() {
    console.log('    Testing...');
    const result = this.runNpm('test');
    return {
      passed: result.success,
      output: result.output || result.error
    };
  }

  /**
   * Build project
   */
  static buildProject() {
    console.log('    Building...');
    const result = this.runNpm('run build');
    return {
      clean: result.success,
      output: result.output || result.error
    };
  }

  /**
   * Check TypeScript
   */
  static checkTypes() {
    console.log('    Checking types...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  /**
   * Git operations
   */
  static gitStatus() {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf-8' });
      return { clean: !output.trim(), output };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * Read file
   */
  static readFile(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf-8');
    } catch (e) {
      return null;
    }
  }

  /**
   * Write file
   */
  static writeFile(filepath, content) {
    try {
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filepath, content);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = Tools;
