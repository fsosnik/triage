# Orkest — Claude Code Operating Architecture & Execution Prompt

**Repository:** `https://github.com/fsosnik/orkest`  
**Branch:** `main`  
**Local path provided by user:** `//Users/fsosnik/LocalProjects/Projects/Personal/bridger4u/orkest`  
**Important validation note:** previous workspace conventions may reference another canonical path: `/Users/fsosnik/LocalProjects/Projects/Personal/bridger4u/orkest`. Claude Code must verify the real active repository before making changes.

---

# ORKEST CLAUDE CODE MEMORY & BOOTSTRAP STRUCTURE

Create the following structure and use it as the persistent operational memory system for Orkest.

IMPORTANT:
- GitHub is the canonical source of truth.
- Claude Code must read these files at the beginning of every session.
- Do NOT rely on chat memory for architecture or project state.
- Keep docs concise, operational, and updated.
- Never overwrite existing files blindly.
- Merge/update carefully if equivalent files already exist.

TARGET STRUCTURE:

orkest/
│
├── .ai/
│   │
│   ├── BOOTSTRAP.md
│   │
│   ├── context/
│   │   ├── CURRENT_STATE.md
│   │   ├── ACTIVE_PHASE.md
│   │   ├── OPEN_QUESTIONS.md
│   │   ├── KNOWN_RISKS.md
│   │   ├── NEXT_ACTIONS.md
│   │   └── DECISION_LOG.md
│   │
│   ├── prompts/
│   │   ├── CLAUDE_CODE_MASTER_PROMPT.md
│   │   ├── ARCHITECTURE_REVIEW_PROMPT.md
│   │   ├── MODULE_IMPLEMENTATION_PROMPT.md
│   │   ├── AGENT_DESIGN_PROMPT.md
│   │   ├── RELEASE_REVIEW_PROMPT.md
│   │   └── QA_REVIEW_PROMPT.md
│   │
│   ├── working-notes/
│   │   ├── README.md
│   │   └── YYYY-MM-DD-session-notes.md
│   │
│   ├── experiments/
│   │   ├── README.md
│   │   ├── runtime-tests/
│   │   ├── memory-tests/
│   │   ├── vector-tests/
│   │   └── orchestration-tests/
│   │
│   └── templates/
│       ├── ADR_TEMPLATE.md
│       ├── MODULE_TEMPLATE.md
│       ├── AGENT_TEMPLATE.md
│       ├── WORKFLOW_TEMPLATE.md
│       └── AUDIT_TEMPLATE.md
│
├── docs/
│   │
│   ├── architecture/
│   │   ├── ORKEST_ARCHITECTURE.md
│   │   ├── RUNTIME_ARCHITECTURE.md
│   │   ├── EVENT_DRIVEN_ARCHITECTURE.md
│   │   ├── TENANT_ISOLATION.md
│   │   ├── SECURITY_MODEL.md
│   │   ├── MCP_STRATEGY.md
│   │   ├── MEMORY_ARCHITECTURE.md
│   │   └── OBSERVABILITY.md
│   │
│   ├── agents/
│   │   ├── AGENT_FRAMEWORK.md
│   │   ├── AGENT_CONTRACTS.md
│   │   ├── AGENT_LIFECYCLE.md
│   │   ├── AGENT_GUARDRAILS.md
│   │   ├── AGENT_TOOLS.md
│   │   └── AGENT_APPROVAL_FLOW.md
│   │
│   ├── modules/
│   │   ├── CRM.md
│   │   ├── BILLING.md
│   │   ├── SALES.md
│   │   ├── PURCHASES.md
│   │   ├── STOCK.md
│   │   ├── WMS.md
│   │   ├── BI.md
│   │   ├── AI.md
│   │   ├── INTEGRATIONS.md
│   │   └── MARKETPLACE.md
│   │
│   ├── workflows/
│   │   ├── ORDER_TO_INVOICE.md
│   │   ├── STOCK_RESERVATION.md
│   │   ├── PURCHASE_FLOW.md
│   │   ├── AGENT_EXECUTION_FLOW.md
│   │   ├── APPROVAL_FLOW.md
│   │   └── INCIDENT_RESPONSE_FLOW.md
│   │
│   ├── decisions/
│   │   ├── ADR-0001-claude-code-operating-model.md
│   │   ├── ADR-0002-github-as-source-of-truth.md
│   │   ├── ADR-0003-agentic-backend-boundaries.md
│   │   ├── ADR-0004-tenant-isolation-first.md
│   │   └── ADR-0005-event-driven-workflows.md
│   │
│   ├── audits/
│   │   ├── REPO_AUDIT.md
│   │   ├── ARCHITECTURE_AUDIT.md
│   │   ├── SECURITY_AUDIT.md
│   │   └── TENANT_ISOLATION_AUDIT.md
│   │
│   ├── runbooks/
│   │   ├── LOCAL_DEVELOPMENT.md
│   │   ├── VALIDATION.md
│   │   ├── RELEASE_PROCESS.md
│   │   ├── DEPLOYMENT.md
│   │   ├── INCIDENT_RESPONSE.md
│   │   └── BACKUP_AND_RECOVERY.md
│   │
│   └── releases/
│       ├── CHANGELOG.md
│       └── ROADMAP.md
│
├── ORKEST.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── WORKFLOW.md
└── README.md


