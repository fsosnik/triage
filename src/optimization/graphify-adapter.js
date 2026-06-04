const Graphify = require('graphify');

class GraphifyAdapter {
  constructor() {
    this.gf = new Graphify();
  }

  compressEvents(events) {
    return events.map(e => ({
      t: e.type[0],
      ts: e.timestamp,
      s: e.data.success ? '1' : '0',
      tk: e.data.tokens,
      d: e.data.duration_ms
    }));
  }

  compressPatterns(patterns) {
    return patterns.map(p => ({
      id: p.id,
      sr: p.success_rate,
      agents: p.agents.join(','),
      time: p.execution_time
    }));
  }
}

module.exports = GraphifyAdapter;
