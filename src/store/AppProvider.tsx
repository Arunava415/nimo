import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_LANGUAGE, type LanguageCode } from '../i18n/languages';
import { DICTIONARIES, en, type StringKey } from '../i18n/strings';
import { hashPin, isValidPin, makeSalt, verifyPin } from '../lib/pin';
import { readJSON, remove, StorageKeys, wipeAll, writeJSON } from '../lib/storage';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  STARTER_REMINDERS,
  type Account,
  type CognitiveDomain,
  type Profile,
  type Progress,
  type Reminder,
  type Settings,
} from '../lib/types';
import { textScales } from '../theme';

type AuthResult = { ok: true } | { ok: false; error: StringKey };

type AppValue = {
  ready: boolean;

  // Auth
  account: Account | null;
  /** The account on this device even while signed out — used for the "Welcome back, X" greeting. */
  storedAccount: Account | null;
  signedIn: boolean;
  hasAccount: boolean;
  signUp: (input: { name: string; pin: string; confirmPin: string }) => Promise<AuthResult>;
  signIn: (pin: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateAccount: (patch: Partial<Account>) => Promise<void>;
  resetApp: () => Promise<void>;

  // Preferences
  profile: Profile;
  saveProfile: (patch: Partial<Profile>) => Promise<void>;
  settings: Settings;
  saveSettings: (patch: Partial<Settings>) => Promise<void>;

  // Progress
  progress: Progress;
  recordPlay: (input: { gameId: string; score: number; domain: CognitiveDomain }) => Promise<void>;

  // Reminders
  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, 'id' | 'done'>) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;

  // i18n + a11y
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  scale: number;
};

const AppContext = createContext<AppValue | null>(null);

