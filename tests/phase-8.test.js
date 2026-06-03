const GitHubConnector = require('../src/integration/github-connector');
const SlackConnector = require('../src/integration/slack-connector');
const WebhookHandler = require('../src/integration/webhook-handler');
const IntegrationOrchestrator = require('../src/integration/integration-orchestrator');

describe('Phase 8: Integrations', () => {
  
  test('GitHubConnector should build API calls', async () => {
    const gh = new GitHubConnector('token123');
    const issues = await gh.getIssues('user', 'repo');
    expect(issues.endpoint).toContain('api.github.com');
    expect(issues.method).toBe('GET');
  });

  test('GitHubConnector should parse webhooks', () => {
    const gh = new GitHubConnector('token123');
    const parsed = gh.parseWebhook({
      action: 'opened',
      issue: { number: 1, title: 'Bug' }
    });
    expect(parsed.type).toBe('issue_opened');
  });

  test('SlackConnector should format messages', async () => {
    const slack = new SlackConnector('https://hooks.slack.com/...');
    const msg = await slack.sendAlert('critical', 'System down');
    expect(msg.data.attachments[0].color).toBe('danger');
  });

  test('WebhookHandler should process events', async () => {
    const handler = new WebhookHandler();
    handler.register('test_event', async (e) => ({ processed: true }));
    
    const result = await handler.handle({ type: 'test_event' });
    expect(result.status).toBe('processed');
  });

  test('IntegrationOrchestrator should list connectors', () => {
    const orch = new IntegrationOrchestrator({});
    orch.registerConnector('github', new GitHubConnector('token'));
    orch.registerConnector('slack', new SlackConnector('hook'));
    
    const list = orch.listConnectors();
    expect(list).toContain('github');
    expect(list).toContain('slack');
  });
});
