class PerformanceProfiler {
  constructor() {
    this.cycles = [];
  }

  profile(cycle) {
    this.cycles.push(cycle);
  }

  analyze() {
    return {
      cycles: this.cycles.length,
      avg_duration: this.cycles.length > 0 ? this.cycles.reduce((a, c) => a + (c.duration || 0), 0) / this.cycles.length : 0
    };
  }
}

module.exports = PerformanceProfiler;
