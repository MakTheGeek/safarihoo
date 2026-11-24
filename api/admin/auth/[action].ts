import type { IncomingMessage, ServerResponse } from 'http';
import { handleAdminAuthRequest } from '../../../lib/adminAuthService.ts';

type VercelLikeRequest = IncomingMessage & {
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

function resolveAction(req: VercelLikeRequest): string {
  const qAction = req.query?.action;
  if (typeof qAction === 'string' && qAction.length > 0) {
    return qAction;
  }
  if (Array.isArray(qAction) && qAction[0]) {
    return qAction[0];
  }
  try {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || '';
  } catch {
    return '';
  }
}

export default async function handler(
  req: VercelLikeRequest,
  res: ServerResponse
): Promise<void> {
  const action = resolveAction(req);
  await handleAdminAuthRequest(req, res, action, req.body);
}
