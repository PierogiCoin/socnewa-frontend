import { useState, useEffect, useCallback } from 'react';
import type { FormData } from '../types';
import { SESSION_CONFIG } from '../config/appConfig';

interface StoredSession {
  data: Partial<FormData>;
  timestamp: string;
  url: string;
  id: string;
}

const { STORAGE_KEY: SESSION_KEY, EXPIRY_HOURS: SESSION_EXPIRY_HOURS } = SESSION_CONFIG;

export const useSessionRecovery = () => {
  const [hasRecoverableSession, setHasRecoverableSession] = useState(false);
  const [sessionData, setSessionData] = useState<StoredSession | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setHasRecoverableSession(true);
      setSessionData(session);
    }
  }, []);

  const saveSession = useCallback((data: Partial<FormData>) => {
    // Only save if there's meaningful content
    const hasContent = data.topic?.trim() || data.audience?.trim() || data.keywords?.trim();
    
    if (!hasContent) {
      return;
    }

    const session: StoredSession = {
      data,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      id: `session-${Date.now()}`
    };
    
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  const getSession = useCallback((): StoredSession | null => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const session: StoredSession = JSON.parse(stored);
      const age = Date.now() - new Date(session.timestamp).getTime();
      const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

      // Session expires after configured hours
      if (age > maxAge) {
        clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      return null;
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
      setHasRecoverableSession(false);
      setSessionData(null);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, []);

  const getSessionAge = useCallback((session: StoredSession): string => {
    const age = Date.now() - new Date(session.timestamp).getTime();
    const minutes = Math.floor(age / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }, []);

  return {
    hasRecoverableSession,
    sessionData,
    saveSession,
    getSession,
    clearSession,
    getSessionAge
  };
};

// Hook for auto-saving with debounce
export const useAutoSaveSession = (
  formData: Partial<FormData>,
  delay: number = SESSION_CONFIG.AUTO_SAVE_DELAY_MS
) => {
  const { saveSession } = useSessionRecovery();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Debounce the save
    setIsSaving(true);
    const timer = setTimeout(() => {
      saveSession(formData);
      setLastSaved(new Date());
      setIsSaving(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsSaving(false);
    };
  }, [formData, delay, saveSession]);

  return { lastSaved, isSaving };
};

// Hook for warning on page leave
export const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
};
