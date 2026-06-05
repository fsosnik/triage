/**
 * Phase 10: Authentication & Authorization
 */

const bcrypt = require('bcrypt');

class AuthManager {
  constructor() {
    this.tokens = new Map();
    this.users = new Map();
  }

  createUser(username, password) {
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: crypto.randomBytes(8).toString('hex'),
      username,
      password_hash: hash,
      created_at: new Date().toISOString(),
      roles: ['user']
    };
    this.users.set(user.id, user);
    return user.id;
  }

  authenticate(username, password) {
    const hash = await bcrypt.hash(password, 10);
    for (const user of this.users.values()) {
      if (user.username === username && user.password_hash === hash) {
        const token = crypto.randomBytes(32).toString('hex');
        this.tokens.set(token, {
          user_id: user.id,
          created_at: Date.now(),
          expires_at: Date.now() + 24 * 60 * 60 * 1000
        });
        return token;
      }
    }
    return null;
  }

  verify(token) {
    const session = this.tokens.get(token);
    if (!session) return null;
    if (session.expires_at < Date.now()) {
      this.tokens.delete(token);
      return null;
    }
    return this.users.get(session.user_id);
  }

  grantRole(user_id, role) {
    const user = this.users.get(user_id);
    if (user && !user.roles.includes(role)) {
      user.roles.push(role);
    }
  }

  hasRole(token, role) {
    const user = this.verify(token);
    return user && user.roles.includes(role);
  }

  logout(token) {
    this.tokens.delete(token);
  }
}

module.exports = AuthManager;
