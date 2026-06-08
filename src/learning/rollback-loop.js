const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const FailureClassifier = require('./failure-classifier');
const BlocklistManager = require('./blocklist-manager');

class RollbackLoop {
  constructor() {
    this.failureLog = [];
    this.loadFailureLog();
  }

  loadFailureLog() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/failures.json');
      if (fs.existsSync(file)) {
        this.failureLog = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      this.failureLog = [];
    }
  }

  saveFailureLog() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'failures.json'), JSON.stringify(this.failureLog, null, 2));
    } catch (e) {
      console.warn('⚠️ Failure log save failed');
    }
  }

  classifyFailure(details) {
    return FailureClassifier.classify(details);
  }

  calculateSeverity(details) {
    return FailureClassifier.calculateSeverity(details);
  }

  async handleFailure(task, failedAgents, failureDetails) {
    console.log('\n' + '═'.repeat(60));
    console.log('❌ ROLLBACK LOOP');
    console.log('═'.repeat(60));

    const failureRecord = {
      timestamp: new Date().toISOString(),
      task,
      failed_agents: failedAgents,
      failure_reason: failureDetails.reason,
      failure_type: this.classifyFailure(failureDetails),
      severity: this.calculateSeverity(failureDetails),
      incident_count: 0
    };

    console.log(`\n📋 Task: ${task}`);
    console.log(`   Agents: ${failedAgents.join(', ')}`);
    console.log(`   Type: ${failureRecord.failure_type}`);

    BlocklistManager.update(failureRecord);
    this.penalizeAgents(failedAgents);
    if (failureDetails.canRevert) await this.revertChanges(failureRecord);
    this.recordFailure(failureRecord);

    console.log(`\n✓ Rollback complete`);
    return failureRecord;
  }

  penalizeAgents(failedAgents) {
    try {
      const file = path.join(process.cwd(), '.claude/learning/weights.json');
      let weights = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : { code: 0.8, qa: 0.6, research: 0.5, risk: 0.7 };
      failedAgents.forEach(agent => {
        const current = weights[agent] || 0.5;
        weights[agent] = Math.max(0.1, current - 0.25);
      });
      fs.writeFileSync(file, JSON.stringify(weights, null, 2));
    } catch (e) {
      console.warn('⚠️ Weight update failed');
    }
  }

  async revertChanges(failureRecord) {
    try {
      execSync('git revert HEAD --no-edit', { stdio: 'pipe', cwd: process.cwd() });
      this.createRevertCheckpoint(failureRecord);
    } catch (e) {
      // Skip
    }
  }

  createRevertCheckpoint(failureRecord) {
    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const checkpoint = {
        type: 'revert',
        timestamp: new Date().toISOString(),
        reason: failureRecord.failure_reason,
        task: failureRecord.task,
        severity: failureRecord.severity
      };
      fs.writeFileSync(path.join(dir, `revert-${Date.now()}.json`), JSON.stringify(checkpoint, null, 2));
    } catch (e) {
      // Skip
    }
  }

  recordFailure(failureRecord) {
    this.failureLog.push(failureRecord);
    this.saveFailureLog();
  }

  getBlocklistSize() {
    return BlocklistManager.getSize();
  }

  getStats() {
    const total = this.failureLog.length;
    const critical = this.failureLog.filter(f => f.severity >= 4).length;
    const avgSeverity = total > 0 ? (this.failureLog.reduce((sum, f) => sum + f.severity, 0) / total).toFixed(1) : 0;
    return { total_failures: total, critical_failures: critical, avg_severity: avgSeverity, latest_failure: this.failureLog[total - 1] || null };
  }
}

module.exports = RollbackLoop;
