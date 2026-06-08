# TRIAGE OS — Frequently Asked Questions

## General

**Q: What is TRIAGE OS?**
A: An intelligent operating system that validates against reality (not prediction), learns from success, and prevents failure repeats.

**Q: How is it different from other systems?**
A: Instead of trusting prediction, TRIAGE OS validates against:
- Real test execution
- Real build output
- Real git state
- Real production health
Reality always wins over prediction.

**Q: Who should use TRIAGE OS?**
A: Developers, DevOps engineers, and teams that want:
- Automated validation
- Pattern learning
- Failure prevention
- Self-evolving systems

---

## Installation & Setup

**Q: What are the requirements?**
A: 
- Node.js 22+
- npm 10+
- 500MB disk space
- 200MB RAM

**Q: How do I install?**
A:
```bash
git clone https://github.com/fsosnik/triage.git
cd triage && npm install && npm start
```

**Q: How do I verify installation?**
A:
```bash
npm test              # Should pass all 126 tests
curl http://localhost:3000/health  # Should respond
```

---

## Usage

**Q: How do I execute a cycle?**
A:
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{"task":"...","agents":["code","qa"],"prediction":{"success":true}}'
```

**Q: What agents are available?**
A: Code, QA, Research, Risk, Knowledge

**Q: Can I use custom agents?**
A: Yes, add to `src/agents/` and register in `AgentExecutor.js`

**Q: How long does a cycle take?**
A: ~2-3 seconds (depending on agents)

---

## Validation & Feedback

**Q: Why does it say "INVALID" when I think it should be "VALID"?**
A: Because reality disagreed with prediction.
- Real tests failed?
- Real build failed?
- Real git is dirty?
- Real production didn't respond?

TRIAGE OS trusts reality over your prediction.

**Q: What happens after "VALID"?**
A: The pattern is captured and reused for similar future tasks.

**Q: What happens after "INVALID"?**
A: The failure is logged, agent weight reduced, and pattern blocked.

---

## Graphify & Ruflo

**Q: Are Graphify and Ruflo required?**
A: No, they're optional. KnowledgeAgent uses them but other agents work fine.

**Q: What does Graphify do?**
A: Analyzes code structure and generates knowledge graphs (5 nodes in demo).

**Q: What does Ruflo do?**
A: Measures cyclomatic complexity and flags problematic code.

**Q: How do I use them?**
A: Include "knowledge" agent in your cycle:
```bash
curl -X POST http://localhost:3000/cycle \
  -d '{"agents":["knowledge"],...}'
```

---

## Data & Storage

**Q: Where are patterns stored?**
A: `.claude/patterns/successes.json`

**Q: Where are failures logged?**
A: `.claude/patterns/blocklist.json`

**Q: Where are checkpoints saved?**
A: `.claude/checkpoints/` directory

**Q: How do I delete old data?**
A: Checkpoints can be archived monthly. Don't delete patterns (they improve the system).

**Q: Is data persisted across restarts?**
A: Yes, all patterns and checkpoints are saved to disk.

---

## Performance

**Q: How fast is it?**
A: ~2-3 seconds per full cycle (including validation, agents, feedback).

**Q: What's the memory footprint?**
A: ~200-400MB depending on pattern size.

**Q: Can it handle multiple concurrent requests?**
A: Yes, but execution will be sequential. For parallel, use PM2 with multiple instances.

**Q: How many patterns can it store?**
A: Tested with 100+ patterns without issue.

---

## Troubleshooting

**Q: Port 3000 is already in use, what do I do?**
A:
```bash
lsof -ti :3000 | xargs kill -9
npm start
```

**Q: Tests are failing, what now?**
A:
```bash
npm test               # See which test failed
npm test -- phase-X   # Run specific test
npm test -- --verbose # See detailed output
```

**Q: API is not responding, how do I debug?**
A:
```bash
curl -v http://localhost:3000/health
ps aux | grep "node src/api"
npm start  # Check for startup errors
```

**Q: How do I see logs?**
A: Logs are printed to stdout. Redirect if needed:
```bash
npm start 2>&1 | tee logs/triage-os.log
```

---

## Deployment

**Q: Can I deploy to production?**
A: Yes! See DEPLOYMENT.md for Docker and PM2 setup.

**Q: Do I need a database?**
A: No, TRIAGE OS uses the filesystem for storage.

**Q: How do I scale it?**
A: Use PM2 with multiple instances or Docker containers with a load balancer.

**Q: Is it cloud-ready?**
A: Yes, works on AWS, GCP, Azure, etc. Just ensure Node.js and disk space.

---

## Contributing

**Q: Can I contribute?**
A: Yes! See CONTRIBUTING.md (coming soon)

**Q: How do I report bugs?**
A: Create an issue: https://github.com/fsosnik/triage/issues

**Q: How do I request features?**
A: Create a discussion or issue with "feature request" tag.

---

## Support

**Q: Where do I get help?**
A:
- Docs: DOCUMENTATION_INDEX.md
- Issues: GitHub Issues
- Email: fersosnik@gmail.com

**Q: Is there a community?**
A: Not yet, but you can join discussions on GitHub.

---

**Last Updated**: 2026-06-08  
**Status**: Comprehensive FAQ
