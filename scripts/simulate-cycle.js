#!/usr/bin/env node

/**
 * TRIAGE OS - Simulate a Full Cycle
 */

require('dotenv').config();
const TRIAGEOS = require('../src/core/os');

async function simulateCycle() {
  console.log('\n🎯 TRIAGE OS - Simulating Cycle\n');

  const triage = new TRIAGEOS({
    learning_enabled: true,
    validation_required: true
  });

  const tasks = [
    {
      task: 'Implement user authentication',
      context: 'Next.js + Supabase',
      constraints: ['No breaking changes', 'Write tests']
    },
    {
      task: 'Fix critical bug in payment processing',
      context: 'Stripe integration',
      constraints: ['Urgent', 'No data loss']
    },
    {
      task: 'Refactor database queries',
      context: 'PostgreSQL optimization',
      constraints: ['Performance improvement', 'Keep same API']
    }
  ];

  for (let i = 0; i < tasks.length; i++) {
    console.log(`\n▶️  CYCLE ${i + 1} / ${tasks.length}`);
    console.log('─'.repeat(60));

    try {
      const result = await triage.orchestrate(tasks[i]);
      
      if (result.status === 'SUCCESS') {
        console.log('\n✨ Cycle succeeded!');
      } else {
        console.log('\n❌ Cycle failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Final Metrics');
  console.log('═'.repeat(60));
  const metrics = triage.getMetrics();
  console.log(JSON.stringify(metrics, null, 2));
  console.log('');
}

simulateCycle().catch(console.error);
