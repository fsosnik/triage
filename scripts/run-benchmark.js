const TRIAGEOS = require('../src/core/os');
const BenchmarkRunner = require('../src/benchmark/benchmark-runner');

async function main() {
  const triage = new TRIAGEOS();
  const runner = new BenchmarkRunner();
  
  const inputs = [
    { task: 'Implement feature with tests', context: 'Next.js 14', type: 'feature' },
    { task: 'Fix critical bug', context: 'Node.js backend', type: 'bugfix' },
    { task: 'Refactor auth module', context: 'Express', type: 'refactor' }
  ];
  
  console.log('=== TRIAGE OS Benchmark Suite ===\n');
  
  for (const input of inputs) {
    console.log(`Testing: ${input.task}`);
    const results = await runner.runCycle(triage, input, 5);
    console.log(`  Duration: ${results.avgDuration}ms`);
    console.log(`  Tokens: ${results.avgTokens} (target: 4000)`);
    console.log(`  Success: ${results.successRate}%\n`);
  }
}

main().catch(console.error);
