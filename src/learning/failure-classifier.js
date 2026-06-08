class FailureClassifier {
  static classify(details) {
    const reason = (details.reason || '').toLowerCase();
    if (reason.includes('test')) return 'test_failure';
    if (reason.includes('build')) return 'build_failure';
    if (reason.includes('type')) return 'type_error';
    if (reason.includes('validation')) return 'validation_error';
    if (reason.includes('security')) return 'security_issue';
    return 'unknown';
  }

  static calculateSeverity(details) {
    if (details.reason.includes('CRÍTICO')) return 5;
    if (details.reason.includes('security')) return 4;
    if (details.reason.includes('data')) return 4;
    if (details.reason.includes('test')) return 2;
    return 3;
  }
}
module.exports = FailureClassifier;
