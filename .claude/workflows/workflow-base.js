const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WorkflowBase {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.agents = config.agents || [];
    this.phases = config.phases || [];
    this.validations = config.validations || [];
    this.evidence = [];
    this.startTime = null;
    this.endTime = null;
    this.status = 'NOT_STARTED';
  }

  async execute() {
    console.log(`\n[${this.id}] Starting: ${this.name}`);
    this.startTime = Date.now();
    this.status = 'RUNNING';

    try {
      for (const phase of this.phases) {
        console.log(`[${this.id}] Phase: ${phase.name}`);

        if (phase.parallel) {
          await Promise.all(
            phase.tasks.map(task => this.executeTask(task))
          );
        } else {
          for (const task of phase.tasks) {
            await this.executeTask(task);
          }
        }
      }

      console.log(`[${this.id}] Running validations...`);
      const validationResults = await this.validateAll();

      if (validationResults.every(v => v.passed)) {
        this.status = 'VALIDATED';
        console.log(`[${this.id}] ✅ VALIDATED`);
      } else {
        this.status = 'FAILED';
        console.log(`[${this.id}] ❌ FAILED - Validation errors`);
        throw new Error(`Validation failed in ${this.id}`);
      }

    } catch (err) {
      this.status = 'FAILED';
      console.error(`[${this.id}] Error: ${err.message}`);

      if (this.rollbackFn) {
        console.log(`[${this.id}] Executing rollback...`);
        await this.rollbackFn();
      }

      throw err;
    } finally {
      this.endTime = Date.now();
    }

    return this.getResult();
  }

  async executeTask(task) {
    console.log(`  → ${task.name}`);

    let output;

    if (task.type === 'bash') {
      output = await this.bash(task.command);
    } else if (task.type === 'http') {
      output = await this.httpRequest(task);
    } else if (task.type === 'code') {
      output = await task.fn.call(this);
    } else {
      throw new Error(`Unknown task type: ${task.type}`);
    }

    this.evidence.push({
      task: task.name,
      output: output ? output.substring(0, 500) : 'OK',
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    });

    return output;
  }

  bash(command) {
    try {
      const output = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });
      return output || 'OK';
    } catch (err) {
      throw new Error(`Bash command failed: ${command}\n${err.stderr || err.message}`);
    }
  }

  async httpRequest(task) {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(task.url, {
      method: task.method || 'GET',
      headers: task.headers || {},
      body: task.body ? JSON.stringify(task.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  }

  async validateAll() {
    const results = [];

    for (const validation of this.validations) {
      console.log(`    ✓ Checking: ${validation.name}`);

      try {
        let check_result;

        if (validation.command) {
          const output = this.bash(validation.command);
          check_result = validation.expect ? output.includes(validation.expect) : !!output;
        } else if (validation.fn) {
          check_result = await validation.fn.call(this);
        } else {
          check_result = false;
        }

        results.push({
          name: validation.name,
          passed: check_result,
          expect: validation.expect,
          evidence: check_result ? 'PASS' : 'FAIL'
        });

      } catch (err) {
        results.push({
          name: validation.name,
          passed: false,
          error: err.message
        });
      }
    }

    return results;
  }

  getResult() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      duration: (this.endTime - this.startTime) / 1000,
      evidence: this.evidence,
      timestamp: new Date().toISOString()
    };
  }

  async rollback() {
    if (this.rollbackFn) {
      await this.rollbackFn();
    }
  }
}

module.exports = WorkflowBase;
