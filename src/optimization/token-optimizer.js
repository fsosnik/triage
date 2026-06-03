/**
 * TRIAGE OS - Phase 3: Token Optimization
 * Layer 4b: Cache & Compression System
 * 
 * Reduces token consumption through:
 * - Anthropic prompt caching (cache_control)
 * - Pattern library compression
 * - Context window optimization
 * - Reusable prompt templates
 */

const fs = require('fs');
const path = require('path');

class TokenOptimizer {
  constructor() {
    this.cache = new Map();
    this.metrics = {
      total_input_tokens: 0,
      total_output_tokens: 0,
      cache_hits: 0,
      cache_misses: 0,
      compression_ratio: 0
    };
    this.loadCache();
  }

  /**
   * Create cacheable prompt with Anthropic cache_control
   * https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
   */
  createCacheablePrompt(content, type = 'ephemeral') {
    return {
      type: 'text',
      text: content,
      cache_control: { type }  // 'ephemeral' or 'system' (if in system prompt)
    };
  }

  /**
   * Compress pattern library for API calls
   */
  compressPatterns(patterns) {
    if (patterns.length === 0) return '';

    const compressed = patterns
      .filter(p => p.success_rate > 0.7)  // Only high-confidence patterns
      .map(p => ({
        id: p.id,
        type: p.task_type,
        agents: p.agents.join(','),
        sr: p.success_rate.toFixed(1),
        cost: p.cost
      }));

    const original = JSON.stringify(patterns);
    const compressedStr = JSON.stringify(compressed);
    this.metrics.compression_ratio = ((1 - compressedStr.length / original.length) * 100).toFixed(1);

    return compressedStr;
  }

  /**
   * Optimize context window
   * Keep only recent & relevant patterns
   */
  optimizeContext(patterns, taskType, limit = 5) {
    return patterns
      .filter(p => p.task_type === taskType || p.success_rate > 0.9)
      .sort((a, b) => new Date(b.last_used) - new Date(a.last_used))
      .slice(0, limit);
  }

  /**
   * Create reusable prompt template
   */
  createPromptTemplate(taskType) {
    const templates = {
      feature: `Task: Implement feature
Constraints: {constraints}
Agents: {agents}
Success patterns: {patterns}
Action: {action}`,
      bugfix: `Bug Report: {task}
Severity: {severity}
Agents: {agents}
Similar fixes: {patterns}
Approach: {approach}`,
      refactor: `Refactor scope: {task}
Impact: {impact}
Agents: {agents}
Reference patterns: {patterns}
Strategy: {strategy}`
    };

    return templates[taskType] || templates.feature;
  }

  /**
   * Build API request with cache_control
   */
  buildCachedRequest(task, patterns, agents, taskType) {
    const systemPrompt = this.createCacheablePrompt(
      `You are TRIAGE OS. Classify tasks and route to specialized agents.
Agents: code (implementation), qa (quality), research (context), risk (impact)
Current patterns: ${this.compressPatterns(patterns)}`,
      'system'
    );

    const relevantPatterns = this.optimizeContext(patterns, taskType);
    const userPrompt = this.createCacheablePrompt(
      `Task: ${task}
Relevant patterns: ${JSON.stringify(relevantPatterns)}
Selected agents: ${agents.join(', ')}`,
      'ephemeral'
    );

    return {
      model: 'claude-opus-4-6',
      max_tokens: 1000,
      system: [systemPrompt],
      messages: [{
        role: 'user',
        content: [userPrompt]
      }]
    };
  }

  /**
   * Track cache performance
   */
  recordCacheHit(tokens) {
    this.metrics.cache_hits++;
    this.metrics.total_input_tokens += Math.floor(tokens * 0.1);  // Cache reads cost 10%
  }

  recordCacheMiss(tokens) {
    this.metrics.cache_misses++;
    this.metrics.total_input_tokens += tokens;
  }

  recordOutput(tokens) {
    this.metrics.total_output_tokens += tokens;
  }

  /**
   * Estimate token savings with caching
   */
  estimateSavings(cycles = 10) {
    const uncachedCost = cycles * 2000;  // ~2K tokens per cycle baseline
    const cachedCost = (cycles * 2000 * 0.25);  // 75% reduction with cache hits
    const savings = uncachedCost - cachedCost;
    const savingsPercent = (savings / uncachedCost * 100).toFixed(1);

    return {
      uncached_cost: uncachedCost,
      cached_cost: cachedCost,
      savings_tokens: Math.round(savings),
      savings_percent: savingsPercent,
      estimated_monthly_cost: (cachedCost / 1000000 * 0.003).toFixed(2)  // $0.003 per 1M input tokens
    };
  }

  /**
   * Get optimization metrics
   */
  getMetrics() {
    const hitRate = this.metrics.cache_hits + this.metrics.cache_misses > 0
      ? (this.metrics.cache_hits / (this.metrics.cache_hits + this.metrics.cache_misses) * 100).toFixed(1)
      : 0;

    return {
      ...this.metrics,
      cache_hit_rate: `${hitRate}%`,
      total_tokens: this.metrics.total_input_tokens + this.metrics.total_output_tokens,
      compression_ratio: `${this.metrics.compression_ratio}%`
    };
  }

  loadCache() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/token-cache.json');
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.metrics = data;
      }
    } catch (e) {
      // Use defaults
    }
  }

  saveCache() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'token-cache.json'),
        JSON.stringify(this.metrics, null, 2)
      );
    } catch (e) {
      // Skip
    }
  }
}

module.exports = TokenOptimizer;
