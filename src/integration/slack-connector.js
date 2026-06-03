/**
 * Phase 8: Slack Integration
 */

class SlackConnector {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(channel, text, blocks = null) {
    return {
      url: this.webhookUrl,
      method: 'POST',
      data: {
        channel,
        text,
        blocks: blocks || [{ type: 'section', text: { type: 'mrkdwn', text } }]
      }
    };
  }

  async sendAlert(level, message, details = {}) {
    const color = level === 'critical' ? 'danger' : level === 'warning' ? 'warning' : 'good';
    
    return {
      url: this.webhookUrl,
      method: 'POST',
      data: {
        attachments: [{
          color,
          title: `${level.toUpperCase()}: ${message}`,
          text: JSON.stringify(details, null, 2),
          ts: Math.floor(Date.now() / 1000)
        }]
      }
    };
  }

  parseCommand(payload) {
    if (!payload.command) return null;
    
    return {
      command: payload.command,
      text: payload.text,
      user_id: payload.user_id,
      response_url: payload.response_url
    };
  }
}

module.exports = SlackConnector;
