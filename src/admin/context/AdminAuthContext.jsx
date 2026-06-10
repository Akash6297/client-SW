import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { callAdminApi, getStoredSession, storeSession, clearSession } from '../api/client';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const existing = getStoredSession();
    if (!existing) {
      setSession(null);
      setChecking(false);
      return;
    }
    // Confirm the session is still valid server-side (not just locally).
    callAdminApi('validateSession', {}, existing.token)
      .then(() => setSession(existing))
      .catch(() => {
        clearSession();
        setSession(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (password) => {
    const data = await callAdminApi('login', { password }, null);
    storeSession(data.token, data.expiresAt);
    setSession({ token: data.token, expiresAt: data.expiresAt });
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await callAdminApi('logout', {}, session?.token);
    } catch {
      // ignore — clear locally regardless
    }
    clearSession();
    setSession(null);
  }, [session]);

  const value = {
    isAuthenticated: !!session,
    token: session?.token || null,
    checking,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
