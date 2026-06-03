/**
 * Phase 4: Multi-Tenant Support
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class MultiTenant {
  constructor() {
    this.tenants = new Map();
    this.loadTenants();
  }

  createTenant(config) {
    const tenantId = crypto.randomBytes(8).toString('hex');
    const tenant = {
      id: tenantId,
      name: config.name,
      created_at: new Date().toISOString(),
      settings: config.settings || {},
      patterns: [],
      blocklist: [],
      metrics: { cycles: 0, tokens: 0 }
    };

    this.tenants.set(tenantId, tenant);
    this.saveTenants();
    return tenant;
  }

  getTenant(tenantId) {
    return this.tenants.get(tenantId);
  }

  updateTenant(tenantId, updates) {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error('Tenant not found');
    Object.assign(tenant, updates);
    this.saveTenants();
    return tenant;
  }

  getTenantPatterns(tenantId) {
    const tenant = this.tenants.get(tenantId);
    return tenant?.patterns || [];
  }

  addPatternToTenant(tenantId, pattern) {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error('Tenant not found');
    tenant.patterns.push(pattern);
    this.saveTenants();
  }

  saveTenants() {
    try {
      const dir = path.join(process.cwd(), '.claude/tenants');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const data = Object.fromEntries(this.tenants);
      fs.writeFileSync(
        path.join(dir, 'tenants.json'),
        JSON.stringify(data, null, 2)
      );
    } catch (e) {
      console.warn('Could not save tenants');
    }
  }

  loadTenants() {
    try {
      const file = path.join(process.cwd(), '.claude/tenants/tenants.json');
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.tenants = new Map(Object.entries(data));
      }
    } catch (e) {
      this.tenants = new Map();
    }
  }

  listTenants() {
    return Array.from(this.tenants.values()).map(t => ({
      id: t.id,
      name: t.name,
      patterns: t.patterns.length,
      cycles: t.metrics.cycles
    }));
  }
}

module.exports = MultiTenant;
