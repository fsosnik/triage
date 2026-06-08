const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class KnowledgeAgent {
  static async analyzeWithGraphify(taskContext = {}) {
    try {
      console.log('\n📊 Graphify Analysis...');
      
      // Ejecutar graphify para generar knowledge graph
      execSync('graphify . --analyze 2>&1', { 
        cwd: process.cwd(),
        stdio: 'pipe'
      });
      
      // Leer output si existe
      const graphifyOut = path.join(process.cwd(), 'graphify-out');
      if (fs.existsSync(graphifyOut)) {
        const files = fs.readdirSync(graphifyOut);
        console.log(`   ✓ Knowledge graph generated (${files.length} files)`);
        return { 
          success: true, 
          graph_generated: true,
          files: files
        };
      }
      
      return { success: true, graph_generated: false };
    } catch (e) {
      console.log(`   ⚠️  Graphify: ${e.message.split('\n')[0]}`);
      return { success: false, graph_generated: false };
    }
  }

  static async analyzeWithRuflo(taskContext = {}) {
    try {
      console.log('\n🔧 Ruflo Analysis...');
      
      // Ejecutar ruflo para análisis de complejidad
      const output = execSync('npx ruflo@latest analyze complexity src/ 2>&1', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      // Parse output para extraer métricas
      const lines = output.split('\n');
      const complexityLine = lines.find(l => l.includes('Flagged files'));
      
      console.log(`   ✓ Complexity analysis complete`);
      
      return {
        success: true,
        complexity_analyzed: true,
        output: complexityLine || 'Analysis complete'
      };
    } catch (e) {
      console.log(`   ⚠️  Ruflo: ${e.message.split('\n')[0]}`);
      return { success: false, complexity_analyzed: false };
    }
  }

  static async executeKnowledgeAgent(task) {
    console.log(`\n🧠 Knowledge Agent: ${task}`);
    
    const graphify = await this.analyzeWithGraphify();
    const ruflo = await this.analyzeWithRuflo();
    
    return {
      task: task,
      graphify_analysis: graphify,
      ruflo_analysis: ruflo,
      success: graphify.success && ruflo.success,
      insights: [
        graphify.graph_generated ? '✓ Knowledge graph generated' : '⚠️ No graph',
        ruflo.complexity_analyzed ? '✓ Complexity analyzed' : '⚠️ No analysis'
      ]
    };
  }
}

module.exports = KnowledgeAgent;