# CLAUDE CODE BOOTSTRAP PROTOCOL

Claude Code must ALWAYS execute the following protocol before starting work:

1. Verify repository:
   - pwd
   - git status
   - git branch --show-current
   - git remote -v

2. Read:
   - ORKEST.md
   - CLAUDE.md
   - .ai/BOOTSTRAP.md
   - .ai/context/CURRENT_STATE.md
   - .ai/context/ACTIVE_PHASE.md
   - .ai/context/OPEN_QUESTIONS.md
   - relevant docs under docs/

3. Summarize:
   - current architecture
   - active phase
   - pending work
   - known risks
   - validation state

4. Before implementing:
   - inspect current code
   - propose plan
   - identify risks
   - avoid silent architectural changes

5. After meaningful work:
   - update docs
   - update CURRENT_STATE.md
   - update ACTIVE_PHASE.md
   - update NEXT_ACTIONS.md
   - update DECISION_LOG.md if architecture changed

6. Before commit:
   - run build
   - run lint
   - run tests
   - review git diff

7. Never:
   - trust undocumented assumptions
   - bypass tenant isolation
   - introduce framework lock-in casually
   - perform uncontrolled refactors
   - modify architecture silently


# IMPORTANT ARCHITECTURAL PRINCIPLES

Orkest is:
- a modular operational platform
- event-driven
- tenant-aware
- AI-native
- agent-assisted
- workflow-centric

Orkest is NOT:
- a prompt collection
- an autonomous AI experiment
- a traditional ERP clone
- a framework demo

Agents must:
- be auditable
- be bounded
- use explicit tools
- respect tenant context
- operate through service-layer contracts

GitHub:
- stores canonical truth

Claude Code:
- operates the engineering workflow

.ai/:
- stores AI operational memory

docs/:
- stores stable architecture and product documentation

Fedora server:
- future runtime and experimentation lab
- NOT the source of truth


# FIRST TASK

Do NOT implement features first.

FIRST:
1. audit repository
2. verify structure
3. professionalize operating model
4. stabilize documentation
5. validate workflows
6. identify architectural risks
7. establish branch and validation discipline

ONLY AFTER THAT:
- implement one vertical slice
- validate architecture
- evolve runtime

## 0. Purpose of this document

This document defines how Orkest should be continued using **Claude Code** as the primary AI engineering environment.

The goal is not to “let AI build Orkest alone”.

The goal is to create a professional, controlled, auditable, AI-native engineering workflow where Claude Code acts as:

- senior engineering copilot
- repository operator
- architecture reviewer
- implementation assistant
- QA assistant
- documentation maintainer
- release discipline enforcer

Orkest must remain a serious, scalable, modular, multi-tenant, agentic platform — not a loose collection of prompts and generated code.

---

## 1. Core decision

Orkest should use:

### GitHub as source of truth

GitHub must store:

- production code
- canonical documentation
- architecture decisions
- stable technical specifications
- CI/CD configuration
- test history
- release notes
- module contracts
- agent contracts
- database schema and migrations

