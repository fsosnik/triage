const WorkflowBase = require('../src/workflows/workflow-base');
const GitHealingWorkflow = require('../src/workflows/w1-git-healing');
const BlocklistWorkflow = require('../src/workflows/w2-blocklist');
const RateLimitingWorkflow = require('../src/workflows/w3-rate-limiting');
const ProductionDeployWorkflow = require('../src/workflows/w4-production-deploy');
const LearningLoopWorkflow = require('../src/workflows/w5-learning-loop');
const CoreOSScheduler = require('../src/core/scheduler');

describe('Workflow Integration Tests', () => {
  describe('Workflow Base Class', () => {
    test('initializes with correct properties', () => {
      const config = {
        id: 'TEST',
        name: 'Test Workflow',
        phases: [],
        validations: []
      };
      const workflow = new WorkflowBase(config);
      expect(workflow.id).toBe('TEST');
      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.status).toBe('NOT_STARTED');
    });

    test('tracks evidence during execution', async () => {
      const config = {
        id: 'TEST',
        name: 'Test',
        phases: [
          {
            name: 'Phase 1',
            parallel: false,
            tasks: [
              {
                type: 'code',
                name: 'Test task',
                fn: async function() { return 'output'; }
              }
            ]
          }
        ],
        validations: [
          {
            name: 'Test validation',
            fn: async function() { return true; }
          }
        ]
      };

      const workflow = new WorkflowBase(config);
      const result = await workflow.execute();
      expect(result.evidence.length).toBeGreaterThan(0);
      expect(result.status).toBe('VALIDATED');
    });
  });

  describe('W1: Git Healing Workflow', () => {
    test('creates workflow with correct ID', () => {
      const workflow = new GitHealingWorkflow();
      expect(workflow.id).toBe('W1');
      expect(workflow.name).toBe('Git Repository Healing');
    });

    test('defines 3 phases', () => {
      const workflow = new GitHealingWorkflow();
      expect(workflow.phases.length).toBe(3);
      expect(workflow.phases[0].name).toContain('1.1');
      expect(workflow.phases[1].name).toContain('1.2');
      expect(workflow.phases[2].name).toContain('1.3');
    });

    test('has diagnostic, healing, and verification phases', () => {
      const workflow = new GitHealingWorkflow();
      expect(workflow.phases[0].name).toContain('Diagnose');
      expect(workflow.phases[1].name).toContain('Heal');
      expect(workflow.phases[2].name).toContain('Verify');
    });

    test('uses parallel task execution', () => {
      const workflow = new GitHealingWorkflow();
      expect(workflow.phases[0].parallel).toBe(true);
      expect(workflow.phases[1].parallel).toBe(true);
      expect(workflow.phases[2].parallel).toBe(true);
    });
  });

  describe('W2: Blocklist Workflow', () => {
    test('creates workflow with correct ID', () => {
      const workflow = new BlocklistWorkflow();
      expect(workflow.id).toBe('W2');
      expect(workflow.name).toBe('Blocklist Enforcement Engine');
    });

    test('defines 3 phases', () => {
      const workflow = new BlocklistWorkflow();
      expect(workflow.phases.length).toBe(3);
    });

    test('creates blocklist-gate.js and tests', () => {
      const workflow = new BlocklistWorkflow();
      expect(workflow.phases.some(p => p.name.includes('blocklist-gate'))).toBe(true);
      expect(workflow.phases.some(p => p.name.includes('tests'))).toBe(true);
    });
  });

  describe('W3: Rate Limiting Workflow', () => {
    test('creates workflow with correct ID', () => {
      const workflow = new RateLimitingWorkflow();
      expect(workflow.id).toBe('W3');
      expect(workflow.name).toBe('Rate Limiting Middleware');
    });

    test('defines 4 phases', () => {
      const workflow = new RateLimitingWorkflow();
      expect(workflow.phases.length).toBe(4);
    });

    test('includes dependency installation phase', () => {
      const workflow = new RateLimitingWorkflow();
      expect(workflow.phases[0].name).toContain('Install');
    });
  });

  describe('W4: Production Deploy Workflow', () => {
    test('creates workflow with correct ID', () => {
      const workflow = new ProductionDeployWorkflow();
      expect(workflow.id).toBe('W4');
      expect(workflow.name).toBe('Production Deployment Workflow');
    });

    test('defines 4 phases', () => {
      const workflow = new ProductionDeployWorkflow();
      expect(workflow.phases.length).toBe(4);
    });

    test('includes build, test, security, and readiness phases', () => {
      const workflow = new ProductionDeployWorkflow();
      const phaseNames = workflow.phases.map(p => p.name);
      expect(phaseNames.some(p => p.includes('Build'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Smoke'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Security'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Readiness'))).toBe(true);
    });
  });

  describe('W5: Learning Loop Workflow', () => {
    test('creates workflow with correct ID', () => {
      const workflow = new LearningLoopWorkflow();
      expect(workflow.id).toBe('W5');
      expect(workflow.name).toBe('Learning Loop & Checkpointing');
    });

    test('defines 4 phases', () => {
      const workflow = new LearningLoopWorkflow();
      expect(workflow.phases.length).toBe(4);
    });

    test('includes pattern extraction, knowledge update, documentation, and checkpoint phases', () => {
      const workflow = new LearningLoopWorkflow();
      const phaseNames = workflow.phases.map(p => p.name);
      expect(phaseNames.some(p => p.includes('Pattern'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Knowledge'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Documentation'))).toBe(true);
      expect(phaseNames.some(p => p.includes('Checkpoint'))).toBe(true);
    });
  });

  describe('CoreOSScheduler', () => {
    test('initializes with blocklist', () => {
      const scheduler = new CoreOSScheduler();
      expect(scheduler.blocklist).toBeDefined();
      expect(scheduler.workflows).toBeDefined();
      expect(scheduler.results).toBeDefined();
    });

    test('identifies workflows from task description', () => {
      const scheduler = new CoreOSScheduler();
      const workflows = scheduler.identifyWorkflows('Execute all Phase 1 workflows');
      expect(workflows.length).toBeGreaterThan(0);
    });

    test('identifies specific workflows by keyword', () => {
      const scheduler = new CoreOSScheduler();
      const gitWorkflows = scheduler.identifyWorkflows('git healing');
      expect(gitWorkflows.some(w => w.id === 'W1')).toBe(true);
    });

    test('identifies all 5 workflows for "all" task', () => {
      const scheduler = new CoreOSScheduler();
      const workflows = scheduler.identifyWorkflows('all');
      expect(workflows.length).toBe(5);
      expect(workflows.map(w => w.id)).toEqual(['W1', 'W2', 'W3', 'W4', 'W5']);
    });
  });

  describe('Workflow Execution Flow', () => {
    test('workflows have proper status transitions', async () => {
      const config = {
        id: 'TEST',
        name: 'Test',
        phases: [
          {
            name: 'Phase 1',
            parallel: false,
            tasks: []
          }
        ],
        validations: [
          {
            name: 'Always pass',
            fn: async function() { return true; }
          }
        ]
      };

      const workflow = new WorkflowBase(config);
      expect(workflow.status).toBe('NOT_STARTED');

      const result = await workflow.execute();
      expect(workflow.status).toBe('VALIDATED');
      expect(result.status).toBe('VALIDATED');
    });

    test('workflows capture execution timing', async () => {
      const config = {
        id: 'TEST',
        name: 'Test',
        phases: [
          {
            name: 'Phase 1',
            parallel: false,
            tasks: [
              {
                type: 'code',
                name: 'Task',
                fn: async function() { return 'ok'; }
              }
            ]
          }
        ],
        validations: [
          {
            name: 'Pass',
            fn: async function() { return true; }
          }
        ]
      };

      const workflow = new WorkflowBase(config);
      const result = await workflow.execute();
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });
  });
});
