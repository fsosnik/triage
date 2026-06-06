const GraphifyAdapter = require('../src/optimization/graphify-adapter');
const fs = require('fs');

const target = process.argv[2] || 'src/core/os.js';
const code = fs.readFileSync(target, 'utf8');

const graphify = new GraphifyAdapter();
const analysis = graphify.analyze(code);

console.log('\n=== GRAPHIFY ANALYSIS ===');
console.log(JSON.stringify(analysis, null, 2));
