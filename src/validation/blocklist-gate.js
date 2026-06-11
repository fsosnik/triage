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
      const patternValue = pattern.pattern;

      // Handle RegExp objects
      if (patternValue instanceof RegExp) {
        return patternValue.test(input);
      }

      // Handle string patterns that look like regex
      if (typeof patternValue === 'string') {
        if (patternValue.includes('/') || patternValue.includes('[') || patternValue.includes('(')) {
          const regex = new RegExp(patternValue);
          return regex.test(input);
        }
        // Simple string matching for non-regex patterns
        return input.includes(patternValue);
      }

      return false;
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
