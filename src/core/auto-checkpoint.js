const fs = require('fs');
const path = require('path');

class AutoCheckpoint {
  static save(data) {
    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const checkpoint = {
        timestamp: new Date().toISOString(),
        type: data.type || 'cycle',
        task: data.task,
        status: data.status,
        validations: data.validations || {},
        patterns_stored: data.patterns_stored || 0,
        git_hash: data.git_hash || 'N/A'
      };

      const filename = `checkpoint-${timestamp}.json`;
      fs.writeFileSync(
        path.join(dir, filename),
        JSON.stringify(checkpoint, null, 2)
      );

      console.log(`\n📌 Checkpoint: ${filename}`);
      return filename;
    } catch (e) {
      console.warn('⚠️  Checkpoint save failed');
      return null;
    }
  }

  static load(filename) {
    try {
      const file = path.join(process.cwd(), `.claude/checkpoints/${filename}`);
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      console.warn('⚠️  Checkpoint load failed');
    }
    return null;
  }

  static list() {
    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (fs.existsSync(dir)) {
        return fs.readdirSync(dir).sort().reverse();
      }
    } catch (e) {
      // Skip
    }
    return [];
  }
}

module.exports = AutoCheckpoint;
