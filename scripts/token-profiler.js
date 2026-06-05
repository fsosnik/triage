const TRIAGEOS = require('../src/core/os');

async function profileTokens() {
  const triage = new TRIAGEOS();
  const tasks = [
    { task: 'Implement feature', type: 'feature' },
    { task: 'Fix bug', type: 'bugfix' },
    { task: 'Refactor code', type: 'refactor' }
  ];
  
  console.log('Token Profiling Results:\n');
  
  for (const task of tasks) {
    const result = await triage.orchestrate(task);
    console.log(`${task.task}: ${result.metrics.total_tokens} tokens`);
  }
  
  const metrics = triage.getMetrics();
  console.log(`\nAvg: ${metrics.avg_tokens} tokens`);
}

profileTokens().catch(console.error);
