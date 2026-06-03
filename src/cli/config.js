/**
 * Phase 13: CLI Configuration
 */

const fs = require('fs');
const path = require('path');

class Config {
  constructor() {
    this.config = {
      output_format: 'pretty',
      verbose: false,
      colors: true,
      auto_save: true
    };
    this.configFile = path.join(process.cwd(), '.claude/cli-config.json');
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.configFile)) {
        const loaded = JSON.parse(fs.readFileSync(this.configFile, 'utf-8'));
        Object.assign(this.config, loaded);
      }
    } catch (e) {
      // Use defaults
    }
  }

  save() {
    try {
      const dir = path.dirname(this.configFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (e) {
      // Skip
    }
  }

  set(key, value) {
    this.config[key] = value;
    this.save();
  }

  get(key) {
    return this.config[key];
  }
}

module.exports = Config;
