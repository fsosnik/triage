describe('Phase 6: Deployment', () => {
  
  test('should load deployment config', () => {
    const config = require('../config/deployment.json');
    expect(config.environments).toHaveProperty('production');
    expect(config.environments.production.phase2).toBe(true);
  });

  test('should have health check config', () => {
    const config = require('../config/deployment.json');
    expect(config.healthcheck.enabled).toBe(true);
  });

  test('should have backup config', () => {
    const config = require('../config/deployment.json');
    expect(config.backup.enabled).toBe(true);
    expect(config.backup.frequency).toBe('daily');
  });

  test('should have all environments configured', () => {
    const config = require('../config/deployment.json');
    const envs = Object.keys(config.environments);
    expect(envs).toContain('development');
    expect(envs).toContain('staging');
    expect(envs).toContain('production');
  });

  test('production should have monitoring enabled', () => {
    const config = require('../config/deployment.json');
    expect(config.environments.production.monitoring).toBe(true);
  });

  test('should have docker files', () => {
    const fs = require('fs');
    expect(fs.existsSync('./Dockerfile')).toBe(true);
    expect(fs.existsSync('./docker-compose.yml')).toBe(true);
  });

  test('should have deployment script', () => {
    const fs = require('fs');
    expect(fs.existsSync('./scripts/deploy.sh')).toBe(true);
  });

  test('should have CI/CD workflow', () => {
    const fs = require('fs');
    expect(fs.existsSync('./.github/workflows/deploy.yml')).toBe(true);
  });
});
