const fs = require('fs');
const path = require('path');

class BlocklistManager {
  static update(failureRecord) {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      let blocklist = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : [];
      const existing = blocklist.find(b => b.id === failureRecord.task);

      if (existing) {
        existing.incidents = (existing.incidents || 0) + 1;
        if (existing.incidents >= 3) {
          existing.severity = 'CRÍTICO';
          existing.auto_reject = true;
        }
      } else {
        blocklist.push({
          id: `learned-${Date.now()}`,
          pattern: failureRecord.task.substring(0, 50),
          severity: failureRecord.severity >= 4 ? 'CRÍTICO' : 'WARNING',
          reason: `Learned from failure: ${failureRecord.failure_type}`,
          incidents: 1,
          auto_reject: failureRecord.severity >= 4,
          created_at: new Date().toISOString()
        });
      }
      fs.writeFileSync(file, JSON.stringify(blocklist, null, 2));
    } catch (e) {
      console.warn('⚠️ Blocklist update failed:', e.message);
    }
  }

  static getSize() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')).length : 0;
    } catch {
      return 0;
    }
  }
}
module.exports = BlocklistManager;
