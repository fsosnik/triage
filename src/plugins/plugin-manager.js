/**
 * Phase 17: Plugin System
 */

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  register(name, plugin) {
    if (!plugin.name || !plugin.execute) {
      throw new Error('Plugin must have name and execute method');
    }
    this.plugins.set(name, plugin);
    this.registerHooks(plugin);
  }

  registerHooks(plugin) {
    if (plugin.hooks) {
      for (const [hookName, handler] of Object.entries(plugin.hooks)) {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName).push(handler);
      }
    }
  }

  async execute(name, input) {
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`Plugin not found: ${name}`);
    return plugin.execute(input);
  }

  async runHook(hookName, context) {
    const handlers = this.hooks.get(hookName) || [];
    for (const handler of handlers) {
      await handler(context);
    }
  }

  list() {
    return Array.from(this.plugins.keys()).map(name => ({
      name,
      info: this.plugins.get(name).info
    }));
  }
}

module.exports = PluginManager;
