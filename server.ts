import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// Admin Panel Password Lock (Server-Side scrypt + HMAC Bearer Tokens)
// ---------------------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, '.data');
const LOCK_CONFIG_PATH = path.join(DATA_DIR, 'admin-lock.json');
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface AdminLockConfig {
  enabled: boolean;
  passwordHash: string | null;
  updatedAt?: string;
}

const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 6;

function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

function readLockConfig(): AdminLockConfig {
  try {
    if (fs.existsSync(LOCK_CONFIG_PATH)) {
      const raw = fs.readFileSync(LOCK_CONFIG_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<AdminLockConfig>;
      return {
        enabled: Boolean(parsed.enabled && parsed.passwordHash),
        passwordHash: typeof parsed.passwordHash === 'string' ? parsed.passwordHash : null,
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : undefined,
      };
    }
  } catch {
    // Fallback to unlocked default if file is unreadable
  }
  return { enabled: false, passwordHash: null };
}

function writeLockConfig(config: AdminLockConfig): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  }
  fs.writeFileSync(LOCK_CONFIG_PATH, JSON.stringify(config, null, 2), {
    encoding: 'utf8',
    mode: 0o600,
  });
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasswordHash(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derived = crypto.scryptSync(password, salt, 64);
    if (keyBuf.length !== derived.length) return false;
    return crypto.timingSafeEqual(keyBuf, derived);
  } catch {
    return false;
  }
}

function verifyEnvPassword(password: string, expectedPasscode: string): boolean {
  const inputDigest = crypto.createHash('sha256').update(password, 'utf8').digest();
  const expectedDigest = crypto.createHash('sha256').update(expectedPasscode, 'utf8').digest();
  return crypto.timingSafeEqual(inputDigest, expectedDigest);
}

function getEffectiveLockState(): {
  locked: boolean;
  hasPassword: boolean;
  managedByEnv: boolean;
  passwordHash: string | null;
} {
  const envPasscode = process.env.ADMIN_PASSCODE?.trim() || '';
  if (envPasscode.length > 0) {
    return {
      locked: true,
      hasPassword: true,
      managedByEnv: true,
      passwordHash: null,
    };
  }
  const fileConfig = readLockConfig();
  return {
    locked: fileConfig.enabled && Boolean(fileConfig.passwordHash),
    hasPassword: Boolean(fileConfig.passwordHash),
    managedByEnv: false,
    passwordHash: fileConfig.passwordHash,
  };
}

function signAdminToken(): { token: string; expiresAt: number } {
  const now = Date.now();
  const expiresAt = now + TOKEN_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({ sub: 'safarihoo-admin', iat: now, exp: expiresAt }),
    'utf8'
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return { token: `${payload}.${sig}`, expiresAt };
}

function verifyAdminToken(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return false;

  const payloadB64 = token.slice(0, dotIdx);
  const sigB64 = token.slice(dotIdx + 1);
  if (!payloadB64 || !sigB64) return false;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(sigB64, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
    };
    return parsed.sub === 'safarihoo-admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function verifyCurrentPassword(password: string): boolean {
  const envPasscode = process.env.ADMIN_PASSCODE?.trim() || '';
  if (envPasscode.length > 0) {
    return verifyEnvPassword(password, envPasscode);
  }
  const fileConfig = readLockConfig();
  if (!fileConfig.passwordHash) return false;
  return verifyPasswordHash(password, fileConfig.passwordHash);
}

app.get('/api/admin/auth/status', (req: Request, res: Response) => {
  const state = getEffectiveLockState();
  const authenticated = state.locked ? verifyAdminToken(req) : true;
  res.json({
    locked: state.locked,
    hasPassword: state.hasPassword,
    managedByEnv: state.managedByEnv,
    authenticated,
  });
});

app.post('/api/admin/auth/unlock', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    res.status(429).json({
      error: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec} secondes.`,
    });
    return;
  }

  const state = getEffectiveLockState();
  if (!state.locked) {
    const session = signAdminToken();
    res.json({ ...session, locked: false });
    return;
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password.length < 1 || password.length > 128) {
    res.status(400).json({ error: 'Mot de passe requis.' });
    return;
  }

  if (!verifyCurrentPassword(password)) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: 'Mot de passe incorrect.' });
    return;
  }

  clearFailedAttempts(ip);
  const session = signAdminToken();
  res.json({
    token: session.token,
    expiresAt: session.expiresAt,
    locked: true,
    authenticated: true,
  });
});

app.post('/api/admin/auth/configure', (req: Request, res: Response) => {
  const state = getEffectiveLockState();
  if (state.managedByEnv) {
    res.status(403).json({
      error: "Le mot de passe est défini via la variable d'environnement ADMIN_PASSCODE.",
    });
    return;
  }

  if (state.locked) {
    const hasValidToken = verifyAdminToken(req);
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const validCurrent = currentPassword.length > 0 && verifyCurrentPassword(currentPassword);
    if (!hasValidToken && !validCurrent) {
      res.status(401).json({ error: 'Authentification admin requise pour modifier le mot de passe.' });
      return;
    }
  }

  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  if (newPassword.length < 6 || newPassword.length > 128) {
    res.status(400).json({
      error: 'Le nouveau mot de passe doit contenir entre 6 et 128 caractères.',
    });
    return;
  }

  const passwordHash = hashPassword(newPassword);
  writeLockConfig({
    enabled: true,
    passwordHash,
    updatedAt: new Date().toISOString(),
  });

  const session = signAdminToken();
  res.json({
    locked: true,
    hasPassword: true,
    managedByEnv: false,
    authenticated: true,
    token: session.token,
    expiresAt: session.expiresAt,
  });
});

app.post('/api/admin/auth/disable', (req: Request, res: Response) => {
  const state = getEffectiveLockState();
  if (state.managedByEnv) {
    res.status(403).json({
      error: "Impossible de désactiver : ADMIN_PASSCODE est défini dans l'environnement.",
    });
    return;
  }

  if (state.locked) {
    const hasValidToken = verifyAdminToken(req);
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const validCurrent = currentPassword.length > 0 && verifyCurrentPassword(currentPassword);
    if (!hasValidToken && !validCurrent) {
      res.status(401).json({ error: 'Authentification admin requise pour désactiver le verrouillage.' });
      return;
    }
  }

  writeLockConfig({
    enabled: false,
    passwordHash: null,
    updatedAt: new Date().toISOString(),
  });

  res.json({
    locked: false,
    hasPassword: false,
    managedByEnv: false,
    authenticated: true,
  });
});

// Dev vs Prod middleware setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Safarihoo server is running on http://0.0.0.0:${PORT}`);
});
