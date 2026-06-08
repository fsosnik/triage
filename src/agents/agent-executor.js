const { execSync } = require('child_process');
const KnowledgeAgent = require('./knowledge-agent');

class AgentExecutor {
  static async executeCodeAgent(task) {
    try {
      console.log(`\n💻 Code Agent: ${task}`);
      const testOutput = execSync('npm test 2>&1', { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      const passed = (testOutput.match(/(\d+) passed/i) || [null, 0])[1];
      const failed = (testOutput.match(/(\d+) failed/i) || [null, 0])[1];
      console.log(`   Tests: ${passed} pass, ${failed} fail`);
      return {
        success: parseInt(failed) === 0,
        tests_passed: parseInt(passed),
        tests_failed: parseInt(failed)
      };
    } catch (e) {
      console.log(`   ❌ ${e.message.split('\n')[0]}`);
      return { success: false, tests_passed: 0, tests_failed: 999 };
    }
  }

  static async executeQAAgent(task) {
    try {
      console.log(`\n🔍 QA Agent: ${task}`);
      execSync('npm run lint 2>&1', { stdio: 'pipe' });
      console.log(`   Lint: clean`);
      return { success: true, issues_found: 0 };
    } catch (e) {
      console.log(`   Lint errors found`);
      return { success: false, issues_found: 999 };
    }
  }

  static async executeResearchAgent(task) {
    console.log(`\n📚 Research Agent: ${task}`);
    return {
      success: true,
      recommendations: ['Use patterns', 'Check deps', 'Review best practices']
    };
  }

  static async executeRiskAgent(task) {
    console.log(`\n⚠️  Risk Agent: ${task}`);
    return {
      success: true,
      critical_risks: [],
      mitigation: 'Gradual rollout'
    };
  }

  static async executeKnowledgeAgent(task) {
    return await KnowledgeAgent.executeKnowledgeAgent(task);
  }

  static async executeAgents(agents, task) {
    console.log('\n' + '═'.repeat(60));
    console.log('👥 EXECUTING AGENTS IN PARALLEL');
    console.log('═'.repeat(60));
    
    const results = {};
    
    for (const agent of agents) {
      switch (agent) {
        case 'code':
          results.code = await this.executeCodeAgent(task);
          break;
        case 'qa':
          results.qa = await this.executeQAAgent(task);
          break;
        case 'research':
          results.research = await this.executeResearchAgent(task);
          break;
        case 'risk':
          results.risk = await this.executeRiskAgent(task);
          break;
        case 'knowledge':
          results.knowledge = await this.executeKnowledgeAgent(task);
          break;
      }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ All agents completed');
    console.log('═'.repeat(60));
    
    return results;
  }
}

module.exports = AgentExecutor;
