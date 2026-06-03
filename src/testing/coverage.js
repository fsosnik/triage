/**
 * Phase 15: Code Coverage Analysis
 */

class CoverageAnalyzer {
  constructor() {
    this.coverage = new Map();
  }

  track(file, lines) {
    if (!this.coverage.has(file)) {
      this.coverage.set(file, { total: 0, covered: 0, lines: [] });
    }
    
    const fileCov = this.coverage.get(file);
    fileCov.total = lines.length;
  }

  markCovered(file, lineNumbers) {
    if (!this.coverage.has(file)) {
      this.coverage.set(file, { total: 0, covered: 0, lines: [] });
    }

    const fileCov = this.coverage.get(file);
    fileCov.covered = lineNumbers.length;
    fileCov.lines = lineNumbers;
  }

  getReport() {
    const report = {
      total_files: this.coverage.size,
      overall_coverage: 0,
      files: []
    };

    let totalLines = 0;
    let coveredLines = 0;

    for (const [file, cov] of this.coverage.entries()) {
      const coverage = cov.total > 0 ? (cov.covered / cov.total * 100).toFixed(1) : 0;
      report.files.push({
        file,
        coverage: coverage + '%',
        covered: cov.covered,
        total: cov.total
      });

      totalLines += cov.total;
      coveredLines += cov.covered;
    }

    report.overall_coverage = totalLines > 0 
      ? (coveredLines / totalLines * 100).toFixed(1) + '%'
      : '0%';

    return report;
  }

  threshold(percentage) {
    const coverage = parseFloat(this.getReport().overall_coverage);
    return coverage >= percentage;
  }
}

module.exports = CoverageAnalyzer;
