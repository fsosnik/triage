const ValidationGate = require('../validation/validation-gate');
const FeedbackEngine = require('./feedback-engine');
const AutoCheckpoint = require('./auto-checkpoint');

class TriageOSCore {
  constructor() {
    this.gate = new ValidationGate();
    this.feedback = new FeedbackEngine();
  }

  async executeCycle(taskType, agents, prediction) {
    console.log('\n' + '═'.repeat(60));
    console.log('🚀 TRIAGE OS CYCLE');
    console.log('═'.repeat(60));
    console.log(`\nTask: ${taskType}`);
    console.log(`Agents: ${agents.join(', ')}`);

    // 1. Validar
    const validation = this.gate.validate(prediction);

    // 2. Procesar feedback
    const feedback = await this.feedback.process(
      taskType,
      agents,
      prediction,
      validation.reality
    );

    // 3. Guardar checkpoint
    const checkpoint = AutoCheckpoint.save({
      task: taskType,
      status: validation.gate_passes ? 'VALIDATED' : 'FAILED',
      validations: validation.reality,
      patterns_stored: feedback ? 1 : 0
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`Cycle complete: ${validation.gate_passes ? '✅ VALID' : '❌ FAILED'}`);
    console.log('═'.repeat(60));

    return {
      validation,
      feedback,
      checkpoint
    };
  }
}

module.exports = TriageOSCore;
