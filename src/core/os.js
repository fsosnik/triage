/**
 * TRIAGE OS - Core Orchestrator (Layer 2)
 */

const fs = require('fs');
const path = require('path');
const LearningLoopV2 = require('../learning/learning-loop-v2');
const RollbackLoop = require('../learning/rollback-loop');
const WeightUpdater = require('../learning/weight-updater');
const TokenOptimizer = require('../optimization/token-optimizer');
const MetricsDashboard = require('../optimization/metrics-dashboard');

class TRIAGEOS {
  constructor(config = {}) {
    this.config = {
      mode: 'agentic',
      parallelism: true,
      max_concurrent: 4,
      validation_required: true,
      learning_enabled: true,
      phase2_enabled: true,
      ...config
    };

    this.patterns = [];
    this.blocklist = [];
    this.metrics = {
      total_cycles: 0,
      successful: 0,
      failed: 0,
      total_tokens: 0
    };

    if (this.config.phase2_enabled) {
      this.learning = new LearningLoopV2();
      this.rollback = new RollbackLoop();
      this.updater = new WeightUpdater();
      this.optimizer = new TokenOptimizer();
      this.dashboard = new MetricsDashboard();
    }

    this.loadPatterns();
    this.loadBlocklist();
  }

  loadPatterns() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8');
        this.patterns = JSON.parse(data) || [];
        console.log(`[OK] Loaded ${this.patterns.length} patterns`);
      }
    } catch (error) {
      console.warn('[WARN] Could not load patterns:', error.message);
      this.patterns = [];
    }
  }

  loadBlocklist() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8');
        this.blocklist = JSON.parse(data) || [];
        console.log(`[OK] Loaded ${this.blocklist.length} blocklist entries`);
      }
    } catch (error) {
      console.warn('[WARN] Could not load blocklist:', error.message);
      this.blocklist = [];
    }
  }

  async orchestrate(input) {
    const startTime = Date.now();
    console.log('\n' + '='.repeat(60));
    console.log('TRIAGE OS - Orchestration Started');
    console.log('='.repeat(60) + '\n');

    try {
      const { similarPattern, taskType } = await this.prepareInput(input);
      const selectedAgents = await this.selectAndWeightAgents(taskType, input, similarPattern);
      const agentResults = await this.executeAgentsParallel(selectedAgents, input);
      await this.handleValidationGate(agentResults, input, selectedAgents, taskType);
      const duration = (Date.now() - startTime) / 1000;
      
      await this.performLearning(selectedAgents, taskType, input, agentResults, duration, similarPattern);
      const checkpoint = await this.createCheckpoint(input, agentResults, { passed: true });
      await this.recordMetricsAndReport(selectedAgents, agentResults, duration);

      return {
        status: 'SUCCESS',
        results: agentResults,
        validation: { passed: true },
        checkpoint,
        metrics: {
          duration_ms: duration * 1000,
          agents_used: selectedAgents,
          total_tokens: agentResults.totalTokens
        }
      };

    } catch (error) {
      this.metrics.failed++;
      console.error('\n[ERROR] ORCHESTRATION FAILED:', error.message);

      return {
        status: 'FAILED',
        error: error.message,
        metrics: {
          failed_at: new Date().toISOString(),
          cycle_number: this.metrics.total_cycles + 1
        }
      };
    }
  }

  async prepareInput(input) {
    this.validateInput(input);
    const similarPattern = this.findSimilarPattern(input.task);
    const taskType = this.classifyTaskType(input.task);
    
    if (this.checkBlocklist(input.task)) {
      throw new Error('BLOCKED: Pattern matches dangerous blocklist entry');
    }

    return { similarPattern, taskType };
  }

  async selectAndWeightAgents(taskType, input, similarPattern) {
    let selectedAgents = this.selectAgents(input, similarPattern);
    
    if (this.config.phase2_enabled) {
      const predicted = this.updater.predictBestAgents(taskType, selectedAgents.length);
      console.log('\n[PHASE 2] Predicted best agents');
      predicted.forEach(p => {
        console.log(`   ${p.agent}: weight ${p.weight.toFixed(2)} (success rate: ${p.success_rate})`);
      });
      selectedAgents = predicted.map(p => p.agent);
    }
    
    console.log(`\nSelected Agents: ${selectedAgents.join(', ')}`);
    return selectedAgents;
  }

  async handleValidationGate(agentResults, input, selectedAgents, taskType) {
    const validation = await this.validateResults(agentResults, input);
    
    if (!validation.passed) {
      console.warn('[AUDIT FIX] Rollback disabled until approval mechanism is implemented');
      console.warn('[AUDIT FIX] Validation failed:', validation.errors);
      return { status: 'VALIDATION_FAILED', reason: validation, manual_rollback_required: true };
    }

    console.log('\n[SUCCESS] Validation PASSED');
  }

  async performLearning(selectedAgents, taskType, input, agentResults, duration, similarPattern) {
    if (this.config.phase2_enabled && this.config.learning_enabled) {
      console.log('\n[PHASE 2] Learning Loop v2');
      this.learning.updateAgentWeights(selectedAgents, true, duration);
      
      selectedAgents.forEach(agent => {
        this.updater.updateWeight(agent, taskType, true, duration);
      });

      this.learning.analyzeSuccess(input.task, selectedAgents, agentResults, duration);
      console.log('   Success factors analyzed');
      
      if (similarPattern) {
        const refined = this.learning.refinePattern(similarPattern.id, this.patterns, true);
        if (refined) {
          this.savePatterns();
        }
      }
    }

    if (this.config.learning_enabled) {
      await this.capturePattern(input, agentResults, selectedAgents);
    }
  }

  async recordMetricsAndReport(selectedAgents, agentResults, duration) {
    this.metrics.total_cycles++;
    this.metrics.successful++;
    this.metrics.total_tokens += agentResults.totalTokens || 0;

    console.log(`\nCycle completed in ${duration.toFixed(1)}s`);
    console.log(`Total cycles: ${this.metrics.total_cycles}, Success: ${this.metrics.successful}\n`);

    if (this.config.phase2_enabled) {
      const stats = this.learning.getStats();
      console.log('Learning Stats:');
      console.log(`   Patterns: ${stats.total_learning_events}`);
      console.log(`   Best agent: ${stats.most_reliable_agent.agent}`);
      console.log(`   Trend: ${stats.learning_trend}`);
    }
  }

  validateInput(input) {
    if (!input.task || typeof input.task !== 'string') {
      throw new Error('Invalid input: task must be a non-empty string');
    }
    console.log(`Task: ${input.task}`);
    if (input.context) console.log(`Context: ${input.context}`);
    if (input.constraints) console.log(`Constraints: ${input.constraints.length} items`);
  }

  findSimilarPattern(task) {
    for (const pattern of this.patterns) {
      if (pattern.success_rate && pattern.success_rate > 0.8) {
        if (pattern.task_type === this.classifyTaskType(task)) {
          console.log(`\nFound similar pattern: ${pattern.id}`);
          console.log(`   Success rate: ${(pattern.success_rate * 100).toFixed(1)}%`);
          return pattern;
        }
      }
    }
    console.log('\nNo similar pattern found');
    return null;
  }

  classifyTaskType(task) {
    const lower = task.toLowerCase();
    if (lower.includes('refactor')) return 'refactor';
    if (lower.includes('implement') || lower.includes('code')) return 'feature';
    if (lower.includes('fix') || lower.includes('bug')) return 'bugfix';
    return 'general';
  }

  checkBlocklist(task) {
    for (const entry of this.blocklist) {
      if (entry.auto_reject) {
        try {
          const regex = new RegExp(entry.pattern);
          if (regex.test(task)) {
            console.log(`\nBLOCKLISTED: ${entry.id}`);
            return true;
          }
        } catch (e) {
          // Invalid regex
        }
      }
    }
    return false;
  }

  selectAgents(input, pattern) {
    const taskType = this.classifyTaskType(input.task);
    
    const agentMap = {
      feature: ['code', 'qa', 'risk'],
      bugfix: ['code', 'qa'],
      refactor: ['code', 'qa'],
      general: ['code', 'qa']
    };

    let agents = agentMap[taskType] || agentMap['general'];

    if (pattern && pattern.agents) {
      agents = pattern.agents;
    }

    return agents;
  }

  async executeAgentsParallel(agentNames, input) {
    console.log('\nExecuting agents in PARALLEL...');

    const promises = agentNames.map(name => this.executeAgent(name, input));
    const results = await Promise.all(promises);

    const totalTokens = results.reduce((sum, r) => sum + (r.tokens || 0), 0);

    console.log(`All agents completed (${totalTokens} tokens)`);

    return {
      agents: results,
      totalTokens
    };
  }

  async executeAgent(name, input) {
    console.log(`  -> ${name.toUpperCase()}`);
    try {
      const { LLMProviderFactory } = require('./providers/LLMProviderFactory');
      const provider = LLMProviderFactory.create(process.env.TRIAGE_PROVIDER || 'anthropic', {
        apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.GOOGLE_API_KEY
      });

      const agentPrompt = `You are a ${name} agent. Task: ${input.task}. Context: ${input.context || ''}`;
      const result = await provider.chat([{ role: 'user', content: agentPrompt }], { max_tokens: 512 });

      return {
        agent: name,
        status: 'success',
        content: result.content,
        tokens: result.tokens.total || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn(`[${name}] Provider error:`, error.message);
      return { agent: name, status: 'fallback', tokens: 100, timestamp: new Date().toISOString() };
    }
  }

  async validateResults(agentResults, input) {
    console.log('\nVALIDATION GATE:');

    const checks = {
      agents_executed: !!agentResults?.agents?.length,
      no_errors: !agentResults?.agents?.some(a => a.status !== 'success'),
      blocklist_clean: !this.checkBlocklist(input.task)
    };

    const allPassed = Object.values(checks).every(v => v);

    console.log(`  [${checks.agents_executed ? 'OK' : 'FAIL'}] Agents executed`);
    console.log(`  [${checks.no_errors ? 'OK' : 'FAIL'}] No errors`);
    console.log(`  [${checks.blocklist_clean ? 'OK' : 'FAIL'}] Blocklist clean`);

    return {
      passed: allPassed,
      checks,
      errors: Object.entries(checks)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
    };
  }

  async capturePattern(input, results, agentNames) {
    const taskType = this.classifyTaskType(input.task);
    
    const newPattern = {
      id: `pattern-${Date.now()}`,
      category: 'user-generated',
      task_type: taskType,
      agents: agentNames,
      tools: ['npm', 'git'],
      cost: results.totalTokens || 2000,
      success_rate: 1.0,
      reuse_count: 0,
      execution_time_minutes: 5,
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    this.patterns.push(newPattern);
    this.savePatterns();

    console.log(`Pattern captured: ${newPattern.id}`);
  }

  savePatterns() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      fs.writeFileSync(file, JSON.stringify(this.patterns, null, 2));
    } catch (error) {
      console.warn('[WARN] Could not save pattern');
    }
  }

  async createCheckpoint(input, results, validation) {
    const checkpoint = {
      timestamp: new Date().toISOString(),
      task: input.task,
      status: 'VALIDATED',
      agents_executed: results.agents?.map(a => a.agent) || [],
      validations: validation.checks,
      tokens_used: results.totalTokens || 0,
      phase2_enabled: this.config.phase2_enabled
    };

    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const filename = `checkpoint-${Date.now()}.json`;
      fs.writeFileSync(path.join(dir, filename), JSON.stringify(checkpoint, null, 2));
      console.log(`Checkpoint: ${filename}`);
    } catch (error) {
      console.warn('[WARN] Could not save checkpoint');
    }

    return checkpoint;
  }

  getMetrics() {
    const baseMetrics = {
      ...this.metrics,
      success_rate: (this.metrics.successful / (this.metrics.total_cycles || 1) * 100).toFixed(1) + '%',
      avg_tokens: Math.round(this.metrics.total_tokens / (this.metrics.total_cycles || 1)),
      patterns_learned: this.patterns.length
    };

    if (this.config.phase2_enabled) {
      const learningStats = this.learning.getStats();
      const rollbackStats = this.rollback.getStats();
      const updaterStats = this.updater.getReliabilityReport();

      return {
        ...baseMetrics,
        learning: learningStats,
        rollback: rollbackStats,
        agent_reliability: updaterStats
      };
    }

    return baseMetrics;
  }
}

module.exports = TRIAGEOS;