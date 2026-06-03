/**
 * Phase 8: Webhook Handler
 * Process external events
 */

class WebhookHandler {
  constructor() {
    this.handlers = new Map();
    this.events = [];
  }

  register(event_type, handler) {
    this.handlers.set(event_type, handler);
  }

  async handle(event) {
    const handler = this.handlers.get(event.type);
    if (!handler) {
      return { status: 'no_handler', event_type: event.type };
    }

    try {
      const result = await handler(event);
      this.recordEvent(event, 'processed');
      return { status: 'processed', result };
    } catch (error) {
      this.recordEvent(event, 'failed', error.message);
      return { status: 'failed', error: error.message };
    }
  }

  recordEvent(event, status, error = null) {
    this.events.push({
      timestamp: new Date().toISOString(),
      type: event.type,
      status,
      error
    });
  }

  getEventLog(limit = 50) {
    return this.events.slice(-limit);
  }
}

module.exports = WebhookHandler;
