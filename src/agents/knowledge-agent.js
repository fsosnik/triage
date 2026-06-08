const { execSync } = require('child_process');
const GraphifyAdapter = require('../optimization/graphify-adapter');

class KnowledgeAgent {
  static async executeKnowledgeAgent(task) {
    console.log(`\n🧠 Knowledge Agent: ${task}`);

    // 1. GRAPHIFY
    let graphifyResult = { success: false, nodes: 0 };
    try {
      const adapter = new GraphifyAdapter();
      const nodeCount = adapter.nodeCount; // 5
      graphifyResult = {
        success: true,
        nodes: nodeCount,
        message: `Knowledge graph: ${nodeCount} nodes`
      };
      console.log(`   ✓ Graphify: ${nodeCount} nodes`);
    } catch (e) {
      console.log(`   ⚠️  Graphify: ${e.message}`);
    }

    // 2. RUFLO
    let rufloResult = { success: false };
    try {
      const output = execSync('npx ruflo@latest analyze complexity src/ 2>&1', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      const flaggedLine = output.split('\n').find(l => l.includes('Flagged'));
      rufloResult = {
        success: true,
        output: flaggedLine || 'Analysis complete'
      };
      console.log(`   ✓ Ruflo: ${flaggedLine || 'Analysis complete'}`);
    } catch (e) {
      console.log(`   ⚠️  Ruflo: ${e.message.split('\n')[0]}`);
    }

    return {
      task,
      success: graphifyResult.success && rufloResult.success,
      graphify: graphifyResult,
      ruflo: rufloResult
    };
  }
}

module.exports = KnowledgeAgent;