const todayKey = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [storedAccount, setStoredAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [reminders, setReminders] = useState<Reminder[]>(STARTER_REMINDERS);

  // Language is remembered outside the account so the picker still works
  // before anyone has signed up.
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  const loadForAccount = useCallback(async (acc: Account) => {
    const [p, s, pr, rm] = await Promise.all([
      readJSON<Profile>(StorageKeys.profile(acc.id), DEFAULT_PROFILE),
      readJSON<Settings>(StorageKeys.settings(acc.id), DEFAULT_SETTINGS),
      readJSON<Progress>(StorageKeys.progress(acc.id), DEFAULT_PROGRESS),
      readJSON<Reminder[]>(StorageKeys.reminders(acc.id), STARTER_REMINDERS),
    ]);
    setProfile({ ...DEFAULT_PROFILE, ...p });
    setSettings({ ...DEFAULT_SETTINGS, ...s });
    setProgress({ ...DEFAULT_PROGRESS, ...pr });
    setReminders(rm);
    setLanguageState(s.language ?? DEFAULT_LANGUAGE);
  }, []);

  // Boot: restore the saved account and, if a session is open, sign it in.
  useEffect(() => {
    (async () => {
      const [acc, session, lang] = await Promise.all([
        readJSON<Account | null>(StorageKeys.account, null),
        readJSON<{ accountId: string } | null>(StorageKeys.session, null),
        readJSON<LanguageCode | null>(StorageKeys.language, null),
      ]);
      if (lang) setLanguageState(lang);
      setStoredAccount(acc);
      if (acc && session?.accountId === acc.id) {
        setAccount(acc);
        await loadForAccount(acc);
      }
      setReady(true);
    })();
  }, [loadForAccount]);

  const persistAccount = useCallback(async (acc: Account) => {
    setAccount(acc);
    setStoredAccount(acc);
    await writeJSON(StorageKeys.account, acc);
  }, []);

  const signUp = useCallback<AppValue['signUp']>(
    async ({ name, pin, confirmPin }) => {
      if (!name.trim()) return { ok: false, error: 'authErrNameRequired' };
      if (!isValidPin(pin)) return { ok: false, error: 'authErrPinLength' };
      if (pin !== confirmPin) return { ok: false, error: 'authErrPinMismatch' };

      const salt = makeSalt();
      const acc: Account = {
        id: `acc_${Date.now().toString(36)}`,
        name: name.trim(),
        age: 68,
        gender: 'unspecified',
        avatar: 'gentle-elder',
        salt,
        pinHash: await hashPin(pin, salt),
        createdAt: Date.now(),
        onboarded: false,
      };

      await persistAccount(acc);
      await writeJSON(StorageKeys.session, { accountId: acc.id });
      await writeJSON(StorageKeys.settings(acc.id), { ...DEFAULT_SETTINGS, language });
      await loadForAccount(acc);
      return { ok: true };
    },
    [language, loadForAccount, persistAccount],
  );

  const signIn = useCallback<AppValue['signIn']>(
    async (pin) => {
      if (!storedAccount) return { ok: false, error: 'authErrNoAccount' };
      if (!isValidPin(pin)) return { ok: false, error: 'authErrPinLength' };
      const ok = await verifyPin(pin, storedAccount.salt, storedAccount.pinHash);
      if (!ok) return { ok: false, error: 'authErrPinWrong' };

      setAccount(storedAccount);
      await writeJSON(StorageKeys.session, { accountId: storedAccount.id });
      await loadForAccount(storedAccount);
      return { ok: true };
    },
    [loadForAccount, storedAccount],
  );

  const signOut = useCallback(async () => {
    // Only the session is cleared. The account and everything it owns stays on
    // the device so signing back in restores the same progress.
    await remove(StorageKeys.session);
    setAccount(null);
    setProfile(DEFAULT_PROFILE);
    setProgress(DEFAULT_PROGRESS);
    setReminders(STARTER_REMINDERS);
  }, []);

  const updateAccount = useCallback<AppValue['updateAccount']>(
    async (patch) => {
      if (!account) return;
      await persistAccount({ ...account, ...patch });
    },
    [account, persistAccount],
  );

  const resetApp = useCallback(async () => {
    await wipeAll();
    setAccount(null);
    setStoredAccount(null);
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
    setProgress(DEFAULT_PROGRESS);
    setReminders(STARTER_REMINDERS);
    setLanguageState(DEFAULT_LANGUAGE);
  }, []);

  const saveProfile = useCallback<AppValue['saveProfile']>(
    async (patch) => {
      const next = { ...profile, ...patch };
      setProfile(next);
      if (account) await writeJSON(StorageKeys.profile(account.id), next);
    },
    [account, profile],
  );

  const saveSettings = useCallback<AppValue['saveSettings']>(
    async (patch) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      if (patch.language) {
        setLanguageState(patch.language);
        await writeJSON(StorageKeys.language, patch.language);
      }
      if (account) await writeJSON(StorageKeys.settings(account.id), next);
    },
    [account, settings],
  );

  const setLanguage = useCallback<AppValue['setLanguage']>(
    async (code) => {
      setLanguageState(code);
      await writeJSON(StorageKeys.language, code);
      const next = { ...settings, language: code };
      setSettings(next);
      if (account) await writeJSON(StorageKeys.settings(account.id), next);
    },
    [account, settings],
  );

  const recordPlay = useCallback<AppValue['recordPlay']>(
    async ({ gameId, score, domain }) => {
      if (!account) return;
      const now = Date.now();
      const today = todayKey();

      setProgress((prev) => {
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        const streak =
          prev.streakDate === today
            ? prev.streak
            : prev.streakDate === yesterday
              ? prev.streak + 1
              : 1;

        const next: Progress = {
          plays: [...prev.plays, { gameId, score, domain, playedAt: now }].slice(-500),
          bestScores: {
            ...prev.bestScores,
            [gameId]: Math.max(prev.bestScores[gameId] ?? 0, score),
          },
          lastActiveAt: now,
          streak,
          streakDate: today,
        };
        void writeJSON(StorageKeys.progress(account.id), next);
        return next;
      });
    },
    [account],
  );

  const persistReminders = useCallback(
    async (next: Reminder[]) => {
      setReminders(next);
      if (account) await writeJSON(StorageKeys.reminders(account.id), next);
    },
    [account],
  );

  const addReminder = useCallback<AppValue['addReminder']>(
    async (r) => {
      await persistReminders([
        ...reminders,
        { ...r, id: `r_${Date.now().toString(36)}`, done: false },
      ]);
    },
    [persistReminders, reminders],
  );

  const toggleReminder = useCallback<AppValue['toggleReminder']>(
    async (id) => {
      await persistReminders(reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
    },
    [persistReminders, reminders],
  );

  const deleteReminder = useCallback<AppValue['deleteReminder']>(
    async (id) => {
      await persistReminders(reminders.filter((r) => r.id !== id));
    },
    [persistReminders, reminders],
  );

  const t = useCallback<AppValue['t']>(
    (key, vars) => {
      const dict = DICTIONARIES[language] ?? {};
      let out = dict[key] ?? en[key] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.split(`{${k}}`).join(String(v));
        }
      }
      return out;
    },
    [language],
  );

  const value = useMemo<AppValue>(
    () => ({
      ready,
      account,
      storedAccount,
      signedIn: !!account,
      hasAccount: !!storedAccount,
      signUp,
      signIn,
      signOut,
      updateAccount,
      resetApp,
      profile,
      saveProfile,
      settings,
      saveSettings,
      progress,
      recordPlay,
      reminders,
      addReminder,
      toggleReminder,
      deleteReminder,
      language,
      setLanguage,
      t,
      scale: textScales[settings.textScale] ?? 1,
    }),
    [
      account,
      addReminder,
      deleteReminder,
      language,
      profile,
      progress,
      ready,
      recordPlay,
      reminders,
      resetApp,
      saveProfile,
      saveSettings,
      setLanguage,
      settings,
      signIn,
      signOut,
      signUp,
      storedAccount,
      t,
      toggleReminder,
      updateAccount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
