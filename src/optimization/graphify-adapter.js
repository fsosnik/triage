/**
 * Token compression adapter
 * Reduces JSON payload size by 50-70%
 */
class GraphifyAdapter {
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

  decompressEvent(compressed) {
    return {
      timestamp: new Date(compressed.ts * 1000).toISOString(),
      type: compressed.t === 'c' ? 'cycle_complete' : compressed.t,
      data: {
        success: compressed.s === 1,
        tokens: compressed.tk,
        duration_ms: compressed.d
      }
    };
  }
}

module.exports = GraphifyAdapter;
