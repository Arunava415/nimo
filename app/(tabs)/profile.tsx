import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Switch, View } from 'react-native';

import {
  Button,
  Card,
  Chip,
  Divider,
  Ministry,
  Screen,
  SectionTitle,
  T,
} from '../../src/components/ui';
import { LANGUAGES } from '../../src/i18n/languages';
import { useApp } from '../../src/store/AppProvider';
import type { TextScaleKey } from '../../src/theme';
import { colors, radius, spacing } from '../../src/theme';

/** Alert.alert is a no-op on web, so confirmations fall back to window.confirm. */
function confirm(message: string, onYes: () => void) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (typeof window !== 'undefined' && window.confirm(message)) onYes();
    return;
  }
  Alert.alert('NIMO', message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', style: 'destructive', onPress: onYes },
  ]);
}

export default function Profile() {
  const router = useRouter();
  const { t, account, profile, settings, saveSettings, signOut, resetApp, language } = useApp();
  const [busy, setBusy] = useState(false);

  const lang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const genderLabel =
    account?.gender === 'male'
      ? t('onbMale')
      : account?.gender === 'female'
        ? t('onbFemale')
        : t('onbNoSay');

  const onSignOut = () => {
    confirm(t('authSignOutConfirm'), async () => {
      setBusy(true);
      await signOut();
      router.replace('/sign-in');
    });
  };

  const onReset = () => {
    confirm(t('profileResetConfirm'), async () => {
      setBusy(true);
      await resetApp();
      router.replace('/welcome');
    });
  };

  return (
    <Screen>
      <T size={26} weight="800">
        {t('profileTitle')}
      </T>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.pill,
            backgroundColor: colors.tealMist,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T size={34}>🧓</T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T size={20} weight="800">
            {account?.name}
          </T>
          <T size={13} color={colors.muted}>
            {account?.age} {t('onbYearsOld')} • {genderLabel} • {t('profileAccount')}
          </T>
        </View>
      </Card>

      <SectionTitle>{t('profilePersonalization')}</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <Row label={t('profilePace')} value={profile.difficulty} />
        <Divider />
        <Row label={t('profileTarget')} value={`${profile.sessionMinutes} minutes`} />
        <Divider />
        <Row
          label={t('profileFavourites')}
          value={profile.favourites.length ? profile.favourites.join(', ') : '—'}
        />
        <Button
          label={t('profileUpdate')}
          variant="secondary"
          onPress={() => router.push('/onboarding')}
        />
      </Card>

      <SectionTitle>{t('profileLanguageHeading')}</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <T size={17} weight="700">
          {lang.badge} · {lang.label}
        </T>
        <Button
          label={t('profileChangeLanguage')}
          variant="secondary"
          onPress={() => router.push('/language')}
        />
      </Card>

      <SectionTitle>{t('profileAccessibility')}</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <T size={16} weight="700">
          {t('profileTextSize')}
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(
            [
              ['normal', t('profileTextNormal')],
              ['large', t('profileTextLarge')],
              ['xlarge', t('profileTextXLarge')],
            ] as [TextScaleKey, string][]
          ).map(([key, label]) => (
            <Chip
              key={key}
              label={label}
              selected={settings.textScale === key}
              onPress={() => saveSettings({ textScale: key })}
            />
          ))}
        </View>
        <Divider />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <T size={16} weight="600" style={{ flex: 1 }}>
            {t('profileSounds')}
          </T>
          <Switch
            value={settings.soundsEnabled}
            onValueChange={(v) => saveSettings({ soundsEnabled: v })}
            trackColor={{ true: colors.teal, false: colors.tealLine }}
            accessibilityLabel={t('profileSounds')}
          />
        </View>
      </Card>

      <Card style={{ gap: spacing.md }}>
        <Button
          label={t('caregiverTitle')}
          variant="secondary"
          onPress={() => router.push('/caregiver')}
        />
      </Card>

      <SectionTitle>{t('profileAbout')}</SectionTitle>
      <Card style={{ gap: spacing.sm }}>
        <T size={14} color={colors.inkSoft}>
          {t('profileAboutBody')}
        </T>
        <T size={12} color={colors.muted}>
          {t('profileVersion')} • {t('profileBuiltFor')}
        </T>
      </Card>

      <Button label={t('authSignOut')} onPress={onSignOut} disabled={busy} />
      <Button label={t('profileReset')} variant="danger" onPress={onReset} disabled={busy} />
      <Ministry />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <T size={14} color={colors.muted}>
        {label}
      </T>
      <T size={14} weight="700" style={{ flex: 1 }} align="right">
        {value}
      </T>
    </View>
  );
}
