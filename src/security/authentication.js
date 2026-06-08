class AuthManager {
  constructor() {
    this.users = new Map();
    this.tokens = new Map();
  }
  createUser(username, password) {
    const id = `user_${Date.now()}`;
    this.users.set(id, { username, password, roles: [] });
    return id;
  }
  authenticate(username, password) {
    for (const [id, user] of this.users) {
      if (user.username === username && user.password === password) {
        const token = `token_${Date.now()}`;
        this.tokens.set(token, id);
        return token;
      }
    }
    return null;
  }
  verify(token) {
    const userId = this.tokens.get(token);
    return userId ? this.users.get(userId) : null;
  }
  grantRole(userId, role) {
    const user = this.users.get(userId);
    if (user && !user.roles.includes(role)) user.roles.push(role);
  }
}
module.exports = AuthManager;