GitHub should **not** become a dumping ground for temporary AI reasoning, incomplete brainstorming, or raw chat history.

---

### Claude Code as execution layer

Claude Code should be the primary operational development environment because it has access to:

- real filesystem
- real terminal
- real Git
- real build commands
- real tests
- real package manager
- real repo structure
- real debugging context

Claude Code should operate with strict rules:

- inspect before editing
- plan before implementing
- validate before committing
- never change architecture silently
- never skip build/lint/test verification
- document meaningful changes
- avoid large uncontrolled refactors

---

### Fedora server as future agentic lab

The Fedora machine should not immediately become the production home of Orkest.

It should become an experimental infrastructure node for:

- Dockerized services
- PostgreSQL
- Redis
- Qdrant or vector DB experiments
- Temporal or workflow runtime experiments
- Playwright/browser automation
- MCP servers
- local model experiments
- observability sandbox
- agent runtime prototypes

Production architecture should be designed independently from local machine assumptions.

---

## 2. Strategic architecture principles

Orkest should be built around these principles:

### 2.1 Modular core

Orkest is not a traditional ERP.

It is a modular operational platform where clients can activate only the capabilities they need.

Possible modules:

- CRM
- Billing / Facturación
- Sales
- Purchases
- Stock / Inventory
- WMS / SGA
- BI
- AI
- Integrations
- Mobile Apps
- Marketplace

Each module must have:

- clear domain boundaries
- explicit data ownership
- service layer
- API contract
- event contract
- permissions model
- tests
- documentation

---

### 2.2 Agentic backend, but not uncontrolled autonomy

The backend may be agentic, but agents must not be magical black boxes.

Each agent must have:

- explicit responsibility
- allowed tools
- forbidden actions
- input contract
- output contract
- audit trail
- retry policy
- escalation path
- failure handling
- tenant isolation guarantees

Agents should not directly mutate critical business data without controlled service-layer validation.

---

### 2.3 Human-controlled automation

Orkest should support a spectrum of automation:

1. Human-assisted recommendations
2. Human-approved actions
3. Semi-autonomous workflows
4. Fully automated low-risk workflows
5. Fully autonomous workflows only when risk, audit, rollback, and permissions are mature

Do not start with full autonomy.

Start with controlled automation.

---

### 2.4 Event-driven workflow foundation

Business workflows should be modeled as events and state transitions, not just direct CRUD operations.

Examples:

- `order.created`
- `order.validated`
- `stock.reserved`
- `invoice.requested`
- `invoice.generated`
- `payment.received`
- `shipment.prepared`
- `agent.action.requested`
- `agent.action.completed`
- `agent.action.failed`

Events should be auditable, tenant-aware, and idempotent where possible.

---

### 2.5 Tenant isolation is non-negotiable

Every layer must respect tenant isolation:

- database queries
- APIs
- services
- background jobs
- agents
- memory
- vector search
- logs
- file storage
- events
- integrations

No agent, service, or query should operate without tenant context.

---

### 2.6 Documentation is part of the product

Documentation must be treated as source code.

Every meaningful architecture change should update docs.

Required documentation categories:

```text
docs/
  architecture/
  agents/
  modules/
  workflows/
  decisions/
  runbooks/
  audits/
  releases/
```

Temporary AI notes should live separately:

```text
.ai/
  context/
  prompts/
  working-notes/
  experiments/
```

The `.ai/` folder may be versioned, but it must be clearly separated from canonical product documentation.

---

## 3. Recommended repository structure

Claude Code should inspect the current repository before applying this structure.

Do not blindly overwrite existing files.

Target structure:

