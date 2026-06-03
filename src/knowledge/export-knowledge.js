/**
 * Phase 11: Export Knowledge
 * Export learnings in shareable formats
 */

class KnowledgeExporter {
  constructor(kb, archive) {
    this.kb = kb;
    this.archive = archive;
  }

  exportMarkdown() {
    let md = '# TRIAGE OS Knowledge Base\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;

    md += '## Statistics\n';
    const stats = this.kb.getStats();
    md += `- Insights: ${stats.total_insights}\n`;
    md += `- Patterns: ${stats.total_patterns}\n`;
    md += `- Failures Recorded: ${stats.total_failures}\n\n`;

    md += '## Top Patterns\n';
    this.kb.getTopPatterns(5).forEach(p => {
      md += `- ${p.id}: ${(p.success_rate * 100).toFixed(1)}% success\n`;
    });

    md += '\n## Common Failures\n';
    this.kb.getCommonFailures(3).forEach(f => {
      md += `- ${f.reason}: ${f.count} occurrences\n`;
    });

    return md;
  }

  exportJSON() {
    return {
      timestamp: new Date().toISOString(),
      knowledge_base: {
        insights: this.kb.insights,
        patterns: this.kb.patterns,
        failures: this.kb.failures
      },
      archive: {
        epochs: this.archive.epochs,
        evolution: this.archive.evolution
      }
    };
  }

  exportSummary() {
    return {
      stats: this.kb.getStats(),
      top_patterns: this.kb.getTopPatterns(5),
      common_failures: this.kb.getCommonFailures(3),
      milestones: this.archive.getMilestones(),
      report: this.archive.getReport()
    };
  }
}

module.exports = KnowledgeExporter;
