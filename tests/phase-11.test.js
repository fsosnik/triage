const KnowledgeBase = require('../src/knowledge/knowledge-base');
const LearningArchive = require('../src/knowledge/learning-archive');
const KnowledgeExporter = require('../src/knowledge/export-knowledge');

describe('Phase 11: Knowledge Management', () => {
  
  test('KnowledgeBase should capture insights', () => {
    const kb = new KnowledgeBase();
    const insight = kb.captureInsight('Tip', 'Content', 'optimization', 0.9);
    expect(insight.id).toBeDefined();
  });

  test('should capture patterns', () => {
    const kb = new KnowledgeBase();
    kb.capturePattern('p1', 0.95, ['code', 'qa'], 100);
    expect(kb.patterns.length).toBe(1);
  });

  test('should get top patterns', () => {
    const kb = new KnowledgeBase();
    kb.capturePattern('p1', 0.95, ['code'], 100);
    kb.capturePattern('p2', 0.80, ['qa'], 150);
    const top = kb.getTopPatterns(1);
    expect(top[0].id).toBe('p1');
  });

  test('LearningArchive should create epochs', () => {
    const archive = new LearningArchive();
    const epoch = archive.createEpoch(1, 'Initial phase');
    expect(epoch.number).toBe(1);
  });

  test('should track evolution', () => {
    const archive = new LearningArchive();
    archive.recordEvolution('success_rate', 0.7, 0.85, 'tuning');
    expect(archive.evolution.length).toBe(1);
  });

  test('KnowledgeExporter should export JSON', () => {
    const kb = new KnowledgeBase();
    const archive = new LearningArchive();
    const exporter = new KnowledgeExporter(kb, archive);
    const json = exporter.exportJSON();
    expect(json.knowledge_base).toBeDefined();
  });

  test('should export summary', () => {
    const kb = new KnowledgeBase();
    const archive = new LearningArchive();
    const exporter = new KnowledgeExporter(kb, archive);
    const summary = exporter.exportSummary();
    expect(summary.stats).toBeDefined();
  });
});
