const fs = require('fs');
const path = require('path');

class HistoryManager {
  static load() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/performance-history.json');
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      console.warn('⚠️  Using empty history');
    }
    return [];
  }

  static save(history) {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, 'performance-history.json');
      fs.writeFileSync(file, JSON.stringify(history.slice(-100), null, 2));
    } catch (e) {
      console.warn('⚠️  Save failed');
    }
  }

  static addRecord(history, agent, taskType, success, executionTime) {
    history.push({
      timestamp: new Date().toISOString(),
      agent,
      task_type: taskType,
      success,
      execution_time: executionTime,
      tokens_used: 0
    });
    return history;
  }
}
module.exports = HistoryManager;
