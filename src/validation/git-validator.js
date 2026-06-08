const { execSync } = require('child_process');

class GitValidator {
  static validate() {
    try {
      // git status
      const statusOutput = execSync('git status --porcelain 2>&1', { encoding: 'utf-8' });
      const isClean = statusOutput.trim() === '';
      
      // git log
      const logOutput = execSync('git log -n 1 --oneline 2>&1', { encoding: 'utf-8' });
      const lastCommit = logOutput.trim().split(' ')[0];
      
      // git branch
      const branchOutput = execSync('git branch --show-current 2>&1', { encoding: 'utf-8' });
      const currentBranch = branchOutput.trim();
      
      const changes = statusOutput.split('\n').filter(line => line.trim()).length;

      return {
        success: isClean,
        git_status: isClean ? 'clean' : 'dirty',
        last_commit: lastCommit,
        current_branch: currentBranch,
        changes: changes,
        dirty_files: statusOutput,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        git_status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = GitValidator;
