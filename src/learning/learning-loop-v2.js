/**
 * TRIAGE OS - Learning Loop v2
 * Layer 5b: Adaptive Learning System
 * 
 * Características:
 * - Actualiza pesos de agentes dinámicamente
 * - Captura por qué funcionaron las cosas
 * - Refina patrones después de múltiples usos
 * - Aprende de errores y éxitos
 */

const fs = require('fs');
const path = require('path');

class LearningLoopV2 {
  constructor() {
    this.agentWeights = {
      code: 0.8,
      qa: 0.6,
      research: 0.5,
      risk: 0.7
    };
    this.learningLog = [];
    this.loadWeights();
  }

  /**
   * Cargar pesos guardados
   */
  loadWeights() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/weights.json');
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.agentWeights = data;
        console.log('✓ Loaded agent weights');
      }
    } catch (e) {
      console.warn('⚠️  Using default weights');
    }
  }

  /**
   * Guardar pesos
   */
  saveWeights() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const file = path.join(dir, 'weights.json');
      fs.writeFileSync(file, JSON.stringify(this.agentWeights, null, 2));
    } catch (e) {
      console.warn('⚠️  Could not save weights');
    }
  }

  /**
   * Actualizar pesos de agentes basado en éxito/fallo
   */
  updateAgentWeights(agents, success, executionTime) {
    console.log('\n📊 Learning: Updating agent weights...');

    const INCREMENT_SUCCESS = 0.1;
    const DECREMENT_FAILURE = 0.15;
    const EFFICIENCY_BONUS = executionTime < 0.2 ? 0.05 : 0;

    agents.forEach(agentName => {
      const currentWeight = this.agentWeights[agentName] || 0.5;
      
      let delta = 0;
      if (success) {
        delta = INCREMENT_SUCCESS + EFFICIENCY_BONUS;
        console.log(`  ↗️  ${agentName}: +${delta.toFixed(2)} (success)`);
      } else {
        delta = -DECREMENT_FAILURE;
        console.log(`  ↘️  ${agentName}: ${delta.toFixed(2)} (failure)`);
      }

      // Actualizar peso (clamped 0.0 - 1.0)
      const newWeight = Math.max(0.1, Math.min(1.0, currentWeight + delta));
      this.agentWeights[agentName] = parseFloat(newWeight.toFixed(2));
    });

    // Guardar pesos actualizados
    this.saveWeights();

    console.log('\n✓ Weights updated:');
    Object.entries(this.agentWeights).forEach(([agent, weight]) => {
      console.log(`  ${agent}: ${weight.toFixed(2)}`);
    });
  }

  /**
   * Analizar qué funcionó
   */
  analyzeSuccess(task, agents, results, validationTime) {
    const analysis = {
      timestamp: new Date().toISOString(),
      task: task,
      task_type: this.classifyTask(task),
      agents_used: agents,
      success_factors: {
        all_agents_passed: agents.length > 0,
        execution_efficient: validationTime < 0.2,
        no_retries_needed: true,
        validation_tight: true
      },
      recommendations: this.getRecommendations(agents, results)
    };

    this.logLearning(analysis);
    return analysis;
  }

  /**
   * Clasificar tipo de tarea
   */
  classifyTask(task) {
    const lower = task.toLowerCase();
    if (lower.includes('implement') || lower.includes('feature')) return 'feature';
    if (lower.includes('fix') || lower.includes('bug')) return 'bugfix';
    if (lower.includes('refactor')) return 'refactor';
    return 'general';
  }

  /**
   * Obtener recomendaciones para futuras tareas similares
   */
  getRecommendations(agents, results) {
    return {
      agent_order: this.rankAgents(agents),
      estimated_tokens: Math.round(results.totalTokens * 0.8),
      execution_pattern: 'parallel',
      expected_success_rate: 0.95
    };
  }

  /**
   * Rankear agentes por peso
   */
  rankAgents(agents) {
    return agents.sort((a, b) => 
      (this.agentWeights[b] || 0) - (this.agentWeights[a] || 0)
    );
  }

  /**
   * Registrar aprendizaje
   */
  logLearning(analysis) {
    this.learningLog.push(analysis);

    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const file = path.join(dir, 'learning-log.json');
      fs.writeFileSync(file, JSON.stringify(this.learningLog, null, 2));
    } catch (e) {
      console.warn('⚠️  Could not save learning log');
    }
  }

  /**
   * Refinar patrón basado en múltiples usos
   */
  refinePattern(patternId, patterns, success) {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;

    // Actualizar métrica de éxito
    const currentRate = pattern.success_rate || 0.8;
    const newRate = success 
      ? Math.min(1.0, currentRate + 0.05)
      : Math.max(0.5, currentRate - 0.1);

    pattern.success_rate = parseFloat(newRate.toFixed(2));
    pattern.last_used = new Date().toISOString();
    pattern.reuse_count = (pattern.reuse_count || 0) + 1;

    console.log(`\n📈 Pattern refined: ${patternId}`);
    console.log(`   Success rate: ${(currentRate * 100).toFixed(1)}% → ${(newRate * 100).toFixed(1)}%`);
    console.log(`   Reuse count: ${pattern.reuse_count}`);

    return pattern;
  }

  /**
   * Obtener estadísticas de aprendizaje
   */
  getStats() {
    return {
      total_learning_events: this.learningLog.length,
      agent_weights: this.agentWeights,
      most_reliable_agent: this.getMostReliableAgent(),
      learning_trend: this.calculateTrend()
    };
  }

  /**
   * Encontrar agente más confiable
   */
  getMostReliableAgent() {
    return Object.entries(this.agentWeights).reduce((best, [agent, weight]) =>
      weight > best.weight ? { agent, weight } : best,
      { agent: 'code', weight: 0 }
    );
  }

  /**
   * Calcular tendencia de aprendizaje
   */
  calculateTrend() {
    if (this.learningLog.length < 2) return 'insufficient data';
    
    const recent = this.learningLog.slice(-5);
    const avgTokens = recent.reduce((sum, log) => sum + (log.tokens || 0), 0) / recent.length;
    
    return avgTokens < 1200 ? 'improving' : 'stable';
  }
}

module.exports = LearningLoopV2;