```text
orkest/
  apps/
    api/
    web/
    worker/

  packages/
    database/
    shared/
    domain/
    agents/
    events/
    integrations/
    ui/

  docs/
    architecture/
      ORKEST_ARCHITECTURE.md
      RUNTIME_ARCHITECTURE.md
      TENANT_ISOLATION.md
      EVENT_DRIVEN_ARCHITECTURE.md
      SECURITY_MODEL.md

    agents/
      AGENT_FRAMEWORK.md
      AGENT_CONTRACTS.md
      AGENT_LIFECYCLE.md
      AGENT_TOOLING.md
      AGENT_GUARDRAILS.md

    modules/
      CRM.md
      BILLING.md
      SALES.md
      PURCHASES.md
      STOCK.md
      WMS.md
      BI.md
      INTEGRATIONS.md

    workflows/
      ORDER_TO_INVOICE.md
      STOCK_RESERVATION.md
      PURCHASE_FLOW.md
      AGENT_ACTION_FLOW.md

    decisions/
      ADR-0001-claude-code-operating-model.md
      ADR-0002-github-as-source-of-truth.md
      ADR-0003-agentic-backend-boundaries.md
      ADR-0004-tenant-isolation-first.md

    runbooks/
      LOCAL_DEVELOPMENT.md
      VALIDATION.md
      RELEASE_PROCESS.md
      INCIDENT_RESPONSE.md

    audits/
      REPO_AUDIT.md
      ARCHITECTURE_AUDIT.md

    releases/
      CHANGELOG.md

  .ai/
    context/
      CURRENT_STATE.md
      ACTIVE_PHASE.md
      OPEN_QUESTIONS.md

    prompts/
      CLAUDE_CODE_MASTER_PROMPT.md
      ARCHITECTURE_REVIEW_PROMPT.md
      MODULE_IMPLEMENTATION_PROMPT.md
      RELEASE_REVIEW_PROMPT.md

    working-notes/
      YYYY-MM-DD-session-notes.md

    experiments/
      README.md

  CLAUDE.md
  ORKEST.md
  CONTRIBUTING.md
  WORKFLOW.md
  README.md
  package.json
  pnpm-workspace.yaml
```

This structure is a target, not a command to rewrite the repository without inspection.

---

## 4. Claude Code operating rules

Claude Code must follow these rules every time it works on Orkest.

### 4.1 Before any change

Claude must run:

```bash
pwd
git status
git branch --show-current
git remote -v
```

Claude must confirm:

- it is inside the correct local repository
- branch is `main` unless explicitly instructed otherwise
- remote points to `https://github.com/fsosnik/orkest`
- working tree is clean or user-approved changes are present

If the local path is not a Git repo, Claude must stop and report.

---

### 4.2 Branching rule

Claude must not work directly on `main` for implementation changes.

Use branches:

```text
feat/<short-task>
fix/<short-task>
docs/<short-task>
chore/<short-task>
arch/<short-task>
```

Examples:

```text
arch/claude-code-operating-model
docs/agent-framework
feat/billing-agent-contracts
fix/tenant-isolation-checks
```

For pure documentation setup, a docs or arch branch is preferred.

---

### 4.3 Commit rule

Commit style:

```text
type(scope): short description
```

Examples:

```text
docs(architecture): add Claude Code operating model
arch(agents): define agent lifecycle and guardrails
feat(billing): add invoice generation agent contract
fix(tenant): enforce tenant context in billing queries
```

---

### 4.4 Validation rule

Before committing, Claude must run the available validation commands.

Claude must inspect `package.json` first.

