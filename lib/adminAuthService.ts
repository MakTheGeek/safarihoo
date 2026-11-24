import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore/lite';

interface FirebaseAppletConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface AdminLockState {
  locked: boolean;
  hasPassword: boolean;
  managedByEnv: boolean;
  passwordHash: string | null;
  docExists: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(process.cwd(), '.data');
const LOCK_CONFIG_PATH = path.join(DATA_DIR, 'admin-lock.json');

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 6;
const MAX_JSON_BODY_BYTES = 64 * 1024;

const failedAttempts = new Map<string, { count: number; resetAt: number }>();

let cachedDb: Firestore | null = null;

function loadFirebaseConfig(): FirebaseAppletConfig | null {
  const candidates = [
    path.resolve(process.cwd(), 'firebase-applet-config.json'),
    path.resolve(__dirname, '../firebase-applet-config.json'),
    path.resolve(__dirname, '../../firebase-applet-config.json'),
    path.resolve(__dirname, '../../../firebase-applet-config.json'),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw) as Partial<FirebaseAppletConfig>;
        if (parsed.projectId && parsed.apiKey && parsed.appId) {
          return parsed as FirebaseAppletConfig;
        }
      }
    } catch {
      // Continue trying next candidate path
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY && process.env.FIREBASE_APP_ID) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      apiKey: process.env.FIREBASE_API_KEY,
      appId: process.env.FIREBASE_APP_ID,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID,
    };
  }

  return null;
}

function getServerFirestore(): Firestore | null {
  if (cachedDb) return cachedDb;
  const config = loadFirebaseConfig();
  if (!config) return null;

  const appName = 'safarihoo-server-auth';
  const existingApp = getApps().find((a) => a.name === appName);
  const app = existingApp || (getApps().length === 0 ? initializeApp(config, appName) : getApp(existingApp ? appName : undefined));
  const db = config.firestoreDatabaseId
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);
  cachedDb = db;
  return db;
}

function getClientIp(req: IncomingMessage): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return fwd[0].split(',')[0].trim();
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

function readLocalLockFallback(): { enabled: boolean; passwordHash: string | null } {
  try {
    if (fs.existsSync(LOCK_CONFIG_PATH)) {
      const raw = fs.readFileSync(LOCK_CONFIG_PATH, 'utf8');
      const parsed = JSON.parse(raw) as { enabled?: unknown; passwordHash?: unknown };
      const hash = typeof parsed.passwordHash === 'string' && parsed.passwordHash.length > 0 ? parsed.passwordHash : null;
      return {
        enabled: Boolean(parsed.enabled && hash),
        passwordHash: hash,
      };
    }
  } catch {
    // Ignore local read fallback failure
  }
  return { enabled: false, passwordHash: null };
}

