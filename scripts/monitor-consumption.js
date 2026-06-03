#!/usr/bin/env node

/**
 * TRIAGE OS - Token Consumption Monitor
 */

const fs = require('fs');
const path = require('path');

function monitorConsumption() {
  console.log('\n📊 TRIAGE OS - Token Consumption Monitor\n');

  const checkpointDir = path.join(process.cwd(), '.claude/checkpoints');
  let totalTokens = 0;
  let cycleCount = 0;

  if (fs.existsSync(checkpointDir)) {
    const files = fs.readdirSync(checkpointDir).filter(f => f.startsWith('checkpoint'));
    cycleCount = files.length;

    files.forEach(file => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(checkpointDir, file), 'utf-8'));
        totalTokens += data.tokens_used || 0;
      } catch (e) {
        // Skip invalid files
      }
    });
  }

  const avgTokens = cycleCount > 0 ? Math.round(totalTokens / cycleCount) : 0;
  const estMonthlyCost = (totalTokens / 1000000) * 15; // Approximate cost

  console.log('Current Metrics:');
  console.log(`  Cycles completed: ${cycleCount}`);
  console.log(`  Total tokens: ${totalTokens.toLocaleString()}`);
  console.log(`  Avg tokens/cycle: ${avgTokens}`);
  console.log(`  Est. monthly cost: $${estMonthlyCost.toFixed(2)}`);
  
  console.log('\nTarget (Phase 1):');
  console.log(`  Tokens/cycle: < 3,500`);
  console.log(`  Monthly: < 35,000 tokens`);
  console.log(`  Cost: < $0.50/month`);

  const status = avgTokens < 3500 ? '✅ ON TRACK' : '⚠️  REVIEW';
  console.log(`\nStatus: ${status}\n`);
}

monitorConsumption();
