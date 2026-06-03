/**
 * Phase 14: Load Testing
 */

class LoadTest {
  constructor(concurrency = 10) {
    this.concurrency = concurrency;
    this.results = [];
    this.errors = [];
  }

  async run(fn, count = 100) {
    const startTime = Date.now();
    const batches = Math.ceil(count / this.concurrency);
    
    for (let i = 0; i < batches; i++) {
      const batchSize = Math.min(this.concurrency, count - i * this.concurrency);
      const promises = [];
      
      for (let j = 0; j < batchSize; j++) {
        promises.push(
          fn()
            .then(result => ({ success: true, result }))
            .catch(error => ({ success: false, error: error.message }))
        );
      }
      
      const batchResults = await Promise.all(promises);
      this.results.push(...batchResults);
    }

    const endTime = Date.now();
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    return {
      total: this.results.length,
      successful,
      failed,
      success_rate: (successful / this.results.length * 100).toFixed(1) + '%',
      duration_ms: endTime - startTime,
      ops_per_sec: (this.results.length / ((endTime - startTime) / 1000)).toFixed(0)
    };
  }
}

module.exports = LoadTest;
