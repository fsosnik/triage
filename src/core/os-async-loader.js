class AsyncPatternLoader {
  async loadPatternsAsync() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fs = require('fs');
        try {
          const data = JSON.parse(fs.readFileSync('.claude/knowledge/patterns.json', 'utf8'));
          resolve(data);
        } catch {
          resolve([]);
        }
      }, 100);
    });
  }
}

module.exports = AsyncPatternLoader;
