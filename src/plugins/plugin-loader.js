/**
 * Phase 17: Plugin Loader
 */

const fs = require('fs');
const path = require('path');

class PluginLoader {
  constructor(pluginDir = '.claude/plugins') {
    this.pluginDir = pluginDir;
  }

  loadPlugin(pluginName) {
    const pluginPath = path.join(this.pluginDir, pluginName);
    
    if (!fs.existsSync(pluginPath)) {
      throw new Error(`Plugin directory not found: ${pluginPath}`);
    }

    const manifestPath = path.join(pluginPath, 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Plugin manifest not found: ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const indexPath = path.join(pluginPath, manifest.main || 'index.js');

    if (!fs.existsSync(indexPath)) {
      throw new Error(`Plugin entry not found: ${indexPath}`);
    }

    const PluginClass = require(indexPath);
    return new PluginClass();
  }

  listPlugins() {
    if (!fs.existsSync(this.pluginDir)) return [];
    return fs.readdirSync(this.pluginDir);
  }

  loadAll(manager) {
    const plugins = this.listPlugins();
    for (const pluginName of plugins) {
      try {
        const plugin = this.loadPlugin(pluginName);
        manager.register(pluginName, plugin);
      } catch (error) {
        console.error(`Failed to load plugin ${pluginName}: ${error.message}`);
      }
    }
  }
}

module.exports = PluginLoader;
