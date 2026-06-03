/**
 * Phase 14: Performance Benchmarking
 */

class Benchmark {
  constructor(name) {
    this.name = name;
    this.results = [];
  }

  async run(fn, iterations = 100) {
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      await fn();
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000); // ms
    }

    return {
      name: this.name,
      iterations,
      times: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg: times.reduce((a, b) => a + b) / times.length,
        median: this.median(times)
      },
      total_ms: times.reduce((a, b) => a + b)
    };
  }

  median(arr) {
    const sorted = arr.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

module.exports = Benchmark;
