/**
 * TRIAGE OS - Main Entry Point
 * Initialize and run the orchestrator
 */

require('dotenv').config();

const TRIAGEOS = require('./core/os');

async function main() {
  // Initialize TRIAGE OS
  const triage = new TRIAGEOS({
    mode: 'agentic',
    parallelism: true,
    validation_required: true,
    learning_enabled: true
  });

  // Example task
  const input = {
    task: 'Implement authentication system with OAuth2',
    context: 'Using Supabase, Next.js 14',
    constraints: [
      'No breaking changes',
      'Write tests',
      'Document endpoints'
    ]
  };

  // Run orchestration
  const result = await triage.orchestrate(input);

  // Print results
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TRIAGE OS - Results');
  console.log('═'.repeat(60));
  console.log(JSON.stringify(result, null, 2));

  // Print metrics
  console.log('\n📈 System Metrics:');
  const metrics = triage.getMetrics();
  Object.entries(metrics).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  console.log('\n✅ TRIAGE OS cycle complete!\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, TRIAGEOS };
