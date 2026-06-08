const fs = require('fs');
const path = require('path');
const HistoryManager = require('./history-manager');
const WeightCalculator = require('./weight-calculator');
const AgentAnalyzer = require('./agent-analyzer');

class WeightUpdater {
  constructor() {
    this.baseWeights = { code: 0.80, qa: 0.60, research: 0.50, risk: 0.70 };
    this.performanceHistory = HistoryManager.load();
    this.loadWeights();
  }

  loadWeights() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/weights.json');
      if (fs.existsSync(file)) {
        this.baseWeights = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      console.warn('⚠️  Using default weights');
    }
  }

  saveWeights() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'weights.json'), JSON.stringify(this.baseWeights, null, 2));
      HistoryManager.save(this.performanceHistory);
    } catch (e) {
      console.warn('⚠️  Save failed');
    }
  }

  getWeight(agent, taskType) {
    const base = this.baseWeights[agent] || 0.5;
    const adjustment = WeightCalculator.getTaskSpecificAdjustment(this.performanceHistory, agent, taskType);
    return WeightCalculator.getWeight(base, adjustment);
  }

  updateWeight(agent, taskType, success, executionTime) {
    this.performanceHistory = HistoryManager.addRecord(this.performanceHistory, agent, taskType, success, executionTime);
    const currentWeight = this.baseWeights[agent] || 0.5;
    const delta = WeightCalculator.calculateDelta(success, executionTime);
    const newWeight = WeightCalculator.applyDelta(currentWeight, delta);
    this.baseWeights[agent] = parseFloat(newWeight.toFixed(3));
    this.saveWeights();
    return { agent, old_weight: currentWeight, new_weight: newWeight, delta };
  }

  getSuccessRate(agent, taskType) {
    return AgentAnalyzer.getSuccessRate(this.performanceHistory, agent, taskType);
  }

  predictBestAgents(taskType, count = 3) {
    return AgentAnalyzer.predictBestAgents(this.baseWeights, this.performanceHistory, taskType, count);
  }

  getNormalizedWeights() {
    return WeightCalculator.normalize(this.baseWeights);
  }

  getReliabilityReport() {
    return AgentAnalyzer.getReliabilityReport(this.baseWeights, this.performanceHistory);
  }

  getDecliningSeries() {
    return AgentAnalyzer.getDecliningSeries(this.baseWeights, this.performanceHistory);
  }

  reset() {
    this.baseWeights = { code: 0.80, qa: 0.60, research: 0.50, risk: 0.70 };
    this.saveWeights();
    console.log('✓ Weights reset to defaults');
  }
}

module.exports = WeightUpdater;