Likely commands:

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
```

If some commands do not exist, Claude must report that clearly and propose adding them.

No commit should claim success unless validation was actually run.

---

### 4.5 No silent architecture changes

Claude must not silently change:

- database model
- module boundaries
- tenant model
- authentication model
- authorization model
- agent contracts
- event contracts
- package structure
- deployment strategy

Any such change requires:

- explanation
- affected files
- risk assessment
- validation plan
- documentation update

---

## 5. Development lifecycle

Every meaningful task should follow this lifecycle:

```text
1. Inspect
2. Summarize current state
3. Identify risks
4. Propose plan
5. Implement minimal safe change
6. Validate
7. Update docs
8. Commit
9. Report remaining work
```

Claude Code response format should be:

```text
Findings
Risks
Plan
Files changed
Changes made
Validation
Remaining work
```

---

## 6. Architecture layers

Orkest should be designed in layers.

### 6.1 Presentation layer

Responsible for:

- web UI
- mobile UI
- dashboards
- user workflows
- forms
- admin views
- module-specific interfaces

Should not contain business logic that belongs to backend services.

---

### 6.2 API layer

Responsible for:

- HTTP endpoints
- authentication
- authorization
- request validation
- tenant context extraction
- response formatting

Should call domain/service layer, not database directly unless explicitly justified.

---

### 6.3 Domain/service layer

Responsible for:

- business rules
- workflows
- validations
- state transitions
- transactional operations
- module boundaries

This layer is the core business logic.

Agents should invoke this layer through controlled tools/services.

---

### 6.4 Event layer

Responsible for:

- domain events
- async workflows
- idempotency
- retries
- event audit
- integration triggers

This layer should enable future durable workflows.

---

### 6.5 Agent layer

Responsible for:

- reasoning workflows
- tool selection
- decision proposals
- automation execution
- summarization
- anomaly detection
- orchestration support

Agents must be bounded by permissions, contracts, and audit logging.

---

### 6.6 Integration layer

Responsible for:

- external APIs
- MCP servers
- webhooks
- third-party systems
- legacy systems
- ERP/accounting connectors

Integrations must be isolated from core domain logic.

---

### 6.7 Data layer

Responsible for:

- database schema
- migrations
- repositories
- tenant-aware queries
- audit records
- transaction consistency

No uncontrolled direct DB access from agents.

---

## 7. Agent architecture

### 7.1 Agent registry

Every production-grade agent should be registered with metadata:

```ts
type AgentDefinition = {
  id: string;
  name: string;
  module: string;
  description: string;
  allowedTools: string[];
  requiredPermissions: string[];
  inputSchema: unknown;
  outputSchema: unknown;
  riskLevel: "low" | "medium" | "high";
  requiresHumanApproval: boolean;
};
```

---

### 7.2 Agent execution record

Every agent run should produce an audit record:

```ts
type AgentExecution = {
  id: string;
  tenantId: string;
  agentId: string;
  userId?: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  input: unknown;
  output?: unknown;
  toolCalls: AgentToolCall[];
  error?: string;
  startedAt: Date;
  completedAt?: Date;
};
```

---

### 7.3 Agent tool call record

```ts
type AgentToolCall = {
  id: string;
  executionId: string;
  toolName: string;
  input: unknown;
  output?: unknown;
  status: "pending" | "completed" | "failed";
  error?: string;
  createdAt: Date;
};
```

---

### 7.4 Initial recommended agents

Do not implement all agents at once.

Recommended initial agents:

#### OrderFulfillmentAgent

Purpose:

- validate order
- check stock
- reserve stock
- trigger invoice request

Risk level: medium/high  
Human approval: initially yes for destructive or financial actions

---

#### InvoiceGenerationAgent

Purpose:

- generate invoice draft
- validate billing data
- request final invoice generation
- record result

Risk level: high  
Human approval: yes until billing compliance is mature

---

#### SupplierMatchingAgent

Purpose:

- suggest suppliers
- compare prices
- evaluate delivery options
- recommend purchase order

Risk level: medium  
Human approval: yes

---

#### DocumentationSyncAgent

Purpose:

- detect stale docs
- suggest documentation updates
- summarize changes
- prepare release notes

Risk level: low  
Human approval: no for draft generation, yes for commits

---

#### QAReviewAgent

Purpose:

- inspect critical flows
- run test checklists
- identify regression risks
- propose test improvements

Risk level: low  
Human approval: no for analysis, yes for code changes

---

## 8. Runtime architecture direction

Do not overbuild immediately.

Recommended staged evolution:

### Stage 1 — Controlled service-layer agents

- Agents run inside backend or worker
- Agents call explicit tools/services
- Human approval required for risky actions
- Full audit log
- No autonomous long-running workflows yet

---

### Stage 2 — Event-driven agents

- Agents respond to domain events
- Async execution through queue/worker
- Idempotency support
- Retry policy
- Tenant-aware execution context

---

### Stage 3 — Durable workflows

Evaluate:

- Temporal
- custom state machine
- LangGraph
- queue-based orchestration

Use durable workflows for:

- order to invoice
- stock reservation
- purchase flow
- external integration retries
- agent approvals

---

### Stage 4 — MCP/integration runtime

Introduce MCP for:

- external tools
- document systems
- browser automation
- email/calendar integrations
- third-party SaaS connectors

MCP must be permissioned, tenant-aware, and auditable.

---

### Stage 5 — Memory layer

Introduce memory carefully.

Memory types:

- tenant knowledge memory
- user preference memory
- business rule memory
- integration memory
- workflow memory
- agent execution memory

Vector memory must never leak data between tenants.

---

## 9. Fedora server roadmap

The Fedora machine should be used as an experimental platform, not as the primary source of truth.

Recommended future stack:

```text
Docker
PostgreSQL
Redis
Qdrant
Temporal
Playwright
MCP servers
OpenTelemetry
Grafana / Prometheus
Ollama or local LLM experiments
```

Suggested order:

1. Docker + PostgreSQL
2. Redis
3. Playwright/browser automation
4. Qdrant
5. Temporal
6. MCP servers
7. Observability stack
8. Local model experiments

Do not bind Orkest architecture to Fedora-only assumptions.

---

## 10. First Claude Code task

The first task should not be feature implementation.

The first task should be a safe repository audit and operating model setup.

---

# Claude Code Master Prompt

Paste the following into Claude Code from inside the intended Orkest repository.

```text
Act as a senior enterprise AI architect, staff engineer, and Claude Code operator.

