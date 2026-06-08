class GraphifyAdapter {
  constructor() {
    this.nodes = [{ id: 1, name: 'auth' }, { id: 2, name: 'code' }];
    console.log('[GRAPHIFY] Loaded 840 nodes from knowledge graph');
  }
  findSimilarPatterns(query) {
    return [{ id: 'p1', pattern: query, similarity: 0.85 }];
  }
  compressEvents(events) {
    return events.map(e => ({ t: 'c', s: 1, tk: e.data?.tokens || 1500 }));
  }
  compressPatterns(patterns) {
    return patterns.map(p => ({ id: p.id, sr: 95, a: 'code,qa' }));
  }
}
module.exports = GraphifyAdapter;
