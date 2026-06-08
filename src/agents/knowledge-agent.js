const { execSync } = require('child_process');
const GraphifyAdapter = require('../optimization/graphify-adapter');

class KnowledgeAgent {
  static async executeKnowledgeAgent(task) {
    console.log(`\n🧠 Knowledge Agent: ${task}`);

    // 1. GRAPHIFY
    let graphify = { success: false, nodes: 0 };
    try {
      const adapter = new GraphifyAdapter();
      graphify = {
        success: true,
        nodes: adapter.nodeCount,
        message: `Knowledge graph: ${adapter.nodeCount} nodes analyzed`
      };
      console.log(`   ✓ Graphify: ${adapter.nodeCount} nodes`);
    } catch (e) {
      console.log(`   ⚠️  Graphify: ${e.message}`);
    }

    // 2. RUFLO
    let ruflo = { success: false };
    try {
      const output = execSync('npx ruflo@latest analyze complexity src/ 2>&1', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      const flagged = output.split('\n').find(l => l.includes('Flagged'));
      ruflo = {
        success: true,
        analysis: flagged || 'Analysis complete'
      };
      console.log(`   ✓ Ruflo: ${flagged || 'complete'}`);
    } catch (e) {
      console.log(`   ⚠️  Ruflo: ${e.message.split('\n')[0]}`);
    }

    return {
      task,
      success: graphify.success && ruflo.success,
      graphify,
      ruflo
    };
  }
}

module.exports = KnowledgeAgent;
