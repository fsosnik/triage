/**
 * Phase 11: Learning Archive
 * Historical learning & evolution tracking
 */

class LearningArchive {
  constructor() {
    this.epochs = [];
    this.evolution = [];
  }

  createEpoch(epoch_num, description) {
    const epoch = {
      number: epoch_num,
      description,
      created_at: new Date().toISOString(),
      cycles: 0,
      success_rate: 0,
      avg_tokens: 0,
      patterns_learned: 0,
      insights_captured: 0
    };
    this.epochs.push(epoch);
    return epoch;
  }

  recordEvolution(metric, old_value, new_value, reason) {
    this.evolution.push({
      timestamp: new Date().toISOString(),
      metric,
      old_value,
      new_value,
      improvement: ((new_value - old_value) / old_value * 100).toFixed(1) + '%',
      reason
    });
  }

  getEpoch(epoch_num) {
    return this.epochs.find(e => e.number === epoch_num);
  }

  updateEpochStats(epoch_num, stats) {
    const epoch = this.getEpoch(epoch_num);
    if (epoch) {
      Object.assign(epoch, stats);
    }
  }

  getEvolutionTimeline() {
    return this.evolution.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  getMilestones() {
    return this.evolution
      .filter(e => Math.abs(parseFloat(e.improvement)) > 10)
      .slice(-5);
  }

  getReport() {
    if (this.epochs.length === 0) return 'No epochs recorded';

    const latest = this.epochs[this.epochs.length - 1];
    const earliest = this.epochs[0];

    return {
      total_epochs: this.epochs.length,
      current_epoch: latest.number,
      cycles_total: this.epochs.reduce((sum, e) => sum + e.cycles, 0),
      patterns_learned_total: this.epochs.reduce((sum, e) => sum + e.patterns_learned, 0),
      avg_success_improvement: this.getMilestones().length > 0 ? 'Improving' : 'Stable'
    };
  }
}

module.exports = LearningArchive;
