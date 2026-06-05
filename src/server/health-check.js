class HealthCheck {
  check(os) {
    if (!os) {
      return {
        status: 'UP',
        timestamp: new Date(),
        metrics: {
          cycles: 0,
          success_rate: 0,
          patterns: 0
        }
      };
    }
    
    return {
      status: 'UP',
      timestamp: new Date(),
      metrics: {
        cycles: os.metrics.total_cycles,
        success_rate: (os.metrics.successful / (os.metrics.total_cycles || 1) * 100).toFixed(1),
        patterns: os.patterns.length
      }
    };
  }
}

module.exports = HealthCheck;
