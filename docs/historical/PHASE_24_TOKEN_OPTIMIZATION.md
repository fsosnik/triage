# Phase 24: Token Optimization (Graphify-driven)

## Status
- Tests: 4 fail, 111 pass (96.7% ✓)
- Graphify: 840 nodes, 1102 edges, 73 communities
- Graphs: stored in graphify-out/graph.json

## Token Savings Strategy (Graphify Analysis)
1. Pattern compression: ~70% reduction (phase-19 validated)
2. Prompt caching: Anthropic cache_control on repeated queries
3. Context window: Keep top-K nodes from 73 communities

## Implementation
- Use graphify-out/graph.json for smart pattern selection
- Cache god nodes (degree > 20): metrics, scripts, patterns, settings
- Load patterns async (not startup blocking)

## Metrics
- Baseline: 14,612 tokens (phase 21 graphify run)
- Target: ~4,000 tokens per orchestration cycle
- Goal: 75% reduction

## Next
- Implement async pattern loading
- Add cache_control to API calls
- Refactor rollback-loop (phase 24)
