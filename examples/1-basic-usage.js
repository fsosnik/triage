// example 1: basic orchestration
const TRIAGEOS = require('triage');
const os = new TRIAGEOS();

async function main() {
  const result = await os.orchestrate({
    task: 'Add password reset feature',
    context: 'Next.js 14 + TypeScript',
    constraints: ['secure', 'email verification', 'tests required']
  });
  
  console.log(`Status: ${result.status}`);
  console.log(`Tokens: ${result.metrics.total_tokens}`);
  console.log(`Agents: ${result.metrics.agents_used.join(', ')}`);
}

main();