function writeLocalLockMirror(enabled: boolean, passwordHash: string): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
    }
    fs.writeFileSync(
      LOCK_CONFIG_PATH,
      JSON.stringify(
        {
          enabled,
          passwordHash: enabled ? passwordHash : null,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      { encoding: 'utf8', mode: 0o600 }
    );
  } catch {
    // Read-only filesystems (e.g., Vercel serverless /var/task) ignore local mirror safely
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
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

export async function getEffectiveLockState(): Promise<AdminLockState> {
  const envPasscode = process.env.ADMIN_PASSCODE?.trim() || '';
  if (envPasscode.length > 0) {
    return {
      locked: true,
      hasPassword: true,
      managedByEnv: true,
      passwordHash: null,
      docExists: false,
    };
  }

  const db = getServerFirestore();
  if (db) {
    try {
      const lockRef = doc(db, 'site_settings', 'admin_lock');
      const snap = await getDoc(lockRef);
      if (snap.exists()) {
        const data = snap.data() as { enabled?: unknown; passwordHash?: unknown };
        const hash =
          typeof data.passwordHash === 'string' && data.passwordHash.length > 0
            ? data.passwordHash
            : null;
        return {
          locked: Boolean(data.enabled && hash),
          hasPassword: Boolean(hash),
          managedByEnv: false,
          passwordHash: hash,
          docExists: true,
        };
      }
      const local = readLocalLockFallback();
      if (local.enabled && local.passwordHash) {
        return {
          locked: true,
          hasPassword: true,
          managedByEnv: false,
          passwordHash: local.passwordHash,
          docExists: false,
        };
      }
      return {
        locked: false,
        hasPassword: false,
        managedByEnv: false,
        passwordHash: null,
        docExists: false,
      };
    } catch (err) {
      console.warn('Firestore admin_lock read failed, falling back to local config:', err);
    }
  }

  const fallback = readLocalLockFallback();
  return {
    locked: fallback.enabled,
    hasPassword: Boolean(fallback.passwordHash),
    managedByEnv: false,
    passwordHash: fallback.passwordHash,
    docExists: false,
  };
}

async function persistLockState(
  enabled: boolean,
  passwordHash: string,
  docExistsHint: boolean
): Promise<void> {
  const db = getServerFirestore();
  if (db) {
    const lockRef = doc(db, 'site_settings', 'admin_lock');
    if (docExistsHint) {
      await updateDoc(lockRef, {
        enabled,
        passwordHash: enabled ? passwordHash : '',
        updatedAt: serverTimestamp(),
      });
    } else {
      const latestSnap = await getDoc(lockRef);
      if (latestSnap.exists()) {
        await updateDoc(lockRef, {
          enabled,
          passwordHash: enabled ? passwordHash : '',
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(lockRef, {
          enabled,
          passwordHash: enabled ? passwordHash : '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
    writeLocalLockMirror(enabled, passwordHash);
    return;
  }

  writeLocalLockMirror(enabled, passwordHash);
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

function verifyAdminToken(req: IncomingMessage): boolean {
  const authHeader = req.headers.authorization;
  const headerVal = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!headerVal || !headerVal.startsWith('Bearer ')) return false;
  const token = headerVal.slice(7).trim();
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
    return (
      parsed.sub === 'safarihoo-admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

function verifyAgainstState(password: string, state: AdminLockState): boolean {
  if (state.managedByEnv) {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim() || '';
    return envPasscode.length > 0 && verifyEnvPassword(password, envPasscode);
  }
  if (!state.passwordHash) return false;
  return verifyPasswordHash(password, state.passwordHash);
}

async function readJsonBody(req: IncomingMessage, preParsed?: unknown): Promise<Record<string, unknown>> {
  if (preParsed && typeof preParsed === 'object' && !Array.isArray(preParsed)) {
    return preParsed as Record<string, unknown>;
  }
  if (typeof preParsed === 'string' && preParsed.length > 0) {
    try {
      const parsed = JSON.parse(preParsed);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    const finish = (val: Record<string, unknown>) => {
      if (!settled) {
        settled = true;
        resolve(val);
      }
    };

    req.on('data', (chunk: Buffer | string) => {
      const buf = typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk;
      total += buf.length;
      if (total > MAX_JSON_BODY_BYTES) {
        finish({});
        req.destroy();
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      if (chunks.length === 0) {
        finish({});
        return;
      }
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const parsed = JSON.parse(raw);
        finish(
          parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : {}
        );
      } catch {
        finish({});
      }
    });

    req.on('error', () => finish({}));
  });
}

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.end(JSON.stringify(payload));
}

export async function handleAdminAuthRequest(
  req: IncomingMessage,
  res: ServerResponse,
  action: string,
  preParsedBody?: unknown
): Promise<void> {
  const method = (req.method || 'GET').toUpperCase();

  try {
    if (action === 'status') {
      if (method !== 'GET') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      const state = await getEffectiveLockState();
      const authenticated = state.locked ? verifyAdminToken(req) : true;
      sendJson(res, 200, {
        locked: state.locked,
        hasPassword: state.hasPassword,
        managedByEnv: state.managedByEnv,
        authenticated,
      });
      return;
    }

    if (action === 'unlock') {
      if (method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      const ip = getClientIp(req);
      const rate = checkRateLimit(ip);
      if (!rate.allowed) {
        sendJson(res, 429, {
          error: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec} secondes.`,
        });
        return;
      }

      const state = await getEffectiveLockState();
      if (!state.locked) {
        const session = signAdminToken();
        sendJson(res, 200, { ...session, locked: false, authenticated: true });
        return;
      }

      const body = await readJsonBody(req, preParsedBody);
      const password = typeof body.password === 'string' ? body.password : '';
      if (password.length < 1 || password.length > 128) {
        sendJson(res, 400, { error: 'Mot de passe requis.' });
        return;
      }

      if (!verifyAgainstState(password, state)) {
        recordFailedAttempt(ip);
        sendJson(res, 401, { error: 'Mot de passe incorrect.' });
        return;
      }

      clearFailedAttempts(ip);
      const session = signAdminToken();
      sendJson(res, 200, {
        token: session.token,
        expiresAt: session.expiresAt,
        locked: true,
        authenticated: true,
      });
      return;
    }

    if (action === 'configure') {
      if (method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      const state = await getEffectiveLockState();
      if (state.managedByEnv) {
        sendJson(res, 403, {
          error: "Le mot de passe est défini via la variable d'environnement ADMIN_PASSCODE.",
        });
        return;
      }

      const body = await readJsonBody(req, preParsedBody);

      if (state.locked) {
        const ip = getClientIp(req);
        const rate = checkRateLimit(ip);
        if (!rate.allowed) {
          sendJson(res, 429, {
            error: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec} secondes.`,
          });
          return;
        }
        const hasValidToken = verifyAdminToken(req);
        const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
        const validCurrent = currentPassword.length > 0 && verifyAgainstState(currentPassword, state);
        if (!hasValidToken && !validCurrent) {
          if (currentPassword.length > 0) recordFailedAttempt(ip);
          sendJson(res, 401, {
            error: 'Authentification admin requise : saisissez le mot de passe actuel.',
          });
          return;
        }
        clearFailedAttempts(ip);
      }

      const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
      if (newPassword.length < 6 || newPassword.length > 128) {
        sendJson(res, 400, {
          error: 'Le nouveau mot de passe doit contenir entre 6 et 128 caractères.',
        });
        return;
      }

      const passwordHash = hashPassword(newPassword);
      await persistLockState(true, passwordHash, state.docExists);

      const session = signAdminToken();
      sendJson(res, 200, {
        locked: true,
        hasPassword: true,
        managedByEnv: false,
        authenticated: true,
        token: session.token,
        expiresAt: session.expiresAt,
      });
      return;
    }

    if (action === 'disable') {
      if (method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      const state = await getEffectiveLockState();
      if (state.managedByEnv) {
        sendJson(res, 403, {
          error: "Impossible de désactiver : ADMIN_PASSCODE est défini dans l'environnement.",
        });
        return;
      }

      const body = await readJsonBody(req, preParsedBody);

      if (state.locked) {
        const ip = getClientIp(req);
        const rate = checkRateLimit(ip);
        if (!rate.allowed) {
          sendJson(res, 429, {
            error: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec} secondes.`,
          });
          return;
        }
        const hasValidToken = verifyAdminToken(req);
        const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
        const validCurrent = currentPassword.length > 0 && verifyAgainstState(currentPassword, state);
        if (!hasValidToken && !validCurrent) {
          if (currentPassword.length > 0) recordFailedAttempt(ip);
          sendJson(res, 401, {
            error: 'Authentification admin requise : saisissez le mot de passe actuel.',
          });
          return;
        }
        clearFailedAttempts(ip);
      }

      await persistLockState(false, '', state.docExists);

      sendJson(res, 200, {
        locked: false,
        hasPassword: false,
        managedByEnv: false,
        authenticated: true,
      });
      return;
    }

    sendJson(res, 404, { error: 'Unknown admin auth endpoint.' });
  } catch (err) {
    console.error('Admin auth handler error:', err);
    sendJson(res, 500, {
      error: 'Erreur serveur lors de la communication avec Firebase.',
    });
  }
}
