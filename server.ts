import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAdminAuthRequest } from './lib/adminAuthService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// Admin Panel Password Lock (Shared Firestore + scrypt + HMAC Bearer Tokens)
// ---------------------------------------------------------------------------
app.get('/api/admin/auth/status', async (req: Request, res: Response) => {
  await handleAdminAuthRequest(req, res, 'status');
});

app.post('/api/admin/auth/unlock', async (req: Request, res: Response) => {
  await handleAdminAuthRequest(req, res, 'unlock', req.body);
});

app.post('/api/admin/auth/configure', async (req: Request, res: Response) => {
  await handleAdminAuthRequest(req, res, 'configure', req.body);
});

app.post('/api/admin/auth/disable', async (req: Request, res: Response) => {
  await handleAdminAuthRequest(req, res, 'disable', req.body);
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
