const MultiTenant = require('../src/scale/multi-tenant');
const LoadBalancer = require('../src/scale/load-balancer');
const APIGateway = require('../src/scale/api-gateway');

describe('Phase 4: Scale', () => {
  describe('MultiTenant', () => {
    let mt;
    beforeEach(() => {
      mt = new MultiTenant();
      mt.tenants.clear(); // LIMPIAR ENTRE TESTS
    });
    afterEach(() => {
      mt.tenants.clear();
    });
    test('should create tenant', () => {
      const tenant = mt.createTenant({ name: 'Test Org' });
      expect(tenant.id).toBeDefined();
      expect(tenant.name).toBe('Test Org');
    });
    test('should get tenant', () => {
      const created = mt.createTenant({ name: 'Tenant A' });
      const fetched = mt.getTenant(created.id);
      expect(fetched.name).toBe('Tenant A');
    });
    test('should add pattern to tenant', () => {
      const tenant = mt.createTenant({ name: 'Tenant B' });
      mt.addPatternToTenant(tenant.id, { id: 'p1', success_rate: 0.9 });
      const patterns = mt.getTenantPatterns(tenant.id);
      expect(patterns.length).toBe(1);
    });
    test('should list tenants', () => {
      mt.createTenant({ name: 'T1' });
      mt.createTenant({ name: 'T2' });
      const list = mt.listTenants();
      expect(list.length).toBe(2);
    });
  });
  describe('LoadBalancer', () => {
    let lb;
    beforeEach(() => {
      lb = new LoadBalancer();
      lb.workers.clear();
      lb.queue = [];
    });
    afterEach(() => {
      lb.workers.clear();
      lb.queue = [];
    });
    test('should register worker', () => {
      lb.registerWorker('w1', 10, 'agent');
      expect(lb.workers.has('w1')).toBe(true);
    });
    test('should select least loaded worker', () => {
      lb.registerWorker('w1', 10);
      lb.registerWorker('w2', 10);
      lb.workers.get('w1').current_load = 8;
      const selected = lb.selectWorker('feature');
      expect(selected.id).toBe('w2');
    });
    test('should assign task', () => {
      lb.registerWorker('w1', 5);
      const result = lb.assignTask({ task: 'test' }, 'feature');
      expect(result.status).toBe('assigned');
    });
    test('should queue when full', () => {
      lb.registerWorker('w1', 1);
      lb.assignTask({ task: 't1' }, 'feature');
      const result = lb.assignTask({ task: 't2' }, 'feature');
      expect(result.status).toBe('queued');
      expect(lb.queue.length).toBe(1);
    });
    test('should get metrics', () => {
      lb.registerWorker('w1', 10);
      lb.registerWorker('w2', 10);
      const metrics = lb.getMetrics();
      expect(metrics.workers_count).toBe(2);
      expect(metrics.total_capacity).toBe(20);
    });
  });
  describe('APIGateway', () => {
    let gw;
    beforeEach(() => {
      gw = new APIGateway();
      gw.instances.clear();
    });
    afterEach(() => {
      gw.instances.clear();
    });
    test('should register instance', () => {
      gw.registerInstance('api1', 'http://localhost:3001');
      expect(gw.instances.has('api1')).toBe(true);
    });
    test('should route request', () => {
      gw.registerInstance('api1', 'http://localhost:3001');
      const result = gw.routeRequest('/users', 'api1');
      expect(result).toBe('http://localhost:3001/users');
    });
    test('should return 404 for unknown instance', () => {
      expect(() => gw.routeRequest('/users', 'unknown')).toThrow();
    });
  });
});
