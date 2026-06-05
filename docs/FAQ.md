# FAQ

**Q: How is this different from ChatGPT?**
A: TRIAGE validates all decisions against reality (npm test, curl production). No hallucinations.

**Q: Can I use this offline?**
A: Yes. No external APIs required for core orchestration.

**Q: How much does it cost?**
A: Free. Open source. MIT license.

**Q: Can I deploy to production?**
A: Yes. See [Deployment](DEPLOYMENT.md).

**Q: How do I contribute?**
A: See [Contributing](../CONTRIBUTING.md).

**Q: Why 4 agents?**
A: Covers code, quality, knowledge, risk. Empirically optimal.

**Q: Can I add custom agents?**
A: Yes. See [API Guide](API_GUIDE.md#custom-agents).

**Q: What's the success rate?**
A: 91.5% on production tasks.

**Q: How long does a task take?**
A: 1-5 seconds for typical tasks.

**Q: Can multiple teams use it?**
A: Yes. Multi-tenant support built in.

**Q: What about security?**
A: Blocklist enforcement, validation gates, rate limiting. See [Architecture](ARCHITECTURE.md#security).

**Q: Is there a UI?**
A: Dashboard at http://localhost:3000. WebSocket for real-time updates.

**Q: Can I integrate with Slack/GitHub?**
A: Yes. MCPs built in. See [Technical Manual](TECHNICAL_MANUAL.md#mcp).
