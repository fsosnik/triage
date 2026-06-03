/**
 * Phase 11: Knowledge Management
 * Long-term learning storage & retrieval
 */

const fs = require('fs');
const path = require('path');

class KnowledgeBase {
  constructor() {
    this.insights = [];
    this.patterns = [];
    this.failures = [];
    this.load();
  }

  captureInsight(title, content, category, confidence = 0.8) {
    const insight = {
      id: `insight-${Date.now()}`,
      title,
      content,
      category,
      confidence,
      created_at: new Date().toISOString(),
      usage_count: 0,
      last_used: null
    };
    this.insights.push(insight);
    this.persist();
    return insight;
  }

  capturePattern(pattern_id, success_rate, agents, execution_time) {
    const pattern = {
      id: pattern_id,
      success_rate,
      agents,
      execution_time,
      learned_at: new Date().toISOString(),
      reuses: 0,
      improvements: []
    };
    this.patterns.push(pattern);
    this.persist();
    return pattern;
  }

  captureFailure(task, reason, failed_agents, recovery_time) {
    const failure = {
      id: `failure-${Date.now()}`,
      task,
      reason,
      failed_agents,
      recovery_time,
      timestamp: new Date().toISOString(),
      prevention: null
    };
    this.failures.push(failure);
    this.persist();
    return failure;
  }

  getInsightsByCategory(category) {
    return this.insights.filter(i => i.category === category);
  }

  getTopPatterns(limit = 10) {
    return this.patterns
      .sort((a, b) => b.success_rate - a.success_rate)
      .slice(0, limit);
  }

  getCommonFailures(limit = 5) {
    const grouped = {};
    this.failures.forEach(f => {
      grouped[f.reason] = (grouped[f.reason] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([reason, count]) => ({ reason, count }));
  }

  searchInsights(query) {
    return this.insights.filter(i =>
      i.title.includes(query) || i.content.includes(query)
    );
  }

  updateInsightUsage(insight_id) {
    const insight = this.insights.find(i => i.id === insight_id);
    if (insight) {
      insight.usage_count++;
      insight.last_used = new Date().toISOString();
      this.persist();
    }
  }

  getStats() {
    return {
      total_insights: this.insights.length,
      total_patterns: this.patterns.length,
      total_failures: this.failures.length,
      avg_pattern_success: this.patterns.length > 0
        ? (this.patterns.reduce((sum, p) => sum + p.success_rate, 0) / this.patterns.length * 100).toFixed(1) + '%'
        : 'N/A'
    };
  }

  persist() {
    try {
      const dir = path.join(process.cwd(), '.claude/knowledge');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(
        path.join(dir, 'insights.json'),
        JSON.stringify(this.insights, null, 2)
      );
      fs.writeFileSync(
        path.join(dir, 'patterns.json'),
        JSON.stringify(this.patterns, null, 2)
      );
      fs.writeFileSync(
        path.join(dir, 'failures.json'),
        JSON.stringify(this.failures, null, 2)
      );
    } catch (e) {
      // Skip
    }
  }

  load() {
    try {
      const dir = path.join(process.cwd(), '.claude/knowledge');
      
      const insightsFile = path.join(dir, 'insights.json');
      if (fs.existsSync(insightsFile)) {
        this.insights = JSON.parse(fs.readFileSync(insightsFile, 'utf-8'));
      }

      const patternsFile = path.join(dir, 'patterns.json');
      if (fs.existsSync(patternsFile)) {
        this.patterns = JSON.parse(fs.readFileSync(patternsFile, 'utf-8'));
      }

      const failuresFile = path.join(dir, 'failures.json');
      if (fs.existsSync(failuresFile)) {
        this.failures = JSON.parse(fs.readFileSync(failuresFile, 'utf-8'));
      }
    } catch (e) {
      // Use defaults
    }
  }
}

module.exports = KnowledgeBase;
