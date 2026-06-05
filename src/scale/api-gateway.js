class APIGateway {
  constructor() {
    this.instances = new Map();
  }

  registerInstance(id, url) {
    this.instances.set(id, { id, url, healthy: true });
  }

  routeRequest(path, instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');
    return `${instance.url}${path}`;
  }

  getHealthStatus(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return null;
    return instance.healthy;
  }

  markUnhealthy(instanceId) {
    const instance = this.instances.get(instanceId);
    if (instance) instance.healthy = false;
  }
}

module.exports = APIGateway;
