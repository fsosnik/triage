class RollbackExecutor {
  executeRollback(taskId, agents) {
    return {
      status: 'ROLLED_BACK',
      taskId,
      agents,
      timestamp: new Date()
    };
  }
}

module.exports = RollbackExecutor;
