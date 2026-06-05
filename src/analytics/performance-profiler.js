class PerformanceProfiler {
  constructor() {
    this.profiles = [];
  }

  profile(cycle) {
    this.profiles.push(cycle);
  }

  analyze() {
    return {
      cycles: this.profiles.length,
      avg_duration: this.profiles.length > 0 ? this.profiles.reduce((a, c) => a + (c.duration || 0), 0) / this.profiles.length : 0
    };
  }
}
module.exports = PerformanceProfiler;
