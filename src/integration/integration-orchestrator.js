/**
 * Phase 8: Integration Orchestrator
 * Manage all external integrations
 */

class IntegrationOrchestrator {
  constructor(triageOS) {
    this.os = triageOS;
    this.connectors = new Map();
    this.webhookHandler = null;
  }

  registerConnector(name, connector) {
    this.connectors.set(name, connector);
  }

  setWebhookHandler(handler) {
    this.webhookHandler = handler;
  }

  async processExternalEvent(event) {
    if (!this.webhookHandler) return { error: 'No webhook handler' };

    const parsed = this.parseEvent(event);
    if (!parsed) return { error: 'Unknown event type' };

    const result = await this.webhookHandler.handle(parsed);

    if (parsed.type === 'github_issue') {
      return await this.routeToOS({
        task: `GitHub Issue: ${parsed.title}`,
        context: parsed.body,
        source: 'github'
      });
    }

    if (parsed.type === 'slack_command') {
      return await this.routeToOS({
        task: parsed.text,
        context: `Slack command by ${parsed.user_id}`,
        source: 'slack'
      });
    }

    return result;
  }

  parseEvent(event) {
    if (event.issue) return { type: 'github_issue', ...event.issue };
    if (event.command) return { type: 'slack_command', ...event };
    return null;
  }

  async routeToOS(input) {
    return this.os.orchestrate(input);
  }

  getConnector(name) {
    return this.connectors.get(name);
  }

  listConnectors() {
    return Array.from(this.connectors.keys());
  }
}

module.exports = IntegrationOrchestrator;
