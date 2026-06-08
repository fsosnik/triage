const fs = require('fs');
const path = require('path');

class PatternStorage {
  static save(pattern) {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      let patterns = [];
      if (fs.existsSync(file)) {
        patterns = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }

      const existing = patterns.find(p => p.name === pattern.name);
      if (existing) {
        existing.reuse_count++;
        existing.last_used = new Date().toISOString();
      } else {
        patterns.push(pattern);
      }

      fs.writeFileSync(file, JSON.stringify(patterns, null, 2));
      return pattern.id;
    } catch (e) {
      console.warn('⚠️  Pattern save failed:', e.message);
      return null;
    }
  }

  static load() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/successes.json');
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      console.warn('⚠️  Pattern load failed');
    }
    return [];
  }

  static findSimilar(taskType) {
    const patterns = this.load();
    return patterns.filter(p => 
      p.category === taskType.toLowerCase() || 
      p.task_type.includes(taskType)
    );
  }
}
module.exports = PatternStorage;
