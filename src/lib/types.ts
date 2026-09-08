import type { LanguageCode } from '../i18n/languages';
import type { TextScaleKey } from '../theme';

export type Gender = 'male' | 'female' | 'unspecified';

export type Account = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  salt: string;
  pinHash: string;
  createdAt: number;
  onboarded: boolean;
};

export type ComfortLevel = 'very' | 'comfortable' | 'sometimes' | 'often' | 'noSay';
export type ActivityLevel = 'very' | 'active' | 'moderate' | 'less';
export type Difficulty = 'relaxed' | 'easy' | 'moderate' | 'challenging';
export type SessionMinutes = 5 | 10 | 15 | 20;

export type ActivityTag =
  | 'memory'
  | 'picture'
  | 'word'
  | 'puzzle'
  | 'music'
  | 'story'
  | 'number'
  | 'challenge';

export type Profile = {
  memoryComfort: ComfortLevel;
  focus: ComfortLevel;
  activity: ActivityLevel;
  favourites: ActivityTag[];
  sessionMinutes: SessionMinutes;
  difficulty: Difficulty;
};

export type Settings = {
  language: LanguageCode;
  textScale: TextScaleKey;
  soundsEnabled: boolean;
};

/** One completed play of one game. */
export type PlayRecord = {
  gameId: string;
  /** 0..100 */
  score: number;
  domain: CognitiveDomain;
  playedAt: number;
};

export type CognitiveDomain = 'memory' | 'attention' | 'language' | 'problem';

export type Progress = {
  plays: PlayRecord[];
  bestScores: Record<string, number>;
  lastActiveAt: number | null;
  /** Consecutive days with at least one play. */
  streak: number;
  streakDate: string | null;
};

export type ReminderCategory = 'medication' | 'appointment' | 'task' | 'hydration' | 'exercise';

export type Reminder = {
  id: string;
  category: ReminderCategory;
  title: string;
  /** 24h "HH:MM". */
  time: string;
  note: string;
  done: boolean;
};

export const DEFAULT_PROFILE: Profile = {
  memoryComfort: 'comfortable',
  focus: 'comfortable',
  activity: 'moderate',
  favourites: ['memory', 'picture'],
  sessionMinutes: 10,
  difficulty: 'easy',
};

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  textScale: 'normal',
  soundsEnabled: true,
};

export const DEFAULT_PROGRESS: Progress = {
  plays: [],
  bestScores: {},
  lastActiveAt: null,
  streak: 0,
  streakDate: null,
};

export const STARTER_REMINDERS: Reminder[] = [
  {
    id: 'r-medication',
    category: 'medication',
    title: 'Take your medication',
    time: '10:00',
    note: 'After breakfast',
    done: false,
  },
  {
    id: 'r-hydration',
    category: 'hydration',
    title: 'Drink warm water',
    time: '18:00',
    note: 'Evening hydration',
    done: false,
  },
  {
    id: 'r-exercise',
    category: 'exercise',
    title: 'Play a memory game',
    time: '20:00',
    note: 'Relaxation & calm focus',
    done: false,
  },
];
