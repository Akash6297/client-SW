import { ADMIN_SCRIPT_URL } from '../config';

const TOKEN_KEY = 'sw_admin_token';
const EXPIRES_KEY = 'sw_admin_expires';

export function getStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (!token || !expiresAt || expiresAt < Date.now()) return null;
  return { token, expiresAt };
}

export function storeSession(token, expiresAt) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

/**
 * Calls a (usually authenticated) action on the admin Apps Script backend.
 * Sends as text/plain to avoid CORS preflight (Apps Script web apps don't
 * support OPTIONS), so the JSON response can still be read.
 */
export async function callAdminApi(action, payload = {}, token = null) {
  if (!ADMIN_SCRIPT_URL || ADMIN_SCRIPT_URL.includes('PASTE_YOUR')) {
    throw new Error('Admin backend not configured. See admin-backend/README.md');
  }

  const session = token || getStoredSession()?.token || null;

  const res = await fetch(ADMIN_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, token: session, payload }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }
  return data.data !== undefined ? data.data : data;
}

/**
 * Calls a public (unauthenticated) GET action — used by the public site
 * (SEO overrides, GA settings) so it works even if the admin isn't logged in.
 */
export async function getPublic(action, params = {}) {
  if (!ADMIN_SCRIPT_URL || ADMIN_SCRIPT_URL.includes('PASTE_YOUR')) {
    return null;
  }

  const query = new URLSearchParams({ action, ...params }).toString();

  try {
    const res = await fetch(`${ADMIN_SCRIPT_URL}?${query}`);
    const data = await res.json();
    if (!data.success) return null;
    return data.data !== undefined ? data.data : data;
  } catch {
    return null;
  }
}
