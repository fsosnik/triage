class GraphifyAdapter {
  constructor() {
    // Mock de 840 nodes - patterns comunes
    this.nodes = [
      { id: 'auth', label: 'authentication' },
      { id: 'code', label: 'code implementation' },
      { id: 'sec', label: 'security review' },
      { id: 'test', label: 'testing' },
      { id: 'perf', label: 'performance' },
      { id: 'data', label: 'data processing' },
      { id: 'deploy', label: 'deployment' },
      { id: 'api', label: 'API design' }
    ];
    this.edges = [];
  }

  findSimilarPatterns(task) {
    const keywords = task.toLowerCase().split(' ');
    const matches = this.nodes.filter(n => 
      keywords.some(kw => n.label.includes(kw))
    );
    return matches.slice(0, 3);
  }

  getNodeInfo(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  getConnectedNodes(nodeId) {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }
}

module.exports = GraphifyAdapter;
