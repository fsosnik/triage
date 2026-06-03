/**
 * Phase 13: CLI Tools
 */

class CLI {
  constructor(triageOS, analytics, knowledge) {
    this.os = triageOS;
    this.analytics = analytics;
    this.kb = knowledge;
    this.commands = new Map();
    this.setupCommands();
  }

  setupCommands() {
    this.command('orchestrate', this.cmdOrchestrate.bind(this));
    this.command('metrics', this.cmdMetrics.bind(this));
    this.command('patterns', this.cmdPatterns.bind(this));
    this.command('status', this.cmdStatus.bind(this));
    this.command('insights', this.cmdInsights.bind(this));
    this.command('help', this.cmdHelp.bind(this));
  }

  command(name, handler) {
    this.commands.set(name, handler);
  }

  async execute(command, args) {
    const handler = this.commands.get(command);
    if (!handler) return { error: `Unknown command: ${command}` };
    return handler(args);
  }

  async cmdOrchestrate(args) {
    if (!args[0]) return { error: 'Task required' };
    const task = args.join(' ');
    return this.os.orchestrate({ task, context: '', constraints: [] });
  }

  async cmdMetrics(args) {
    const metrics = this.os.getMetrics();
    return {
      cycles: metrics.total_cycles,
      success_rate: metrics.success_rate,
      avg_tokens: metrics.avg_tokens,
      patterns: metrics.patterns_learned
    };
  }

  async cmdPatterns(args) {
    const limit = parseInt(args[0]) || 5;
    return {
      count: this.os.patterns.length,
      patterns: this.os.patterns.slice(0, limit)
    };
  }

  async cmdStatus(args) {
    return {
      version: '0.13.0',
      cycles: this.os.metrics.total_cycles,
      success_rate: (this.os.metrics.successful / Math.max(1, this.os.metrics.total_cycles) * 100).toFixed(1) + '%',
      patterns: this.os.patterns.length
    };
  }

  async cmdInsights(args) {
    return this.kb.getStats();
  }

  async cmdHelp(args) {
    return {
      commands: Array.from(this.commands.keys()),
      usage: 'triage <command> [args]',
      examples: [
        'triage orchestrate implement user auth',
        'triage metrics',
        'triage patterns 10',
        'triage status',
        'triage insights'
      ]
    };
  }

  getHelp() {
    return `TRIAGE OS v0.13.0
Commands:
  orchestrate <task>  - Run task through TRIAGE OS
  metrics             - Show system metrics
  patterns [limit]    - List learned patterns
  status              - System status
  insights            - Knowledge base stats
  help                - This message`;
  }
}

module.exports = CLI;
