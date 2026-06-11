const fs = require('fs');
const path = require('path');
const BlocklistGate = require('../validation/blocklist-gate');
const GitHealingWorkflow = require('../workflows/w1-git-healing');
const BlocklistWorkflow = require('../workflows/w2-blocklist');
const RateLimitingWorkflow = require('../workflows/w3-rate-limiting');
const ProductionDeployWorkflow = require('../workflows/w4-production-deploy');
const LearningLoopWorkflow = require('../workflows/w5-learning-loop');

class CoreOSScheduler {
  constructor() {
    this.blocklist = new BlocklistGate();
    this.workflows = {};
    this.results = [];
  }

  async executeUltracode(taskDescription) {
    console.log('\n' + '='.repeat(80));
    console.log(`[CORE OS] Ultracode Phase 1 Activated`);
    console.log(`[CORE OS] Task: ${taskDescription}`);
    console.log('='.repeat(80) + '\n');

    try {
      const blockCheck = this.blocklist.preExecutionCheck(taskDescription);
      if (!blockCheck.allowed) {
        console.error(`[CORE OS] BLOCKED: ${blockCheck.reason}`);
        return {
          status: 'BLOCKED',
          reason: blockCheck.reason,
          alternative: blockCheck.alternative
        };
      }

      const workflowsToRun = this.identifyWorkflows(taskDescription);
      console.log(`[CORE OS] Identified ${workflowsToRun.length} workflows to execute\n`);

      const results = await this.executeWorkflows(workflowsToRun);

      const allValidated = results.every(r => r.status === 'VALIDATED');

      if (allValidated) {
        console.log(`\n[CORE OS] ✅ ALL WORKFLOWS VALIDATED`);
        await this.learningLoop(results);
        await this.createCheckpoint(results);

        return {
          status: 'PRODUCTION_READY',
          score: '10/10',
          results,
          checkpoint: true
        };
      } else {
        console.log(`\n[CORE OS] ❌ SOME WORKFLOWS FAILED`);
        return {
          status: 'PARTIAL',
          results,
          message: 'Fix failures and retry'
        };
      }
    } catch (err) {
      console.error(`[CORE OS] Fatal error: ${err.message}`);
      return {
        status: 'ERROR',
        error: err.message
      };
    }
  }

  identifyWorkflows(task) {
    const workflows = [];
    const taskLower = task.toLowerCase();

    if (taskLower.includes('all') || taskLower.includes('phase 1') || taskLower.includes('ultracode')) {
      workflows.push(new GitHealingWorkflow());
      workflows.push(new BlocklistWorkflow());
      workflows.push(new RateLimitingWorkflow());
      workflows.push(new ProductionDeployWorkflow());
      workflows.push(new LearningLoopWorkflow());
    } else {
      if (taskLower.includes('git') || taskLower.includes('repo') || taskLower.includes('w1')) {
        workflows.push(new GitHealingWorkflow());
      }
      if (taskLower.includes('blocklist') || taskLower.includes('security') || taskLower.includes('w2')) {
        workflows.push(new BlocklistWorkflow());
      }
      if (taskLower.includes('rate') || taskLower.includes('auth') || taskLower.includes('w3')) {
        workflows.push(new RateLimitingWorkflow());
      }
      if (taskLower.includes('production') || taskLower.includes('deploy') || taskLower.includes('w4')) {
        workflows.push(new ProductionDeployWorkflow());
      }
      if (taskLower.includes('learning') || taskLower.includes('checkpoint') || taskLower.includes('w5')) {
        workflows.push(new LearningLoopWorkflow());
      }
    }

    return workflows.length > 0 ? workflows : [new LearningLoopWorkflow()];
  }

  async executeWorkflows(workflows) {
    const results = [];

    for (const workflow of workflows) {
      try {
        const result = await workflow.execute();
        results.push(result);
      } catch (err) {
        console.error(`[CORE OS] Workflow ${workflow.id} failed: ${err.message}`);
        results.push({
          id: workflow.id,
          name: workflow.name,
          status: 'FAILED',
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return results;
  }

  async learningLoop(results) {
    console.log(`\n[CORE OS] Learning Loop: Capturing patterns...`);

    const patterns = results.map(r => ({
      pattern_id: `${r.id}-success`,
      workflow: r.id,
      status: 'VALIDATED',
      duration: r.duration,
      timestamp: r.timestamp,
      evidence_count: r.evidence ? r.evidence.length : 0
    }));

    const successesPath = '.claude/patterns/successes.json';
    let currentSuccesses = [];

    try {
      if (fs.existsSync(successesPath)) {
        currentSuccesses = JSON.parse(fs.readFileSync(successesPath, 'utf-8'));
      }
    } catch (e) {
      console.warn(`[CORE OS] Could not read successes.json: ${e.message}`);
    }

    const updated = Array.isArray(currentSuccesses)
      ? [...currentSuccesses, ...patterns]
      : patterns;

    try {
      fs.writeFileSync(successesPath, JSON.stringify(updated, null, 2));
      console.log(`[CORE OS] ✓ Captured ${patterns.length} patterns`);
    } catch (e) {
      console.error(`[CORE OS] Failed to write successes.json: ${e.message}`);
    }
  }

  async createCheckpoint(results) {
    console.log(`\n[CORE OS] Creating checkpoint...`);

    const checkpoint = {
      checkpoint_id: `ckpt-${new Date().toISOString().split('T')[0]}`,
      timestamp: new Date().toISOString(),
      status: 'PRODUCTION_READY',
      score: '10/10',
      phase: 1,
      workflows: results.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status,
        duration: r.duration
      })),
      total_duration: results.reduce((sum, r) => sum + (r.duration || 0), 0),
      next_phase: 'Phase 2: Advanced Monitoring'
    };

    const checkpointDir = '.claude/checkpoints';
    if (!fs.existsSync(checkpointDir)) {
      fs.mkdirSync(checkpointDir, { recursive: true });
    }

    try {
      fs.writeFileSync(
        path.join(checkpointDir, `${checkpoint.checkpoint_id}.json`),
        JSON.stringify(checkpoint, null, 2)
      );
      console.log(`[CORE OS] ✓ Checkpoint created: ${checkpoint.checkpoint_id}`);
    } catch (e) {
      console.error(`[CORE OS] Failed to create checkpoint: ${e.message}`);
    }
  }
}

module.exports = CoreOSScheduler;
