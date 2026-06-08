const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class BuildValidator {
  static validate() {
    try {
      // Ejecutar build
      const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
      
      // Verificar que dist/ fue creado
      const distExists = fs.existsSync(path.join(process.cwd(), 'dist'));
      
      return {
        success: distExists,
        message: distExists ? 'Build successful' : 'Build failed: dist/ not created',
        has_dist: distExists,
        output: output.substring(0, 500),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `Build failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = BuildValidator;
