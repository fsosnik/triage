const fs = require('fs');
const path = require('path');

class GraphifyAdapter {
  constructor() {
    try {
      const graphPath = path.join(process.cwd(), 'graphify-out/graph.json');
      const graphData = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
      this.nodes = graphData.nodes || [];
      this.edges = graphData.edges || [];
      console.log(`[GRAPHIFY] Loaded ${this.nodes.length} nodes from knowledge graph`);
    } catch (e) {
      console.warn('[GRAPHIFY] Could not load graph.json, using defaults');
      this.nodes = [
        { id: 'auth', label: 'authentication' },
        { id: 'code', label: 'code' },
        { id: 'sec', label: 'security' }
      ];
      this.edges = [];
    }
  }

  findSimilarPatterns(task) {
    const keywords = task.toLowerCase().split(' ');
    const matches = this.nodes.filter(n => 
      keywords.some(kw => n.label?.toLowerCase().includes(kw))
    ).slice(0, 3);
    return matches;
  }

  getNodeInfo(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  getConnectedNodes(nodeId) {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }
}

module.exports = GraphifyAdapter;