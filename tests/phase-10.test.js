const AuthManager = require('../src/security/authentication');
const Encryptor = require('../src/security/encryption');
const AuditLog = require('../src/security/audit-log');

describe('Phase 10: Advanced Security', () => {
  
  test('AuthManager should create user', () => {
    const auth = new AuthManager();
    const userId = auth.createUser('user1', 'pass123');
    expect(userId).toBeDefined();
  });

  test('AuthManager should authenticate', () => {
    const auth = new AuthManager();
    auth.createUser('user1', 'pass123');
    const token = auth.authenticate('user1', 'pass123');
    expect(token).toBeDefined();
  });

  test('AuthManager should verify token', () => {
    const auth = new AuthManager();
    auth.createUser('user1', 'pass123');
    const token = auth.authenticate('user1', 'pass123');
    const user = auth.verify(token);
    expect(user.username).toBe('user1');
  });

  test('AuthManager should grant roles', () => {
    const auth = new AuthManager();
    const userId = auth.createUser('user1', 'pass123');
    auth.grantRole(userId, 'admin');
    const user = auth.users.get(userId);
    expect(user.roles).toContain('admin');
  });

  test('Encryptor should encrypt and decrypt', () => {
    const enc = new Encryptor('secret-key');
    const original = 'sensitive data';
    const encrypted = enc.encrypt(original);
    const decrypted = enc.decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  test('AuditLog should record events', () => {
    const audit = new AuditLog();
    audit.logSuccess('user1', 'login', 'auth-system');
    expect(audit.logs.length).toBe(1);
  });

  test('AuditLog should get user logs', () => {
    const audit = new AuditLog();
    audit.logSuccess('user1', 'login', 'auth');
    audit.logSuccess('user2', 'logout', 'auth');
    const logs = audit.getLog('user1');
    expect(logs.length).toBe(1);
  });
});
