# TRIAGE OS — Quick Start Guide

**Status**: ✅ READY TO USE  
**Phase**: 1 (Foundation)  
**Local Path**: `/Users/fsosnik/LocalProjects/Projects/triage/`

---

## 🚀 FIRST 5 MINUTES

### 1. Clone to Local Path

```bash
# If starting from scratch
cp -r /mnt/user-data/outputs/triage /Users/fsosnik/LocalProjects/Projects/

# OR if you already have the repo
cd /Users/fsosnik/LocalProjects/Projects/triage
git pull origin main
```

### 2. Install Dependencies

```bash
cd /Users/fsosnik/LocalProjects/Projects/triage
npm install
```

### 3. Setup Configuration

```bash
# Copy example configs
cp config/settings.example.json config/settings.json
cp config/patterns.example.json .claude/patterns/successes.json
cp config/blocklist.example.json .claude/patterns/blocklist.json
cp .env.example .env

# Edit .env with your credentials
nano .env  # Add GITHUB_TOKEN and ANTHROPIC_API_KEY
```

### 4. Validate Setup

```bash
npm run validate:structure
```

**Expected Output**:
```
✅ Structure is VALID - Ready to proceed
```

### 5. Read Documentation

```
1. README.md (this repo)
2. docs/architecture/ARCHITECTURE.md
3. docs/guides/LOW_CONSUMPTION.md
4. docs/api/API_INTEGRATION.md
```

---

## 📊 AVAILABLE COMMANDS

```bash
# Development
npm start                  # Start TRIAGE OS
npm run dev              # Watch mode (nodemon)

# Documentation
npm run docs:generate    # Auto-generate from patterns
npm run update:readme    # Update README metrics
npm run update:changelog # Generate changelog
npm run docs:validate    # Validate doc structure

# Testing & Validation
npm run validate:structure  # Check project structure
npm test                    # Run test suite
npm run test:patterns      # Validate pattern library
npm run test:blocklist     # Validate blocklist

# Monitoring
npm run monitor:consumption  # Token usage stats
npm run simulate:cycle      # Simulate a full cycle

# Phases
npm run phase:1  # Week 1: Foundation
npm run phase:2  # Week 2: Learning
npm run phase:3  # Week 3: Optimization
npm run phase:4  # Week 4: Scale

# Maintenance
npm run lint     # Check code style
npm run format   # Auto-format code
npm run setup    # Initial setup
```

---

## 🏗️ PROJECT STRUCTURE

```
/Users/fsosnik/LocalProjects/Projects/triage/
├── README.md                    ← Start here
├── package.json
├── .gitignore
├── .env.example                 ← Copy to .env
│
├── docs/
│   ├── architecture/ARCHITECTURE.md
│   ├── api/API_INTEGRATION.md
│   ├── guides/LOW_CONSUMPTION.md
│   └── examples/
│
├── src/                         ← Your code goes here
│   ├── core/os.js              (Phase 1)
│   ├── agents/                 (Phase 1)
│   ├── learning/               (Phase 2)
│   ├── validation/             (Phase 1)
│   └── tools/                  (Phase 1)
│
├── .claude/                     ← TRIAGE configuration
│   ├── agents/                 (4 agent templates)
│   ├── patterns/               (successes.json + blocklist.json)
│   ├── skills/                 (auto-extracted)
│   ├── rules/                  (project rules)
│   └── checkpoints/            (cycle history)
│
├── config/
│   ├── settings.example.json   ← Copy to settings.json
│   ├── patterns.example.json
│   └── blocklist.example.json
│
├── scripts/
│   ├── generate-docs.js        (auto-generates from patterns)
│   ├── update-changelog.js
│   ├── validate-structure.js
│   └── ...
│
├── .github/
│   └── workflows/
│       ├── docs.yml            (auto-update docs)
│       └── tests.yml           (validate on push)
│
└── tests/                       ← Test suite (Phase 2)
```

---

## 🔄 AUTOMATION WORKFLOWS

### What Happens When You Push

1. **GitHub Action: docs.yml**
   - Detects changes in `.claude/patterns/` or `src/`
   - Runs `npm run docs:generate`
   - Auto-generates: PATTERN_REGISTRY.md, BLOCKLIST.md, METRICS.md, AGENTS.md
   - Commits changes back to repo
   - Posts to Slack (if configured)

2. **GitHub Action: tests.yml**
   - Runs on every push to main/develop
   - Validates structure
   - Runs test suite
   - Checks patterns & blocklist
   - Reports issues

### What Happens When You Run Locally

```bash
npm run docs:generate    # Manual trigger
# Reads from: .claude/patterns/successes.json + blocklist.json
# Writes to: docs/PATTERN_REGISTRY.md, BLOCKLIST.md, METRICS.md, AGENTS.md
# Use when: You've completed a cycle and want docs updated
```

---

## 📈 PHASE 1: FOUNDATION (This Week)

**Goal**: Get Core OS working, complete 2-3 cycles

