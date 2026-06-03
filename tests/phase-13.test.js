const CLI = require('../src/cli/cli');
const Formatter = require('../src/cli/formatter');
const Config = require('../src/cli/config');

describe('Phase 13: CLI Tools', () => {
  
  test('CLI should setup commands', () => {
    const mockOS = { getMetrics: () => ({}), patterns: [], metrics: { total_cycles: 0 } };
    const cli = new CLI(mockOS, {}, {});
    expect(cli.commands.size).toBeGreaterThan(0);
  });

  test('should execute status command', async () => {
    const mockOS = { getMetrics: () => ({}), patterns: [], metrics: { total_cycles: 5, successful: 5 } };
    const cli = new CLI(mockOS, {}, {});
    const result = await cli.execute('status', []);
    expect(result.cycles).toBe(5);
  });

  test('should execute metrics command', async () => {
    const mockOS = { getMetrics: () => ({ cycles: 10 }), patterns: [] };
    const cli = new CLI(mockOS, {}, {});
    const result = await cli.execute('metrics', []);
    expect(result).toBeDefined();
  });

  test('Formatter should format table', () => {
    const data = [{ name: 'test', value: '100' }];
    const table = Formatter.table(data, ['name', 'value']);
    expect(table).toContain('test');
  });

  test('Config should save and load', () => {
    const config = new Config();
    config.set('test_key', 'test_value');
    expect(config.get('test_key')).toBe('test_value');
  });

  test('should show help', async () => {
    const mockOS = { getMetrics: () => ({}), patterns: [], metrics: { total_cycles: 0 } };
    const cli = new CLI(mockOS, {}, {});
    const help = cli.getHelp();
    expect(help).toContain('TRIAGE OS');
  });
});
