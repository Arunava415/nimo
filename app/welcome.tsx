import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button, Ministry, Screen, T } from '../src/components/ui';
import { LANGUAGES } from '../src/i18n/languages';
import { useApp } from '../src/store/AppProvider';
import { colors, radius, spacing } from '../src/theme';

export default function Welcome() {
  const router = useRouter();
  const { t, language } = useApp();
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <Screen>
      <View style={{ alignItems: 'flex-end' }}>
        <Button
          label={`${current.badge}  ${current.label.split(' (')[0]}`}
          variant="secondary"
          onPress={() => router.push('/language')}
        />
      </View>

      <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl }}>
        <View
          style={{
            width: 128,
            height: 128,
            borderRadius: radius.lg + 10,
            backgroundColor: colors.tealMist,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.tealSoft,
          }}
        >
          <T size={64}>🧠</T>
        </View>
        <T size={32} weight="800" align="center" color={colors.teal}>
          {t('welcomeTitle')}
        </T>
        <T size={18} weight="600" align="center" color={colors.coral}>
          {t('welcomeTagline')}
        </T>
        <T size={16} color={colors.muted} align="center">
          {t('welcomeBlurb')}
        </T>
      </View>

      <Button label={t('welcomeCta')} onPress={() => router.push('/language')} />
      <Ministry />
    </Screen>
  );
}
