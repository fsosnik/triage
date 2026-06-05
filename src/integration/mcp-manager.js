class MCPManager {
  constructor() {
    this.servers = {
      github: null,
      slack: null,
      mem: null
    };
  }
  
  registerServer(name, handler) {
    this.servers[name] = handler;
  }
  
  async executeTask(server, task) {
    if (!this.servers[server]) throw new Error(`Server ${server} not found`);
    return this.servers[server](task);
  }
}

module.exports = MCPManager;
