const DeploymentManager = require('../src/deployment/deployment-manager');
const HealthCheck = require('../src/deployment/health-check');

describe('Phase 16: Production Deployment', () => {
  
  test('DeploymentManager should preflight check', async () => {
    const dm = new DeploymentManager();
    const config = {
      env: 'prod',
      apiKey: 'test',
      dbUrl: 'postgres://...',
      backupPath: '/backups'
    };
    const result = await dm.preFlightCheck(config);
    expect(result.all_pass).toBe(true);
  });

  test('should deploy', async () => {
    const dm = new DeploymentManager();
    const config = {
      env: 'staging',
      apiKey: 'test',
      dbUrl: 'postgres://...',
      backupPath: '/backups'
    };
    const result = await dm.deploy('0.16.0', 'staging', config);
    expect(result.status).toBe('success');
  });

  test('should track deployments', async () => {
    const dm = new DeploymentManager();
    const config = {
      env: 'dev',
      apiKey: 'test',
      dbUrl: 'postgres://...',
      backupPath: '/backups'
    };
    await dm.deploy('0.16.0', 'dev', config);
    const status = dm.getStatus('dev');
    expect(status.successful).toBe(1);
  });

  test('should rollback', async () => {
    const dm = new DeploymentManager();
    const config = {
      env: 'dev',
      apiKey: 'test',
      dbUrl: 'postgres://...',
      backupPath: '/backups'
    };
    const deploy = await dm.deploy('0.16.0', 'dev', config);
    const rollback = await dm.rollback(deploy.id);
    expect(rollback.status).toBe('done');
  });

  test('HealthCheck should run checks', async () => {
    const hc = new HealthCheck();
    await hc.check('api', async () => 'ok');
    await hc.check('db', async () => 'ok');
    const report = await hc.runAll();
    expect(report.healthy).toBe(2);
  });

  test('should report failures', async () => {
    const hc = new HealthCheck();
    await hc.check('api', async () => 'ok');
    await hc.check('db', async () => { throw new Error('down'); });
    const report = await hc.runAll();
    expect(report.status).toBe('red');
  });
});
