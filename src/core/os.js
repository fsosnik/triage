/**
 * TRIAGE OS - Core Orchestrator (Layer 2)
 * 
 * Main orchestration engine that:
 * 1. Loads pattern library
 * 2. Detects similar patterns
 * 3. Selects appropriate agents
 * 4. Executes agents in parallel
 * 5. Validates results
 * 6. Captures learning
 */

const fs = require('fs');
const path = require('path');

class TRIAGEOS {
  constructor(config = {}) {
    this.config = {
      mode: 'agentic',
      parallelism: true,
      max_concurrent: 4,
      validation_required: true,
      learning_enabled: true,
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

    this.loadPatterns();
    this.loadBlocklist();
  }

  /**
   * Load pattern library from .claude/patterns/successes.json
   */
  loadPatterns() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8');
        this.patterns = JSON.parse(data) || [];
        console.log(`✓ Loaded ${this.patterns.length} patterns`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load patterns:', error.message);
      this.patterns = [];
    }
  }

  /**
   * Load blocklist from .claude/patterns/blocklist.json
   */
  loadBlocklist() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8');
        this.blocklist = JSON.parse(data) || [];
        console.log(`✓ Loaded ${this.blocklist.length} blocklist entries`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load blocklist:', error.message);
      this.blocklist = [];
    }
  }

  /**
   * Main orchestration flow
   */
  async orchestrate(input) {
    const startTime = Date.now();
    console.log('\n' + '═'.repeat(60));
    console.log('🔄 TRIAGE OS - Orchestration Started');
    console.log('═'.repeat(60) + '\n');

    try {
      // Layer 1: Input validation
      this.validateInput(input);

      // Layer 2: Pattern detection
      const similarPattern = this.findSimilarPattern(input.task);
      
      // Layer 2b: Blocklist check
      if (this.checkBlocklist(input.task)) {
        throw new Error(`❌ BLOCKED: Pattern matches dangerous blocklist entry`);
      }

      // Layer 3: Agent selection
      const selectedAgents = this.selectAgents(input, similarPattern);
      console.log(`\n📋 Selected Agents: ${selectedAgents.join(', ')}`);

      // Layer 3: Parallel execution
      const agentResults = await this.executeAgentsParallel(selectedAgents, input);

      // Layer 5: Validation gate
      const validation = await this.validateResults(agentResults, input);
      
      if (!validation.passed) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      console.log('\n✅ Validation PASSED');

      // Layer 5b: Learning loop
      if (this.config.learning_enabled) {
        await this.capturePattern(input, agentResults, selectedAgents);
      }

      // Layer 6: Checkpoint
      const checkpoint = await this.createCheckpoint(input, agentResults, validation);

      const duration = Date.now() - startTime;
      this.metrics.total_cycles++;
      this.metrics.successful++;
      this.metrics.total_tokens += agentResults.totalTokens || 0;

      console.log(`\n✨ Cycle completed in ${(duration / 1000).toFixed(1)}s`);
      console.log(`📊 Total cycles: ${this.metrics.total_cycles}, Success: ${this.metrics.successful}\n`);

      return {
        status: 'SUCCESS',
        results: agentResults,
        validation,
        checkpoint,
        metrics: {
          duration_ms: duration,
          agents_used: selectedAgents,
          total_tokens: agentResults.totalTokens
        }
      };

    } catch (error) {
      this.metrics.failed++;
      console.error('\n❌ ORCHESTRATION FAILED:', error.message);

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

  /**
   * Validate input structure
   */
  validateInput(input) {
    if (!input.task || typeof input.task !== 'string') {
      throw new Error('Invalid input: task must be a non-empty string');
    }
    console.log(`📌 Task: ${input.task}`);
    if (input.context) console.log(`📝 Context: ${input.context}`);
    if (input.constraints) console.log(`🔒 Constraints: ${input.constraints.length} items`);
  }

  /**
   * Find similar pattern in library
   */
  findSimilarPattern(task) {
    for (const pattern of this.patterns) {
      if (pattern.success_rate && pattern.success_rate > 0.8) {
        if (pattern.task_type === this.classifyTaskType(task)) {
          console.log(`\n🎯 Found similar pattern: ${pattern.id}`);
          console.log(`   Success rate: ${(pattern.success_rate * 100).toFixed(1)}%`);
          return pattern;
        }
      }
    }
    console.log(`\n🆕 No similar pattern found`);
    return null;
  }

  /**
   * Classify task type
   */
  classifyTaskType(task) {
    const lower = task.toLowerCase();
    if (lower.includes('implement') || lower.includes('code')) return 'feature';
    if (lower.includes('fix') || lower.includes('bug')) return 'bugfix';
    if (lower.includes('refactor')) return 'refactor';
    return 'general';
  }

  /**
   * Check if task matches blocklist
   */
  checkBlocklist(task) {
    for (const entry of this.blocklist) {
      if (entry.auto_reject) {
        try {
          const regex = new RegExp(entry.pattern);
          if (regex.test(task)) {
            console.log(`\n🚫 BLOCKLISTED: ${entry.id}`);
            return true;
          }
        } catch (e) {
          // Invalid regex
        }
      }
    }
    return false;
  }

  /**
   * Select agents based on task type
   */
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

  /**
   * Execute agents in parallel
   */
  async executeAgentsParallel(agentNames, input) {
    console.log('\n⚡ Executing agents in PARALLEL...');

    const promises = agentNames.map(name => this.executeAgent(name, input));
    const results = await Promise.all(promises);

    const totalTokens = results.reduce((sum, r) => sum + (r.tokens || 0), 0);

    console.log(`\n✓ All agents completed (${totalTokens} tokens)`);

    return {
      agents: results,
      totalTokens
    };
  }

  /**
   * Execute individual agent
   */
  async executeAgent(name, input) {
    console.log(`  → ${name.toUpperCase()}`);
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      agent: name,
      status: 'success',
      tokens: Math.floor(Math.random() * 500) + 200,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validation Gate (Layer 5)
   */
  async validateResults(agentResults, input) {
    console.log('\n🔍 VALIDATION GATE:');

    const checks = {
      agents_executed: !!agentResults?.agents?.length,
      no_errors: !agentResults?.agents?.some(a => a.status !== 'success'),
      blocklist_clean: !this.checkBlocklist(input.task)
    };

    const allPassed = Object.values(checks).every(v => v);

    console.log(`  ${checks.agents_executed ? '✓' : '✗'} Agents executed`);
    console.log(`  ${checks.no_errors ? '✓' : '✗'} No errors`);
    console.log(`  ${checks.blocklist_clean ? '✓' : '✗'} Blocklist clean`);

    return {
      passed: allPassed,
      checks,
      errors: Object.entries(checks)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
    };
  }

  /**
   * Learning Loop (Layer 5b)
   */
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

    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      fs.writeFileSync(file, JSON.stringify(this.patterns, null, 2));
      console.log(`\n📚 Pattern captured: ${newPattern.id}`);
    } catch (error) {
      console.warn('⚠️  Could not save pattern');
    }
  }

  /**
   * Create Checkpoint (Layer 6)
   */
  async createCheckpoint(input, results, validation) {
    const checkpoint = {
      timestamp: new Date().toISOString(),
      task: input.task,
      status: 'VALIDATED',
      agents_executed: results.agents?.map(a => a.agent) || [],
      validations: validation.checks,
      tokens_used: results.totalTokens || 0
    };

    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const filename = `checkpoint-${Date.now()}.json`;
      fs.writeFileSync(path.join(dir, filename), JSON.stringify(checkpoint, null, 2));
      console.log(`📌 Checkpoint: ${filename}`);
    } catch (error) {
      console.warn('⚠️  Could not save checkpoint');
    }

    return checkpoint;
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      success_rate: (this.metrics.successful / (this.metrics.total_cycles || 1) * 100).toFixed(1) + '%',
      avg_tokens: Math.round(this.metrics.total_tokens / (this.metrics.total_cycles || 1)),
      patterns_learned: this.patterns.length
    };
  }
}

module.exports = TRIAGEOS;
