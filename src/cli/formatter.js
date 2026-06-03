/**
 * Phase 13: Output Formatting
 */

class Formatter {
  static table(data, headers) {
    if (!Array.isArray(data)) return JSON.stringify(data, null, 2);
    
    const rows = data.map(item => 
      headers.map(h => item[h]).join(' | ')
    );
    return headers.join(' | ') + '\n' + rows.join('\n');
  }

  static json(data) {
    return JSON.stringify(data, null, 2);
  }

  static pretty(data) {
    if (typeof data === 'object') {
      return Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    }
    return String(data);
  }

  static error(message) {
    return `ERROR: ${message}`;
  }

  static success(message) {
    return `SUCCESS: ${message}`;
  }
}

module.exports = Formatter;