```bash
npm run phase:1

# What to implement (see docs/architecture/ARCHITECTURE.md):
1. Core OS (Layer 2) - Orchestrator
   └─ Pattern library loader
   └─ Agent selector  
   └─ Parallelization logic

2. Agent Mesh (Layer 3)
   └─ Code Agent runner
   └─ QA Agent runner
   └─ Research Agent runner (optional)
   └─ Risk Agent runner

3. Execution (Layer 4)
   └─ Git operations
   └─ npm test/build
   └─ Bash execution

4. Validation Gate (Layer 5)
   └─ Tests check
   └─ Build check
   └─ Production check

5. Learning Loop (Layer 5b)
   └─ Capture successful patterns
   └─ Update weights

# Files to create:
- src/core/os.js           (Main orchestrator)
- src/agents/code.js       (Code Agent executor)
- src/agents/qa.js         (QA Agent executor)
- src/agents/research.js   (Research Agent executor - optional)
- src/agents/risk.js       (Risk Agent executor)
- src/validation/index.js  (Validation gate)
- src/learning/index.js    (Learning loop)

# Success criteria:
✓ npm install → no errors
✓ npm run validate:structure → VALID
✓ Able to run 1 full cycle
✓ Pattern captured in .claude/patterns/successes.json
✓ Can commit to git without issues
```

---

## 🔐 Security Checklist

- [ ] .env is in .gitignore (never commit secrets)
- [ ] API keys in environment variables, not code
- [ ] Blocklist auto-detects dangerous patterns
- [ ] Validation Gate checks before any action
- [ ] Auto-rollback on failure enabled

---

## 📞 When You Need Help

1. **Read Documentation First**
   - README.md
   - ARCHITECTURE.md
   - API_INTEGRATION.md

2. **Check Examples**
   - docs/examples/ folder

3. **Run Validation**
   - npm run validate:structure
   - npm run test:patterns
   - npm run test:blocklist

4. **Check Logs**
   - logs/ folder
   - CHANGELOG.md

---

## 🎯 Success Metrics (By End of Week)

- [ ] Repo cloned locally
- [ ] npm install works
- [ ] npm run validate:structure → VALID
- [ ] Docs generated successfully
- [ ] Phase 1 implementation started
- [ ] First cycle completed
- [ ] Pattern captured in successes.json
- [ ] Documentation auto-generated

---

## 🚀 GITHUB INTEGRATION

### First Push to GitHub

```bash
cd /Users/fsosnik/LocalProjects/Projects/triage

# Configure git
git config user.name "fsosnik"
git config user.email "your@email.com"

# Verify remote
git remote -v
# Should show: origin https://github.com/fsosnik/triage.git

# First push
git branch -M main
git push -u origin main

# Verify at: https://github.com/fsosnik/triage
```

### After That

```bash
# Normal workflow
git add .
git commit -m "feat: implement Core OS"
git push origin main

# GitHub Actions will automatically:
# 1. Run tests.yml
# 2. Run docs.yml (if patterns changed)
# 3. Update documentation
# 4. Post to Slack (if configured)
```

---

## 🔧 ENVIRONMENT SETUP

Your `.env` file needs:

```bash
# REQUIRED
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-xxxxxxxxxxxxxxxx

# OPTIONAL (add later)
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...

# CONFIG
NODE_ENV=development
LOG_LEVEL=info
```

**How to get each**:
- GitHub Token: github.com → Settings → Developer settings → Personal access tokens
- Anthropic Key: console.anthropic.com → API keys
- Notion Token: notion.so → Settings → Integrations → Create integration
- Slack Webhook: api.slack.com → Create app → Incoming webhooks

---

## 📚 LEARNING PATH

### Day 1
- [ ] Clone repo
- [ ] Read README.md (5 min)
- [ ] npm install (2 min)
- [ ] npm run validate:structure (1 min)

### Day 2
- [ ] Read ARCHITECTURE.md (15 min)
- [ ] Understand 7 layers
- [ ] Review 4 agents
- [ ] Look at src/ structure

### Day 3
- [ ] Read LOW_CONSUMPTION.md (10 min)
- [ ] Understand pattern reuse
- [ ] Learn about token optimization
- [ ] Read examples (if any)

### Day 4-5
- [ ] Start Phase 1 implementation
- [ ] Create src/core/os.js
- [ ] Implement basic orchestration
- [ ] Run first cycle

### Week 2+
- [ ] Continue phases 2-4
- [ ] Implement learning loops
- [ ] Add MCPs
- [ ] Scale up

---

## 🎯 FINAL CHECKLIST

Before you start coding:

- [ ] Cloned to `/Users/fsosnik/LocalProjects/Projects/triage/`
- [ ] npm install → success
- [ ] .env configured with API keys
- [ ] npm run validate:structure → VALID
- [ ] Can run `npm run docs:generate`
- [ ] Understand ARCHITECTURE.md
- [ ] Know what Phase 1 requires
- [ ] GitHub Actions workflows in place
- [ ] Ready to code Phase 1

---

**Status**: ✅ READY TO START

**Next Step**: Read docs/architecture/ARCHITECTURE.md (15 minutes)

**Then**: Start Phase 1 implementation

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-03  
**Local Path**: `/Users/fsosnik/LocalProjects/Projects/triage/`

**Let's build TRIAGE OS! 🚀**
