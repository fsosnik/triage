class HealthCheck {
  check(os) {
    return {
      status: 'UP',
      timestamp: new Date(),
      metrics: {
        cycles: os.metrics.total_cycles,
        success_rate: (os.metrics.successful / os.metrics.total_cycles * 100).toFixed(1),
        patterns: os.patterns.length
      }
    };
  }
}

module.exports = HealthCheck;
