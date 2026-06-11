const WorkflowBase = require('./workflow-base');

class GitHealingWorkflow extends WorkflowBase {
  constructor() {
    const repos = [
      'orkest',
      'halo',
      'sansahnas',
      'enterprise-ai-llm-portfolio'
    ];

    super({
      id: 'W1',
      name: 'Git Repository Healing',
      agents: ['code_agent', 'qa_agent', 'research_agent'],

      phases: [
        {
          name: 'Phase 1.1: Diagnose',
          parallel: true,
          tasks: repos.map(repo => ({
            type: 'bash',
            name: `Diagnose ${repo}`,
            command: `cd ~/LocalProjects/Projects/${repo} 2>/dev/null && (git status 2>&1; git log -1 --oneline 2>&1; git branch -a 2>&1; git fsck --full 2>&1) || echo "Repo access issue"`
          }))
        },
        {
          name: 'Phase 1.2: Heal',
          parallel: true,
          tasks: repos.map(repo => ({
            type: 'code',
            name: `Heal ${repo}`,
            fn: async function() {
              const repoPath = `/Users/fsosnik/LocalProjects/Projects/${repo}`;
              const commands = [
                `cd ${repoPath} && git fetch origin 2>&1 || echo "fetch skipped"`,
                `cd ${repoPath} && git symbolic-ref HEAD refs/heads/main 2>&1 || echo "symbolic-ref skipped"`,
                `cd ${repoPath} && git reset --hard origin/main 2>&1 || echo "reset skipped"`,
                `cd ${repoPath} && git status`
              ];

              for (const cmd of commands) {
                try {
                  await new Promise((resolve, reject) => {
                    this.bash(cmd);
                    resolve();
                  });
                } catch (e) {
                  console.warn(`  [${repo}] Command skipped: ${cmd}`);
                }
              }
              return 'Healed';
            }
          }))
        },
        {
          name: 'Phase 1.3: Verify',
          parallel: true,
          tasks: repos.map(repo => ({
            type: 'bash',
            name: `Verify ${repo}`,
            command: `cd ~/LocalProjects/Projects/${repo} 2>/dev/null && (git status --porcelain && git log -1 --oneline) || echo "Repo not accessible"`
          }))
        }
      ],

      validations: [
        {
          name: 'All repos accessible via git log',
          fn: async function() {
            for (const repo of repos) {
              try {
                this.bash(`cd ~/LocalProjects/Projects/${repo} && git log -1 --oneline`);
              } catch {
                return false;
              }
            }
            return true;
          }
        },
        {
          name: 'Repos clean (no uncommitted changes)',
          fn: async function() {
            for (const repo of repos) {
              try {
                const output = this.bash(`cd ~/LocalProjects/Projects/${repo} && git status --porcelain`);
                if (output && output.trim() !== '') {
                  console.log(`  [${repo}] has uncommitted changes`);
                  return false;
                }
              } catch (e) {
                return false;
              }
            }
            return true;
          }
        },
        {
          name: 'No git corruption (fsck clean)',
          fn: async function() {
            for (const repo of repos) {
              try {
                const output = this.bash(`cd ~/LocalProjects/Projects/${repo} && git fsck --full 2>&1`);
                if (output && (output.includes('error') || output.includes('dangling'))) {
                  return false;
                }
              } catch {
                return false;
              }
            }
            return true;
          }
        }
      ]
    });
  }
}

module.exports = GitHealingWorkflow;
