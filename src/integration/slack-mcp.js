class SlackMCP {
  async sendMessage(channel, text) {
    return { channel, text, sent: true };
  }
  async postMetrics(channel, metrics) {
    return { channel, metrics };
  }
}
module.exports = SlackMCP;
