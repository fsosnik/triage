const LearningLoop = require('../learning/learning-loop');
const RollbackLoop = require('../learning/rollback-loop');
const ComparisonEngine = require('../validation/comparison-engine');

class FeedbackEngine {
  constructor() {
    this.learning = new LearningLoop();
    this.rollback = new RollbackLoop();
  }

  async process(taskType, agents, prediction, reality) {
    const comparison = ComparisonEngine.compare(prediction, reality);

    if (comparison.verdict === 'VALID' && reality.success) {
      console.log('\n✅ SUCCESS PATH: Learning from success');
      return await this.learning.processResult(taskType, agents, reality);
    } else {
      console.log('\n❌ FAILURE PATH: Handling error');
      return await this.rollback.handleFailure(taskType, agents, {
        reason: 'Validation failed or prediction mismatch',
        canRevert: true
      });
    }
  }
}

module.exports = FeedbackEngine;
