// example 3: check learning
const TRIAGEOS = require('triage');
const os = new TRIAGEOS();

console.log('Agent weights:', os.learning.agentWeights);
console.log('Patterns learned:', os.patterns.length);
console.log('Blocklist:', os.blocklist.length);
console.log('Success rate:', os.getMetrics().success_rate);
