/**
 * TRIAGE OS - Weight Updater
 * Layer 5b: Dynamic Agent Weighting System
 * 
 * Mantiene actualizado un sistema de pesos que:
 * - Refleja la confiabilidad de cada agente
 * - Se ajusta por tipo de tarea
 * - Aprende de cada ciclo
 * - Predice agentes óptimos para futuras tareas
 */

const fs = require('fs');
const path = require('path');

class WeightUpdater {
  constructor() {
    this.baseWeights = {
      code: 0.80,
      qa: 0.60,
      research: 0.50,
      risk: 0.70
    };

    this.taskSpecificWeights = {};
    this.performanceHistory = [];
    
    this.load();
  }

  /**
   * Cargar pesos guardados
   */
  load() {
    try {
      const weightsFile = path.join(process.cwd(), '.claude/learning/weights.json');
      if (fs.existsSync(weightsFile)) {
        this.baseWeights = JSON.parse(fs.readFileSync(weightsFile, 'utf-8'));
      }

      const historyFile = path.join(process.cwd(), '.claude/learning/performance-history.json');
      if (fs.existsSync(historyFile)) {
        this.performanceHistory = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
      }
    } catch (e) {
      console.warn('⚠️  Using default weights');
    }
  }

  /**
   * Guardar pesos
   */
  save() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const weightsFile = path.join(dir, 'weights.json');
      fs.writeFileSync(weightsFile, JSON.stringify(this.baseWeights, null, 2));

      const historyFile = path.join(dir, 'performance-history.json');
      fs.writeFileSync(historyFile, JSON.stringify(this.performanceHistory.slice(-100), null, 2));

    } catch (e) {
      console.warn('⚠️  Could not save weights');
    }
  }

  /**
   * Obtener peso recomendado para un agente en una tarea
   */
  getWeight(agent, taskType) {
    const baseWeight = this.baseWeights[agent] || 0.5;
    const taskSpecific = this.getTaskSpecificAdjustment(agent, taskType);
    const combined = baseWeight + taskSpecific;
    
    return Math.max(0.1, Math.min(1.0, combined));
  }

  /**
   * Ajuste específico de tarea
   */
  getTaskSpecificAdjustment(agent, taskType) {
    const history = this.performanceHistory.filter(
      h => h.agent === agent && h.task_type === taskType
    );

    if (history.length === 0) return 0;

    const successRate = history.filter(h => h.success).length / history.length;
    return (successRate - 0.5) * 0.2; // Rango: -0.1 a +0.1
  }

  /**
   * Actualizar peso después de un ciclo
   */
  updateWeight(agent, taskType, success, executionTime) {
    const record = {
      timestamp: new Date().toISOString(),
      agent: agent,
      task_type: taskType,
      success: success,
      execution_time: executionTime,
      tokens_used: 0
    };

    this.performanceHistory.push(record);

    // Calcular nuevo peso
    const currentWeight = this.baseWeights[agent] || 0.5;
    let delta = 0;

    if (success) {
      // Bonus por éxito
      delta = 0.08;
      
      // Bonus adicional por eficiencia
      if (executionTime < 0.15) delta += 0.05;
    } else {
      // Penalización por fallo
      delta = -0.15;
    }

    const newWeight = Math.max(0.1, Math.min(1.0, currentWeight + delta));
    this.baseWeights[agent] = parseFloat(newWeight.toFixed(3));

    this.save();

    return {
      agent: agent,
      old_weight: currentWeight,
      new_weight: newWeight,
      delta: delta
    };
  }

  /**
   * Predecir mejores agentes para un tipo de tarea
   */
  predictBestAgents(taskType, count = 3) {
    const agents = Object.keys(this.baseWeights);
    
    const ranked = agents.map(agent => ({
      agent: agent,
      weight: this.getWeight(agent, taskType),
      success_rate: this.getSuccessRate(agent, taskType)
    })).sort((a, b) => b.weight - a.weight);

    return ranked.slice(0, count);
  }

  /**
   * Obtener tasa de éxito para agente en tarea
   */
  getSuccessRate(agent, taskType) {
    const history = this.performanceHistory.filter(
      h => h.agent === agent && h.task_type === taskType
    );

    if (history.length === 0) return 0.5; // Default

    const successes = history.filter(h => h.success).length;
    return (successes / history.length).toFixed(2);
  }

  /**
   * Normalizar pesos (sumar a 1.0)
   */
  getNormalizedWeights() {
    const sum = Object.values(this.baseWeights).reduce((a, b) => a + b, 0);
    const normalized = {};

    Object.entries(this.baseWeights).forEach(([agent, weight]) => {
      normalized[agent] = parseFloat((weight / sum).toFixed(3));
    });

    return normalized;
  }

  /**
   * Obtener reporte de confiabilidad
   */
  getReliabilityReport() {
    const report = {};

    Object.keys(this.baseWeights).forEach(agent => {
      const history = this.performanceHistory.filter(h => h.agent === agent);
      const successes = history.filter(h => h.success).length;

      report[agent] = {
        weight: this.baseWeights[agent],
        total_uses: history.length,
        successes: successes,
        success_rate: history.length > 0 ? (successes / history.length * 100).toFixed(1) + '%' : 'N/A',
        avg_execution_time: history.length > 0 
          ? (history.reduce((sum, h) => sum + h.execution_time, 0) / history.length).toFixed(3)
          : 'N/A'
      };
    });

    return report;
  }

  /**
   * Detectar agente en declive
   */
  getDecliningSeries() {
    const declining = [];

    Object.keys(this.baseWeights).forEach(agent => {
      const recentHistory = this.performanceHistory
        .filter(h => h.agent === agent)
        .slice(-10); // Últimos 10

      if (recentHistory.length >= 5) {
        const recent = recentHistory.filter(h => h.success).length;
        const successRate = recent / recentHistory.length;
        
        if (successRate < 0.5) {
          declining.push({
            agent: agent,
            recent_success_rate: (successRate * 100).toFixed(1) + '%',
            weight: this.baseWeights[agent]
          });
        }
      }
    });

    return declining;
  }

  /**
   * Reset weights to defaults
   */
  reset() {
    this.baseWeights = {
      code: 0.80,
      qa: 0.60,
      research: 0.50,
      risk: 0.70
    };
    this.save();
    console.log('✓ Weights reset to defaults');
  }
}

module.exports = WeightUpdater;
