class GraphifyCompression {
  compressEvents(events) {
    return events.map(e => ({
      t: e.type[0],
      ts: Math.floor(new Date(e.timestamp).getTime() / 1000),
      s: e.data.success ? 1 : 0,
      tk: e.data.tokens,
      d: e.data.duration_ms
    }));
  }
  compressPatterns(patterns) {
    return patterns.map(p => ({
      id: p.id,
      sr: (p.success_rate * 100) | 0,
      a: p.agents.join(','),
      t: p.execution_time
    }));
  }
}
module.exports = GraphifyCompression;
