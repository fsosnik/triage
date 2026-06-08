const http = require('http');
const https = require('https');

class ProductionValidator {
  static validate(url = 'http://localhost:3000') {
    return new Promise((resolve) => {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname || '/',
        method: 'HEAD',
        timeout: 5000
      };

      const req = protocol.request(options, (res) => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 500,
          status_code: res.statusCode,
          url: url,
          timestamp: new Date().toISOString()
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          status_code: 0,
          error: error.message,
          url: url,
          timestamp: new Date().toISOString()
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          status_code: 0,
          error: 'Timeout',
          url: url,
          timestamp: new Date().toISOString()
        });
      });

      req.end();
    });
  }
}

module.exports = ProductionValidator;
