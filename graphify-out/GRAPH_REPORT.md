# Graph Report - .  (2026-06-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 840 nodes · 1102 edges · 73 communities (52 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14b3da6f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_TRIAGE OS Architecture Overview|TRIAGE OS Architecture Overview]]
- [[_COMMUNITY_Deployment Configuration|Deployment Configuration]]
- [[_COMMUNITY_Rollback & Token Optimization|Rollback & Token Optimization]]
- [[_COMMUNITY_Knowledge Export & Capture|Knowledge Export & Capture]]
- [[_COMMUNITY_CLI Command Interface|CLI Command Interface]]
- [[_COMMUNITY_API Client & Middleware|API Client & Middleware]]
- [[_COMMUNITY_Dev Scripts & Tooling|Dev Scripts & Tooling]]
- [[_COMMUNITY_Core Orchestration Engine|Core Orchestration Engine]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Audit Log & Authentication|Audit Log & Authentication]]
- [[_COMMUNITY_Tenant Blocklist & Settings|Tenant Blocklist & Settings]]
- [[_COMMUNITY_Alerting & Dashboard UI|Alerting & Dashboard UI]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Anomaly Detection & Prediction|Anomaly Detection & Prediction]]
- [[_COMMUNITY_Architecture & Agent Docs|Architecture & Agent Docs]]
- [[_COMMUNITY_Test Coverage & Integration|Test Coverage & Integration]]
- [[_COMMUNITY_Auto-Tuning & Feedback Loop|Auto-Tuning & Feedback Loop]]
- [[_COMMUNITY_Graphify Visualization Adapter|Graphify Visualization Adapter]]
- [[_COMMUNITY_Benchmarking & Profiling|Benchmarking & Profiling]]
- [[_COMMUNITY_Plugin Loader & Manager|Plugin Loader & Manager]]
- [[_COMMUNITY_Rollback Failure Handling|Rollback Failure Handling]]
- [[_COMMUNITY_Analytics Event Engine|Analytics Event Engine]]
- [[_COMMUNITY_Phase Status Tracking|Phase Status Tracking]]
- [[_COMMUNITY_Multi-Tenant Management|Multi-Tenant Management]]
- [[_COMMUNITY_Integration Test Suite|Integration Test Suite]]
- [[_COMMUNITY_Metrics Dashboard Snapshots|Metrics Dashboard Snapshots]]
- [[_COMMUNITY_Project Build Tools|Project Build Tools]]
- [[_COMMUNITY_Settings & Token Config|Settings & Token Config]]
- [[_COMMUNITY_Agent Execution Framework|Agent Execution Framework]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Execution Checkpoint Data|Execution Checkpoint Data]]
- [[_COMMUNITY_Agent Weight Config|Agent Weight Config]]
- [[_COMMUNITY_Docs Generation Scripts|Docs Generation Scripts]]
- [[_COMMUNITY_Reporting & Export|Reporting & Export]]
- [[_COMMUNITY_Plugin Template|Plugin Template]]
- [[_COMMUNITY_Insight Recommendations Engine|Insight Recommendations Engine]]
- [[_COMMUNITY_Agent Parallelism Config|Agent Parallelism Config]]
- [[_COMMUNITY_Checkpoint Settings|Checkpoint Settings]]
- [[_COMMUNITY_Learning & Weight Config|Learning & Weight Config]]
- [[_COMMUNITY_Logging Configuration|Logging Configuration]]
- [[_COMMUNITY_Validation & URL Checks|Validation & URL Checks]]
- [[_COMMUNITY_Agent Weights Data|Agent Weights Data]]
- [[_COMMUNITY_Plugin Extensibility System|Plugin Extensibility System]]
- [[_COMMUNITY_Deployment Shell Script|Deployment Shell Script]]
- [[_COMMUNITY_API & MCP Integration Guide|API & MCP Integration Guide]]
- [[_COMMUNITY_Claude Context Config|Claude Context Config]]
- [[_COMMUNITY_Data Schema Docs|Data Schema Docs]]
- [[_COMMUNITY_Docker Compose Config|Docker Compose Config]]
- [[_COMMUNITY_Advanced Security Phase|Advanced Security Phase]]
- [[_COMMUNITY_Testing & Coverage Phase|Testing & Coverage Phase]]
- [[_COMMUNITY_Analytics & Reporting Phase|Analytics & Reporting Phase]]
- [[_COMMUNITY_Production Deployment Guide|Production Deployment Guide]]
- [[_COMMUNITY_Project Status Overview|Project Status Overview]]
- [[_COMMUNITY_Quick Start Guide|Quick Start Guide]]
- [[_COMMUNITY_Docs CI Workflow|Docs CI Workflow]]
- [[_COMMUNITY_Tests CI Workflow|Tests CI Workflow]]

