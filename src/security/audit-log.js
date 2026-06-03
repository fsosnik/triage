/**
 * Phase 10: Audit Logging
 */

const fs = require('fs');
const path = require('path');

class AuditLog {
  constructor() {
    this.logs = [];
  }

  log(event_type, user_id, action, resource, result) {
    const entry = {
      timestamp: new Date().toISOString(),
      event_type,
      user_id,
      action,
      resource,
      result,
      ip: '0.0.0.0'
    };
    
    this.logs.push(entry);
    this.persist();
    return entry;
  }

  logSuccess(user_id, action, resource) {
    return this.log('success', user_id, action, resource, true);
  }

  logFailure(user_id, action, resource, reason) {
    return this.log('failure', user_id, action, resource, { failed: true, reason });
  }

  getLog(user_id, limit = 100) {
    return this.logs
      .filter(l => l.user_id === user_id)
      .slice(-limit);
  }

  persist() {
    try {
      const dir = path.join(process.cwd(), '.claude/security');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      fs.writeFileSync(
        path.join(dir, 'audit-log.json'),
        JSON.stringify(this.logs.slice(-10000), null, 2)
      );
    } catch (e) {
      // Skip
    }
  }
}

module.exports = AuditLog;
