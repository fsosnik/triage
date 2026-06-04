const Graphify = require('graphify');

class GraphifyCompression {
  constructor() {
    this.gf = new Graphify();
  }

  // Usar Graphify para comprimir eventos
  compressEvents(events) {
    return events.map(e => 
      this.gf.graph({
        event: e.type,
        success: e.data.success,
        tokens: e.data.tokens,
        time: e.data.duration_ms
      }).compress()
    );
  }

  // Usar Graphify para comprimir patterns
  compressPatterns(patterns) {
    return patterns.map(p =>
      this.gf.graph({
        id: p.id,
        rate: p.success_rate,
        agents: p.agents,
        exec_time: p.execution_time
      }).compress()
    );
  }

  decompress(compressed) {
    return this.gf.decompress(compressed);
  }
}

module.exports = GraphifyCompression;
