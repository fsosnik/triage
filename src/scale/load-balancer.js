class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.current = 0;
  }
  
  nextServer() {
    const server = this.servers[this.current];
    this.current = (this.current + 1) % this.servers.length;
    return server;
  }
}
module.exports = LoadBalancer;
