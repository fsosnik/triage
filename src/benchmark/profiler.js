/**
 * Phase 14: Profiler
 */

class Profiler {
  constructor() {
    this.marks = new Map();
    this.measures = [];
  }

  start(label) {
    this.marks.set(label, process.hrtime.bigint());
  }

  end(label) {
    const start = this.marks.get(label);
    if (!start) return null;

    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // ms
    
    this.measures.push({ label, duration });
    this.marks.delete(label);
    return duration;
  }

  getReport() {
    if (this.measures.length === 0) return { measures: [] };

    const byLabel = {};
    this.measures.forEach(m => {
      if (!byLabel[m.label]) byLabel[m.label] = [];
      byLabel[m.label].push(m.duration);
    });

    const summary = Object.entries(byLabel).map(([label, times]) => ({
      label,
      count: times.length,
      avg: (times.reduce((a, b) => a + b) / times.length).toFixed(2),
      total: times.reduce((a, b) => a + b).toFixed(2)
    }));

    return {
      total_measures: this.measures.length,
      summary,
      measures: this.measures
    };
  }

  clear() {
    this.marks.clear();
    this.measures = [];
  }
}

module.exports = Profiler;