## God Nodes (most connected - your core abstractions)
1. `metrics` - 22 edges
2. `scripts` - 21 edges
3. `created_at` - 20 edges
4. `settings` - 20 edges
5. `patterns` - 20 edges
6. `blocklist` - 20 edges
7. `TRIAGEOS` - 17 edges
8. `TRIAGE OS` - 17 edges
9. `LearningLoopV2` - 14 edges
10. `RollbackLoop` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Phase 2: Learning Loops` --implements--> `LearningLoopV2`  [INFERRED]
  PHASE_2_COMPLETE.md → src/core/os.js
- `TRIAGE OS` --references--> `Architecture Diagram (PNG)`  [EXTRACTED]
  README_UPDATE.md → docs/architecture-diagram.png
- `LearningLoopV2` --shares_data_with--> `Knowledge Base Distribuida`  [EXTRACTED]
  src/core/os.js → README_UPDATE.md
- `Arquitectura de 7 Capas` --references--> `LearningLoopV2`  [EXTRACTED]
  README_UPDATE.md → src/core/os.js
- `Validation Gate` --calls--> `LearningLoopV2`  [EXTRACTED]
  README_UPDATE.md → src/core/os.js

## Import Cycles
- 1-file cycle: `src/core/os.js -> src/core/os.js`

## Communities (73 total, 21 thin omitted)

### Community 0 - "TRIAGE OS Architecture Overview"
Cohesion: 0.08
Nodes (36): Architecture Diagram (PNG), LearningLoopV2, fs, path, Phase 11: Knowledge Management, Phase 12: REST API Server, Phase 13: CLI Tools, Phase 14: Performance Benchmarking (+28 more)

### Community 1 - "Deployment Configuration"
Cohesion: 0.08
Nodes (22): backup, enabled, frequency, retention_days, environments, development, production, staging (+14 more)

### Community 2 - "Rollback & Token Optimization"
Cohesion: 0.07
Nodes (17): fs, path, RollbackLoop, TokenOptimizer, WeightUpdater, { execSync }, fs, path (+9 more)

### Community 3 - "Knowledge Export & Capture"
Cohesion: 0.07
Nodes (6): KnowledgeExporter, fs, path, KnowledgeBase, KnowledgeExporter, LearningArchive

### Community 4 - "CLI Command Interface"
Cohesion: 0.07
Nodes (7): CLI, Config, fs, path, CLI, Config, Formatter

### Community 5 - "API Client & Middleware"
Cohesion: 0.08
Nodes (8): APIClient, RateLimiter, RequestValidator, ResponseFormatter, APIServer, APIClient, APIServer, { RateLimiter, RequestValidator, ResponseFormatter }

### Community 6 - "Dev Scripts & Tooling"
Cohesion: 0.06
Nodes (26): scripts, dev, docs:generate, docs:watch, format, lint, phase:1, phase:2 (+18 more)

### Community 8 - "Package Dependencies"
Cohesion: 0.07
Nodes (29): author, dependencies, @anthropic-ai/sdk, dotenv, express, graphify, lodash, @notionhq/client (+21 more)

### Community 9 - "Audit Log & Authentication"
Cohesion: 0.08
Nodes (10): fs, path, AuthManager, crypto, crypto, Encryptor, AuditLog, AuthManager (+2 more)

### Community 10 - "Tenant Blocklist & Settings"
Cohesion: 0.37
Nodes (29): 17fb69bfba6ad7bb, 23c7cba993cbe98f, 2b3f17544aa2a961, 39550f35d498e97d, 4cca6c0bc433ae0b, 5d227f1ad7351afa, 64bf412e0e1dd3e8, blocklist (+21 more)

### Community 11 - "Alerting & Dashboard UI"
Cohesion: 0.08
Nodes (7): Alerting, Dashboard, EventEmitter, Monitor, Alerting, Dashboard, Monitor

### Community 12 - "Execution Checkpoint Data"
Cohesion: 0.09
Nodes (24): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors (+16 more)

### Community 13 - "Anomaly Detection & Prediction"
Cohesion: 0.10
Nodes (3): AnomalyDetector, PatternPredictor, TrendAnalyzer

### Community 14 - "Architecture & Agent Docs"
Cohesion: 0.14
Nodes (23): Code Agent Spec, QA Agent Spec, Research Agent Spec, Risk Agent Spec, API Reference, TRIAGE OS Architecture Document, TRIAGE OS Checkpoint 2026-06-03, 7-Layer Agentic Architecture (+15 more)

### Community 15 - "Test Coverage & Integration"
Cohesion: 0.10
Nodes (5): CoverageAnalyzer, TestSuite, CoverageAnalyzer, IntegrationTest, TestSuite

### Community 16 - "Auto-Tuning & Feedback Loop"
Cohesion: 0.11
Nodes (3): AutoTuner, FeedbackLoop, PerformanceProfiler

### Community 17 - "Graphify Visualization Adapter"
Cohesion: 0.11
Nodes (6): Graphify, express, fs, GraphifyCompression, WebSocket, GraphifyAdapter

### Community 18 - "Benchmarking & Profiling"
Cohesion: 0.11
Nodes (5): LoadTest, Profiler, Benchmark, LoadTest, Profiler

### Community 19 - "Plugin Loader & Manager"
Cohesion: 0.14
Nodes (4): fs, path, PluginLoader, PluginManager

### Community 22 - "Phase Status Tracking"
Cohesion: 0.15
Nodes (12): features, metrics, commits, compression_ratio, tests_passing, tests_total, token_savings, total_phases (+4 more)

### Community 23 - "Multi-Tenant Management"
Cohesion: 0.21
Nodes (3): crypto, fs, path

### Community 24 - "Integration Test Suite"
Cohesion: 0.15
Nodes (12): MetricsDashboard, TokenOptimizer, APIGateway, LoadBalancer, MultiTenant, GitHubConnector, IntegrationOrchestrator, SlackConnector (+4 more)

### Community 25 - "Metrics Dashboard Snapshots"
Cohesion: 0.23
Nodes (4): MetricsDashboard, fs, MetricsDashboard, path

### Community 26 - "Project Build Tools"
Cohesion: 0.20
Nodes (4): { execSync }, fs, path, Tools

### Community 27 - "Settings & Token Config"
Cohesion: 0.22
Nodes (9): consumption, cache_control_ephemeral, cache_patterns, max_tokens_per_month, reuse_context, description, mode, project_name (+1 more)

### Community 28 - "Agent Execution Framework"
Cohesion: 0.47
Nodes (5): Agent, CodeAgent, QAAgent, ResearchAgent, RiskAgent

### Community 29 - "Execution Checkpoint Data"
Cohesion: 0.25
Nodes (8): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors

### Community 30 - "Execution Checkpoint Data"
Cohesion: 0.25
Nodes (8): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors

### Community 31 - "Execution Checkpoint Data"
Cohesion: 0.25
Nodes (8): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors

### Community 32 - "Execution Checkpoint Data"
Cohesion: 0.25
Nodes (8): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors

### Community 33 - "Execution Checkpoint Data"
Cohesion: 0.25
Nodes (8): agents_executed, status, task, timestamp, tokens_used, validations, blocklist_clean, no_errors

### Community 35 - "Agent Weight Config"
Cohesion: 0.25
Nodes (8): weights, model, code_agent, default, max_tokens_per_call, other_agents, qa_agent, risk_agent

### Community 44 - "Agent Parallelism Config"
Cohesion: 0.50
Nodes (5): agents, enabled, parallelism, max_concurrent, timeout_seconds

### Community 45 - "Checkpoint Settings"
Cohesion: 0.40
Nodes (5): checkpoint, auto_create, compress, include_metrics, save_location

### Community 46 - "Learning & Weight Config"
Cohesion: 0.40
Nodes (5): learning, auto_blocklist, pattern_threshold, weight_penalty_failure, weight_update_success

### Community 47 - "Logging Configuration"
Cohesion: 0.40
Nodes (5): logging, level, log_location, max_log_size_mb, save_logs

### Community 48 - "Validation & URL Checks"
Cohesion: 0.40
Nodes (5): url, validation, checks, production_check, required

### Community 50 - "Agent Weights Data"
Cohesion: 0.40
Nodes (4): code, qa, research, risk

## Knowledge Gaps
- **273 isolated node(s):** `timestamp`, `phase`, `status`, `total_phases`, `tests_passing` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MetricsDashboard` connect `Metrics Dashboard Snapshots` to `Integration Test Suite`, `Rollback & Token Optimization`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `LearningLoopV2` connect `TRIAGE OS Architecture Overview` to `Rollback & Token Optimization`, `Core Orchestration Engine`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `scripts` connect `Dev Scripts & Tooling` to `Package Dependencies`, `Rollback & Token Optimization`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `timestamp`, `phase`, `status` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TRIAGE OS Architecture Overview` be split into smaller, more focused modules?**
  _Cohesion score 0.08095238095238096 - nodes in this community are weakly interconnected._
- **Should `Deployment Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08403361344537816 - nodes in this community are weakly interconnected._
- **Should `Rollback & Token Optimization` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._