/**
 * TRIAGE OS - Metrics Dashboard
 * Real-time monitoring of system performance
 */

const fs = require('fs');
const path = require('path');

class MetricsDashboard {
  constructor() {
    this.snapshots = [];
    this.loadSnapshots();
  }

  captureSnapshot(os, optimizer) {
    const snapshot = {
      timestamp: new Date().toISOString(),
      orchestrator: os.getMetrics(),
      optimizer: optimizer.getMetrics(),
      system: {
        patterns_in_library: os.patterns.length,
        blocklist_size: os.blocklist.length,
        checkpoints_created: this.countCheckpoints()
      }
    };

    this.snapshots.push(snapshot);
    this.saveSnapshots();
    return snapshot;
  }

  countCheckpoints() {
    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) return 0;
      return fs.readdirSync(dir).filter(f => f.endsWith('.json')).length;
    } catch (e) {
      return 0;
    }
  }

  getLatestSnapshot() {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  getTrend(metric, cycles = 5) {
    const recent = this.snapshots.slice(-cycles);
    if (recent.length < 2) return 'insufficient data';

    const values = recent.map(s => s.optimizer?.metrics?.[metric] || 0);
    const trend = values[values.length - 1] - values[0];

    return trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable';
  }

  generateReport() {
    const latest = this.getLatestSnapshot();
    if (!latest) return 'No snapshots yet';

    const orch = latest.orchestrator;
    const opt = latest.optimizer;
    const sys = latest.system;

    return `
TRIAGE OS - System Report
========================

Orchestrator:
  Total cycles: ${orch.total_cycles}
  Success rate: ${orch.success_rate}
  Avg tokens/cycle: ${orch.avg_tokens}
  Patterns learned: ${orch.patterns_learned}

Optimization:
  Cache hit rate: ${opt.cache_hit_rate}
  Compression ratio: ${opt.compression_ratio}
  Total tokens used: ${opt.total_tokens}
  Cache hits: ${opt.cache_hits}

System:
  Patterns in library: ${sys.patterns_in_library}
  Blocklist entries: ${sys.blocklist_size}
  Checkpoints created: ${sys.checkpoints_created}
`;
  }

  loadSnapshots() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/metrics-snapshots.json');
      if (fs.existsSync(file)) {
        this.snapshots = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      this.snapshots = [];
    }
  }

  saveSnapshots() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'metrics-snapshots.json'),
        JSON.stringify(this.snapshots.slice(-100), null, 2)
      );
    } catch (e) {
      // Skip
    }
  }
}

module.exports = MetricsDashboard;
