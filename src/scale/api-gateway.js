/**
 * Phase 4: API Gateway
 * Routes requests to TRIAGE OS instances
 */

class APIGateway {
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.instances = new Map();
    this.requestLog = [];
  }

  registerInstance(id, triageOS) {
    this.instances.set(id, triageOS);
    return { status: 'registered', instance: id };
  }

  routeRequest(req) {
    const { tenant_id, task, context, constraints } = req;
    
    if (!this.instances.has(tenant_id)) {
      return { error: 'Instance not found', status: 404 };
    }

    const instance = this.instances.get(tenant_id);
    this.logRequest(tenant_id, task);

    return {
      status: 'routed',
      instance: tenant_id,
      input: { task, context, constraints }
    };
  }

  logRequest(tenantId, task) {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      tenant: tenantId,
      task: task.substring(0, 50),
      status: 'received'
    });
  }

  getHealth() {
    return {
      instances: this.instances.size,
      requests: this.requestLog.length,
      last_request: this.requestLog[this.requestLog.length - 1] || null
    };
  }

  getInstanceMetrics(tenantId) {
    const instance = this.instances.get(tenantId);
    if (!instance) return null;
    return instance.getMetrics();
  }
}

module.exports = APIGateway;
