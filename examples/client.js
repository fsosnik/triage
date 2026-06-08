const http = require('http');

async function executeTriageCycle(task, agents, prediction) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ task, agents, prediction });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/cycle',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Example usage
(async () => {
  try {
    const result = await executeTriageCycle(
      'oauth2-implementation',
      ['code', 'qa', 'risk'],
      { success: true, tests_passed: 245 }
    );

    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
