import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { PinDots, PinPad } from '../src/components/PinPad';
import { Button, Card, Ministry, Screen, T } from '../src/components/ui';
import type { StringKey } from '../src/i18n/strings';
import { useApp } from '../src/store/AppProvider';
import { colors, radius, spacing } from '../src/theme';

export default function SignUp() {
  const router = useRouter();
  const { t, signUp, hasAccount, scale } = useApp();

  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'pin' | 'confirm'>('pin');
  const [error, setError] = useState<StringKey | null>(null);
  const [busy, setBusy] = useState(false);

  const active = stage === 'pin' ? pin : confirmPin;
  const setActive = stage === 'pin' ? setPin : setConfirmPin;

  const onDigit = (d: string) => {
    if (active.length >= 4) return;
    setError(null);
    const next = active + d;
    setActive(next);
    // Move straight to confirmation once the first PIN is complete.
    if (stage === 'pin' && next.length === 4) setStage('confirm');
  };

  const onBackspace = () => {
    setError(null);
    if (active.length === 0) {
      if (stage === 'confirm') setStage('pin');
      return;
    }
    setActive(active.slice(0, -1));
  };

  const onCreate = async () => {
    setBusy(true);
    const res = await signUp({ name, pin, confirmPin });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      if (res.error === 'authErrPinMismatch') {
        setPin('');
        setConfirmPin('');
        setStage('pin');
      }
      return;
    }
    router.replace('/onboarding');
  };

  return (
    <Screen>
      <T size={26} weight="800" align="center">
        {t('authCreateTitle')}
      </T>
      <T size={15} color={colors.muted} align="center">
        {t('authCreateBlurb')}
      </T>

      <Card style={{ gap: spacing.sm }}>
        <T size={16} weight="700">
          {t('authNameLabel')}
        </T>
        <TextInput
          value={name}
          onChangeText={(v) => {
            setName(v);
            setError(null);
          }}
          placeholder={t('authNamePlaceholder')}
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          accessibilityLabel={t('authNameLabel')}
          style={{
            minHeight: 56,
            borderRadius: radius.md,
            borderWidth: 1.5,
            borderColor: colors.tealLine,
            paddingHorizontal: spacing.lg,
            fontSize: Math.round(18 * scale),
            color: colors.ink,
            backgroundColor: colors.cream,
          }}
        />
      </Card>

      <Card style={{ gap: spacing.lg, alignItems: 'center' }}>
        <T size={16} weight="700" align="center">
          {stage === 'pin' ? t('authPinLabel') : t('authPinConfirmLabel')}
        </T>
        <PinDots length={4} filled={active.length} />
        <T size={13} color={colors.muted} align="center">
          {t('authPinHint')}
        </T>
        <PinPad onDigit={onDigit} onBackspace={onBackspace} />
      </Card>

      {!!error && (
        <View
          style={{
            backgroundColor: colors.coralSoft,
            borderRadius: radius.md,
            padding: spacing.md,
          }}
        >
          <T size={15} weight="600" color={colors.danger} align="center">
            {t(error)}
          </T>
        </View>
      )}

      <Button
        label={t('authCreateCta')}
        onPress={onCreate}
        loading={busy}
        disabled={!name.trim() || pin.length !== 4 || confirmPin.length !== 4}
      />

      {hasAccount && (
        <Button
          label={t('authSwitchToSignIn')}
          variant="ghost"
          onPress={() => router.replace('/sign-in')}
        />
      )}
      <Ministry />
    </Screen>
  );
}
