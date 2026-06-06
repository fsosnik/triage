class AuthManager {
  constructor() { this.users = new Map(); }
  createUser(username, password) {
    const id = `user_${Date.now()}`;
    this.users.set(id, { username, password });
    return id;
  }
  authenticate(username, password) {
    for (const [id, user] of this.users) {
      if (user.username === username && user.password === password) return `token_${id}`;
    }
    return null;
  }
  verify(token) { return { valid: true }; }
  grantRole(userId, role) {
    const user = this.users.get(userId);
    if (user) user.role = role;
  }
}
module.exports = AuthManager;
