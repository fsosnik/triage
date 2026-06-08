const AuthManager = require('../src/security/authentication.js');

describe('Security: AuthManager', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthManager();
  });

  test('createUser hashes password', async () => {
    const user = await auth.createUser('alice', 'password123');
    expect(user.username).toBe('alice');
    expect(user.id).toBeDefined();
    
    const stored = auth.users.get(user.id);
    expect(stored.passwordHash).not.toBe('password123');
  });

  test('authenticate returns JWT tokens', async () => {
    await auth.createUser('bob', 'secure999');
    const result = await auth.authenticate('bob', 'secure999');
    
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.expiresIn).toBe('15m');
  });

  test('verify validates JWT token', async () => {
    const user = await auth.createUser('charlie', 'pass1234');
    const { accessToken } = await auth.authenticate('charlie', 'pass1234');
    
    const verified = auth.verify(accessToken);
    expect(verified.userId).toBe(user.id);
    expect(verified.username).toBe('charlie');
  });

  test('invalid password rejected', async () => {
    await auth.createUser('dave', 'correct123');
    
    try {
      await auth.authenticate('dave', 'wrong123');
      fail('Should throw');
    } catch (e) {
      expect(e.message).toBe('Invalid password');
    }
  });

  test('refreshToken generates new access token', async () => {
    await auth.createUser('eve', 'test1234');
    const { refreshToken } = await auth.authenticate('eve', 'test1234');
    
    const newToken = auth.refreshAccessToken(refreshToken);
    expect(newToken.accessToken).toBeDefined();
    expect(newToken.expiresIn).toBe('15m');
  });
});