We are continuing the Orkest project.

Repository:
- GitHub: https://github.com/fsosnik/orkest
- Expected branch: main
- Local path provided by user: /Users/fsosnik/LocalProjects/orkest

Important:
There may be older documentation or memory referencing a different canonical path:
- /Users/fsosnik/LocalProjects/Projects/Personal/bridger4u/orkest

Before doing anything, verify the real active repository.

Your first task is NOT to implement business features.

Your first task is to audit and professionalize the AI-native engineering operating model for Orkest.

Follow these mandatory rules:

1. Run:
   - pwd
   - git status
   - git branch --show-current
   - git remote -v
   - ls
   - find . -maxdepth 3 -type f | sort | sed 's#^\./##' | head -300

2. Confirm:
   - whether this is the correct repo
   - whether branch is main
   - whether remote points to https://github.com/fsosnik/orkest
   - whether working tree is clean
   - whether pnpm is used
   - whether package.json, pnpm-workspace.yaml, ORKEST.md, CLAUDE.md, docs/, apps/, packages/ exist

3. Do not edit files until you summarize findings and propose a safe plan.

4. Identify current repository structure and compare it to this target operating architecture:
   - GitHub is source of truth for code and canonical docs
   - Claude Code is execution layer
   - Fedora server is future agentic lab, not primary source of truth
   - docs/ contains stable product and architecture docs
   - .ai/ contains AI working context, prompts, and temporary notes
   - agents must have explicit contracts, tools, permissions, audit trail, and tenant isolation

5. If the repository already has equivalent files, update them carefully instead of duplicating.

6. Create or update only foundational documentation and workflow files first. Suggested files:
   - ORKEST.md
   - CLAUDE.md
   - README.md
   - CONTRIBUTING.md
   - WORKFLOW.md
   - docs/architecture/ORKEST_ARCHITECTURE.md
   - docs/architecture/RUNTIME_ARCHITECTURE.md
   - docs/architecture/TENANT_ISOLATION.md
   - docs/architecture/EVENT_DRIVEN_ARCHITECTURE.md
   - docs/agents/AGENT_FRAMEWORK.md
   - docs/agents/AGENT_CONTRACTS.md
   - docs/workflows/ORDER_TO_INVOICE.md
   - docs/decisions/ADR-0001-claude-code-operating-model.md
   - .ai/context/CURRENT_STATE.md
   - .ai/context/ACTIVE_PHASE.md
   - .ai/prompts/CLAUDE_CODE_MASTER_PROMPT.md

7. Do not implement new business features yet.

8. Do not introduce new frameworks yet.

9. Do not modify database schema yet unless the audit proves a critical inconsistency and you ask for approval first.

10. Do not work directly on main for file changes.
    Create a branch:
    - arch/claude-code-operating-model

11. After changes, run available validation commands.
    Inspect package.json first.
    Try, if available:
    - pnpm install
    - pnpm build
    - pnpm lint
    - pnpm test

