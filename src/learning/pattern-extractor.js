class PatternExtractor {
  static extract(taskType, agents, result, metric) {
    if (!result.success) return null;

    return {
      id: `pattern-${Date.now()}`,
      name: taskType.replace(/\s+/g, '-'),
      category: this.categorize(taskType),
      task_type: taskType,
      agents_used: agents,
      success_rate: 100,
      execution_time_ms: metric.duration_ms,
      tokens_avg: metric.tokens_used,
      tools: this.extractTools(agents),
      constraints: result.constraints || [],
      steps: result.steps || [],
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      reuse_count: 0
    };
  }

  static categorize(taskType) {
    const t = taskType.toLowerCase();
    if (t.includes('auth')) return 'authentication';
    if (t.includes('test')) return 'testing';
    if (t.includes('deploy')) return 'deployment';
    if (t.includes('refactor')) return 'refactoring';
    return 'general';
  }

  static extractTools(agents) {
    const toolMap = {
      code: ['npm', 'git', 'tsc'],
      qa: ['jest', 'eslint'],
      research: ['web-search'],
      risk: ['git-diff']
    };
    const tools = new Set();
    agents.forEach(agent => {
      (toolMap[agent] || []).forEach(tool => tools.add(tool));
    });
    return Array.from(tools);
  }

  static isReusable(pattern) {
    return pattern && pattern.success_rate >= 90 && pattern.agents_used.length >= 2;
  }
}
module.exports = PatternExtractor;
