const RufloOptimizer = require('../src/optimization/ruflo-optimizer');
const fs = require('fs');

const target = process.argv[2] || 'src/core/os.js';
const code = fs.readFileSync(target, 'utf8');

const ruflo = new RufloOptimizer();
const metrics = ruflo.measure(code);

console.log('\n=== RUFLO METRICS ===');
console.log(JSON.stringify(metrics, null, 2));
