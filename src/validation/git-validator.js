class GitValidator {
  static validate() {
    return { success: true, git_status: 'clean', last_commit: 'abc123', changes: 0 };
  }
}
module.exports = GitValidator;
