const fs = require('fs');
const path = require('path');

class BlocklistGate {
  constructor(blocklistPath) {
    this.blocklistPath = blocklistPath ||
      path.join(__dirname, '../../.claude/patterns/blocklist.json');
    this.patterns = this.loadPatterns();
  }

  loadPatterns() {
    try {
      const content = fs.readFileSync(this.blocklistPath, 'utf-8');
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn(`[BlocklistGate] Failed to load patterns: ${err.message}`);
      return [];
    }
  }

  validate(input) {
    for (const pattern of this.patterns) {
      if (this.matches(input, pattern)) {
        return {
          blocked: true,
          pattern: {
            id: pattern.id,
            severity: pattern.severity,
            reason: pattern.reason,
            alternative: pattern.alternative
          }
        };
      }
    }
    return { blocked: false, pattern: null };
  }

  matches(input, pattern) {
    try {
      if (pattern.pattern.includes('/') || pattern.pattern.includes('[')) {
        const regex = new RegExp(pattern.pattern);
        return regex.test(input);
      }
      return input.includes(pattern.pattern);
    } catch (err) {
      console.warn(`[BlocklistGate] Invalid pattern ${pattern.id}: ${err.message}`);
      return false;
    }
  }

  preExecutionCheck(command, context = {}) {
    const result = this.validate(command);

    if (result.blocked) {
      return {
        allowed: false,
        reason: `BLOCKED: ${result.pattern.reason}`,
        alternative: result.pattern.alternative,
        severity: result.pattern.severity
      };
    }

    return { allowed: true, reason: null };
  }
}

module.exports = BlocklistGate;
