import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Button, Card, Ministry, Screen, T } from '../src/components/ui';
import { LANGUAGES, type LanguageMeta } from '../src/i18n/languages';
import { useApp } from '../src/store/AppProvider';
import { colors, radius, spacing } from '../src/theme';

export default function LanguagePicker() {
  const router = useRouter();
  const { t, language, setLanguage, hasAccount, signedIn, settings } = useApp();

  const speak = (lang: LanguageMeta) => {
    if (!settings.soundsEnabled) return;
    Speech.stop();
    Speech.speak(lang.helpWord, { language: lang.speechTag });
  };

  const onContinue = () => {
    // Reached from the profile screen while signed in: just go back.
    if (signedIn) {
      router.back();
      return;
    }
    router.push(hasAccount ? '/sign-in' : '/sign-up');
  };

  return (
    <Screen>
      <T size={26} weight="800" align="center">
        {t('languageTitle')}
      </T>
      <T size={15} color={colors.muted} align="center">
        {t('languageSubtitle')}
      </T>

      <View style={{ gap: spacing.md }}>
        {LANGUAGES.map((lang) => {
          const selected = lang.code === language;
          return (
            <Card
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              accessibilityLabel={lang.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                borderColor: selected ? colors.teal : colors.tealLine,
                borderWidth: selected ? 2 : 1,
                backgroundColor: selected ? colors.tealMist : colors.surface,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.sm,
                  backgroundColor: colors.tealMist,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.tealSoft,
                }}
              >
                <T size={17} weight="700" color={colors.teal}>
                  {lang.badge}
                </T>
              </View>

              <T size={17} weight="600" style={{ flex: 1 }}>
                {lang.label}
              </T>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('help')} — ${lang.label}`}
                onPress={() => speak(lang)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: colors.coralSoft,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                }}
              >
                <T size={16}>🔊</T>
                <T size={10} color={colors.coral}>
                  {lang.helpWord}
                </T>
              </Pressable>

              {selected && (
                <T size={20} weight="900" color={colors.teal}>
                  ✓
                </T>
              )}
            </Card>
          );
        })}
      </View>

      <Button label={t('continue')} onPress={onContinue} />
      <Ministry />
    </Screen>
  );
}
