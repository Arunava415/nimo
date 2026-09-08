import AsyncStorage from '@react-native-async-storage/async-storage';

const NS = 'nimo:v1';

export const StorageKeys = {
  account: `${NS}:account`,
  session: `${NS}:session`,
  language: `${NS}:language`,
  profile: (accountId: string) => `${NS}:profile:${accountId}`,
  settings: (accountId: string) => `${NS}:settings:${accountId}`,
  progress: (accountId: string) => `${NS}:progress:${accountId}`,
  reminders: (accountId: string) => `${NS}:reminders:${accountId}`,
};

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // A corrupted value should never brick the app for an elderly user;
    // fall back to defaults and let them carry on.
    return fallback;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — the in-memory state is still correct.
  }
}

export async function remove(...keys: string[]): Promise<void> {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch {
    /* ignore */
  }
}

/** Wipes every NIMO key. Used by "Reset App Data". */
export async function wipeAll(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith(NS));
    if (ours.length) await AsyncStorage.multiRemove(ours);
  } catch {
    /* ignore */
  }
}
