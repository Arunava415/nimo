export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'mni' | 'kha' | 'lus' | 'nag';

export type LanguageMeta = {
  code: LanguageCode;
  /** Name as shown in the picker, in the language's own script where possible. */
  label: string;
  /** Two-or-three character badge shown in the round chip. */
  badge: string;
  /** BCP-47 tag handed to expo-speech. */
  speechTag: string;
  /** The word "help", spoken aloud by the speaker button on the picker. */
  helpWord: string;
};

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', badge: 'Aa', speechTag: 'en-IN', helpWord: 'Help' },
  { code: 'hi', label: 'हिंदी (Hindi)', badge: 'अ', speechTag: 'hi-IN', helpWord: 'सहायता' },
  { code: 'as', label: 'অসমীয়া (Assamese)', badge: 'অ', speechTag: 'as-IN', helpWord: 'সহায়তা' },
  { code: 'bn', label: 'বাংলা (Bengali)', badge: 'বা', speechTag: 'bn-IN', helpWord: 'সহায়তা' },
  { code: 'mni', label: 'মণিপুরী (Manipuri/Meitei)', badge: 'ম', speechTag: 'bn-IN', helpWord: 'সহায়তা' },
  { code: 'kha', label: 'Khasi', badge: 'O', speechTag: 'en-IN', helpWord: 'Jingiarap' },
  { code: 'lus', label: 'Mizo ṭawng (Mizo)', badge: 'Mz', speechTag: 'en-IN', helpWord: 'Ṭanpuina' },
  { code: 'nag', label: 'Nagamese', badge: 'Ng', speechTag: 'as-IN', helpWord: 'Modot' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';
