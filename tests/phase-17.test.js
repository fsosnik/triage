const PluginManager = require('../src/plugins/plugin-manager');
const PluginLoader = require('../src/plugins/plugin-loader');

describe('Phase 17: Plugin System', () => {
  
  test('PluginManager should register plugin', () => {
    const pm = new PluginManager();
    const plugin = {
      name: 'test',
      execute: async (input) => input
    };
    pm.register('test', plugin);
    expect(pm.plugins.has('test')).toBe(true);
  });

  test('should execute plugin', async () => {
    const pm = new PluginManager();
    const plugin = {
      name: 'math',
      execute: async (input) => input.a + input.b
    };
    pm.register('math', plugin);
    const result = await pm.execute('math', { a: 2, b: 3 });
    expect(result).toBe(5);
  });

  test('should register hooks', () => {
    const pm = new PluginManager();
    const plugin = {
      name: 'test',
      execute: async (input) => input,
      hooks: {
        'before:task': async () => {}
      }
    };
    pm.register('test', plugin);
    expect(pm.hooks.has('before:task')).toBe(true);
  });

  test('should run hooks', async () => {
    const pm = new PluginManager();
    let hookRan = false;
    const plugin = {
      name: 'test',
      execute: async (input) => input,
      hooks: {
        'before:task': async () => { hookRan = true; }
      }
    };
    pm.register('test', plugin);
    await pm.runHook('before:task', {});
    expect(hookRan).toBe(true);
  });

  test('should list plugins', () => {
    const pm = new PluginManager();
    pm.register('plugin1', { name: 'p1', execute: async () => {} });
    pm.register('plugin2', { name: 'p2', execute: async () => {} });
    const list = pm.list();
    expect(list.length).toBe(2);
  });

  test('PluginLoader should list plugins', () => {
    const loader = new PluginLoader('/nonexistent');
    const plugins = loader.listPlugins();
    expect(Array.isArray(plugins)).toBe(true);
  });
});
