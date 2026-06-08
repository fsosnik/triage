const MetricsCollector = require('./metrics-collector');
const PatternExtractor = require('./pattern-extractor');
const PatternStorage = require('./pattern-storage');

class LearningLoop {
  constructor() {
    this.collector = new MetricsCollector();
    this.storage = PatternStorage;
  }

  async processResult(taskType, agents, result) {
    console.log('\n' + '═'.repeat(60));
    console.log('📚 LEARNING LOOP - Capturing Pattern');
    console.log('═'.repeat(60) + '\n');

    if (!result.success) {
      console.log('⚠️  Task failed, skipping pattern capture');
      return null;
    }

    const metric = this.collector.collect(taskType, agents, result);
    console.log(`\n📊 Metrics collected:`);
    console.log(`   Duration: ${metric.duration_ms}ms`);
    console.log(`   Tokens: ${metric.tokens_used}`);
    console.log(`   Tests: ${metric.tests_passed}/${metric.tests_passed + metric.tests_failed}`);

    const pattern = PatternExtractor.extract(taskType, agents, result, metric);
    if (!pattern) {
      console.log('❌ Pattern extraction failed');
      return null;
    }

    const patternId = this.storage.save(pattern);
    if (!patternId) {
      console.log('❌ Pattern storage failed');
      return null;
    }

    console.log(`\n✅ Pattern captured: ${pattern.name}`);
    console.log(`   ID: ${patternId}`);
    console.log(`   Category: ${pattern.category}`);
    console.log(`   Agents: ${agents.join(', ')}`);
    console.log(`   Reusable: ${PatternExtractor.isReusable(pattern) ? 'YES' : 'NO'}`);

    return pattern;
  }

  getMetrics() {
    return {
      total_metrics: this.collector.metrics.length,
      avg_tokens: this.collector.getAverageTokens(),
      success_rate: this.collector.getSuccessRate(),
      patterns_stored: this.storage.load().length
    };
  }
}

module.exports = LearningLoop;
