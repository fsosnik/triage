const TriageOS = require('../src/index.js');

(async () => {
  const os = new TriageOS();
  
  console.log('🚀 TRIAGE OS Example\n');
  
  const result = await os.process({
    task: "Add input validation to /src/api/users.js",
    context: "Express.js REST API, uses Joi for validation",
    constraints: [
      "Validate email, password, username",
      "Return 400 for invalid input",
      "Tests required"
    ]
  });
  
  console.log('\n✅ Result:');
  console.log(JSON.stringify(result, null, 2));
})().catch(console.error);
