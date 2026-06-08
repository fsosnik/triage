const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const TOKEN_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

class AuthManager {
  constructor() {
    this.users = new Map(); // id → {username, passwordHash, roles, createdAt}
    this.refreshTokens = new Map(); // refreshToken → userId
  }

  async createUser(username, password, roles = []) {
    // Validar
    if (!username || !password) throw new Error('Username and password required');
    if (password.length < 8) throw new Error('Password must be 8+ chars');

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}`;

    this.users.set(id, {
      username,
      passwordHash,
      roles,
      createdAt: new Date()
    });

    return { id, username };
  }

  async authenticate(username, password) {
    // Buscar usuario
    let userId, user;
    for (const [id, u] of this.users) {
      if (u.username === username) {
        userId = id;
        user = u;
        break;
      }
    }

    if (!user) throw new Error('User not found');

    // Validar password con bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid password');

    // Generar tokens
    const accessToken = jwt.sign(
      { userId, username, roles: user.roles },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );

    this.refreshTokens.set(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: '15m',
      user: { id: userId, username, roles: user.roles }
    };
  }

  verify(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = this.users.get(decoded.userId);
      return user ? { ...decoded, ...user } : null;
    } catch (error) {
      return null;
    }
  }

  refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const userId = this.refreshTokens.get(refreshToken);

      if (!userId || userId !== decoded.userId) {
        throw new Error('Invalid refresh token');
      }

      const user = this.users.get(userId);
      if (!user) throw new Error('User not found');

      const newAccessToken = jwt.sign(
        { userId, username: user.username, roles: user.roles },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      return { accessToken: newAccessToken, expiresIn: '15m' };
    } catch (error) {
      throw new Error('Refresh failed: ' + error.message);
    }
  }

  revokeToken(refreshToken) {
    this.refreshTokens.delete(refreshToken);
    return true;
  }

  grantRole(userId, role) {
    const user = this.users.get(userId);
    if (user && !user.roles.includes(role)) {
      user.roles.push(role);
    }
  }
}

module.exports = AuthManager;
