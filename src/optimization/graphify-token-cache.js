const fs = require('fs');

class GraphifyTokenCache {
  constructor() {
    const graphPath = './graphify-out/graph.json';
    this.graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    this.godNodes = this.findGodNodes();
    this.communities = this.extractCommunities();
  }

  findGodNodes() {
    return this.graph.nodes
      .filter(n => n.degree > 20)
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 20);
  }

  extractCommunities() {
    const communities = {};
    this.graph.nodes.forEach(n => {
      const c = n.community || 'general';
      if (!communities[c]) communities[c] = [];
      communities[c].push(n.id);
    });
    return communities;
  }

  getRelevantNodes(taskType) {
    // Retorna nodos relevantes para task type
    const relevant = this.graph.nodes.filter(n => 
      n.label.toLowerCase().includes(taskType)
    );
    return relevant.slice(0, 10);
  }

  compressContext(nodes) {
    // Serialize nodes de forma comprimida
    return nodes.map(n => ({
      id: n.id,
      label: n.label,
      degree: n.degree,
      community: n.community
    }));
  }
}

module.exports = GraphifyTokenCache;
