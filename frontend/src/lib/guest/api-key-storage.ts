import { safeFetch } from '../bridgeClient';

export interface BridgeConfigStatus {
  provider: string;
  configured: boolean;
  keyFingerprint?: string;
  source?: string;
}

const STORAGE_KEY = 'hermes_deepseek_api_key';
const TIGER_STORAGE_KEY = 'tiger_apiKey';

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(TIGER_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    localStorage.setItem(TIGER_STORAGE_KEY, trimmed);
    // Transmettre au serveur bridge local 5006 de manière sécurisée
    safeFetch('http://localhost:5006/api/config/apikey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: trimmed, apiKey: trimmed, provider: 'deepseek' }),
    }).catch(() => {});
  } catch {}
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIGER_STORAGE_KEY);
  } catch {}
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return !!key && key.length > 5;
}

export async function checkBridgeConfigStatus(): Promise<BridgeConfigStatus> {
  try {
    const res = await safeFetch('http://localhost:5006/api/config/apikey');
    if (res && res.ok) {
      const data = await res.json();
      
      const localKeyExists = hasApiKey();
      
      return {
        provider: data.provider || 'deepseek',
        configured: localKeyExists || !!data.hasKey || !!data.configured || !!data.hasAnyKey,
        keyFingerprint: data.keyFingerprint || (data.apiKey ? data.apiKey.slice(-4) : (getApiKey()?.slice(-4))),
        source: localKeyExists ? 'local-and-bridge' : (data.source || 'bridge-5006')
      };
    }
  } catch {}

  const hasLocal = hasApiKey();
  const localKey = getApiKey();
  return {
    provider: 'deepseek',
    configured: hasLocal,
    keyFingerprint: localKey ? localKey.slice(-4) : undefined,
    source: 'local-storage'
  };
}

export async function resolveApiKey(): Promise<string | null> {
  const localKey = getApiKey();
  if (localKey && localKey.length > 5) {
    return localKey;
  }

  try {
    const res = await safeFetch('http://localhost:5006/api/config/apikey');
    if (res && res.ok) {
      const data = await res.json();
      if ((data.hasKey || data.hasAnyKey || data.configured) && data.apiKey) {
        setApiKey(data.apiKey);
        return data.apiKey;
      }
    }
  } catch {}

  return null;
}

