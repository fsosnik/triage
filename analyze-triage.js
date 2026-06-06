const fs = require('fs');
const GraphifyAdapter = require('./src/optimization/graphify-adapter');
const RufloOptimizer = require('./src/optimization/ruflo-optimizer');

const target = process.argv[2] || 'src/core/os.js';

if (!fs.existsSync(target)) {
  console.error(`❌ File not found: ${target}`);
  process.exit(1);
}

const code = fs.readFileSync(target, 'utf8');

console.log(`\n📊 ANALYZING: ${target}\n`);

// GRAPHIFY
const graphify = new GraphifyAdapter();
const graphifyAnalysis = graphify.analyze(code);
graphify.report(graphifyAnalysis);

// RUFLO
const ruflo = new RufloOptimizer();
const rufloMetrics = ruflo.measure(code);
ruflo.report(rufloMetrics);

// SUMMARY
console.log('='.repeat(60));
console.log('INTEGRITY CHECK');
console.log('='.repeat(60));
console.log(`✅ Real execution: ${graphifyAnalysis.is_real_execution ? 'YES' : 'NO'}`);
console.log(`📈 Trust level: ${graphifyAnalysis.trust_level}%`);
console.log(`⚡ Efficiency: ${rufloMetrics.efficiency_score}%`);
console.log('='.repeat(60) + '\n');

if (!graphifyAnalysis.is_real_execution) {
  console.log('🔴 CRITICAL: This code contains mocks and synthetic returns.');
  console.log('   Use real execution, not hardcoded values.\n');
}
