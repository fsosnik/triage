class FailureClassifier {
  classifyFailure(error, agentName) {
    const errorStr = error.toString().toLowerCase();
    if (errorStr.includes('timeout')) return { type: 'TIMEOUT', severity: 'HIGH' };
    if (errorStr.includes('validation')) return { type: 'VALIDATION', severity: 'MEDIUM' };
    if (errorStr.includes('auth')) return { type: 'AUTH', severity: 'CRITICAL' };
    if (errorStr.includes('resource')) return { type: 'RESOURCE', severity: 'LOW' };
    return { type: 'UNKNOWN', severity: 'MEDIUM' };
  }
}

module.exports = FailureClassifier;