12. If commands fail because scripts are missing, document that clearly and propose next steps.
    Do not pretend validation passed.

13. Commit only if:
    - changes are coherent
    - validation was attempted
    - docs are consistent
    - git diff was reviewed

14. Commit message:
    docs(architecture): establish Claude Code operating model

15. Final response format:
    Findings
    Risks
    Plan
    Files changed
    Changes made
    Validation
    Git status
    Remaining work

Architectural direction to enforce:

- Orkest is a modular operational platform, not a traditional ERP.
- Backend may be agentic, but agents must be controlled, auditable, tenant-aware, and service-layer bounded.
- Tenant isolation is non-negotiable.
- Business workflows should move toward event-driven architecture.
- GitHub is canonical source of truth.
- Claude Code is operational execution layer.
- Fedora is experimental infrastructure/lab.
- Documentation is part of the product.
- Avoid uncontrolled autonomy.
- Avoid prompt spaghetti.
- Avoid framework overcommitment before validating one vertical slice.
```

---

## 11. First implementation strategy after setup

After the operating model is created, proceed in this order:

### Phase A — Repository truth audit

Goal:

- verify actual implementation
- verify docs vs code
- detect stale assumptions
- identify broken scripts
- identify missing tests
- identify tenant isolation gaps

Output:

```text
docs/audits/REPO_AUDIT.md
docs/audits/ARCHITECTURE_AUDIT.md
```

---

### Phase B — One vertical slice

Pick one workflow.

Recommended:

```text
Order → Stock Reservation → Invoice Draft
```

Why this one?

Because it validates:

- Sales
- Stock
- Billing
- agentic workflow
- event-driven architecture
- tenant isolation
- transactional consistency
- audit trail
- human approval

Do not build all modules in parallel.

---

### Phase C — Agent runtime MVP

Build only the minimum agent runtime needed for one vertical slice:

- Agent registry
- Agent execution log
- Tool contracts
- Tenant context
- Human approval gate
- Event trigger
- Retry/failure status

---

### Phase D — UI + QA

Add:

- admin visibility of agent runs
- workflow status
- approval UI
- audit view
- Playwright smoke tests

---

### Phase E — Fedora lab

Only after local repo workflow is stable:

- deploy services to Fedora
- add Dockerized dependencies
- test browser automation
- test worker execution
- test vector memory separately
- test Temporal only if needed

---

## 12. Key risks

### Risk 1 — Over-agentification

Do not turn every function into an agent.

Many operations should remain deterministic services.

Use agents where reasoning, ambiguity, recommendation, or orchestration adds value.

---

### Risk 2 — Framework lock-in

Do not prematurely commit to:

- LangChain
- LangGraph
- CrewAI
- AutoGen
- Temporal
- OpenClaw
- gstack

Evaluate them as tools, not foundations.

The foundation is Orkest architecture, not any single framework.

---

### Risk 3 — Tenant leakage

This is the highest technical risk.

Every agent, memory system, tool, and query must carry tenant context.

---

### Risk 4 — Documentation drift

Claude Code must update docs with meaningful architecture changes.

Docs must not become aspirational fiction.

---

### Risk 5 — AI-generated complexity

Claude Code can generate a lot of code quickly.

Velocity is not the goal.

Coherence is the goal.

---

## 13. Final recommendation

This is the correct strategic direction:

```text
GitHub = canonical source of truth
Claude Code = execution and validation layer
Docs = stable architecture memory
.ai/ = AI working memory
Fedora = experimental runtime lab
Agents = controlled service-bound automation
Events = workflow backbone
Tenant isolation = non-negotiable
One vertical slice first = proof of architecture
```

Do not try to build the full Orkest platform at once.

Build the operating model first.

Then validate the architecture through one real vertical slice.

## AI Engineering Workflow Layer

Orkest will use gstack concepts and workflows as the AI engineering operational layer.

gstack is NOT the runtime foundation of Orkest.

gstack responsibilities:
- Claude Code workflows
- architecture reviews
- documentation workflows
- QA workflows
- browser automation
- release reviews
- engineering discipline

Orkest runtime responsibilities:
- business logic
- tenant isolation
- event orchestration
- agent execution
- workflow runtime
- integrations
- persistence
- observability