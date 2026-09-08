import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { PinDots, PinPad } from '../src/components/PinPad';
import { Button, Card, Ministry, Screen, T } from '../src/components/ui';
import type { StringKey } from '../src/i18n/strings';
import { useApp } from '../src/store/AppProvider';
import { colors, radius, spacing } from '../src/theme';

export default function SignIn() {
  const router = useRouter();
  const { t, signIn, storedAccount, hasAccount } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<StringKey | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (value: string) => {
    setBusy(true);
    const res = await signIn(value);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      setPin('');
      return;
    }
    router.replace('/');
  };

  const onDigit = (d: string) => {
    if (pin.length >= 4 || busy) return;
    setError(null);
    const next = pin + d;
    setPin(next);
    if (next.length === 4) void submit(next);
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xl }}>
        <T size={56}>🧠</T>
        <T size={26} weight="800" align="center">
          {t('authWelcomeBack')}
        </T>
        <T size={15} color={colors.muted} align="center">
          {t('authSignInBlurb')}
        </T>
      </View>

      <Card style={{ gap: spacing.lg, alignItems: 'center' }}>
        {!!storedAccount?.name && (
          <T size={18} weight="700" color={colors.teal}>
            {storedAccount.name}
          </T>
        )}
        <T size={16} weight="600">
          {t('authPinEnterLabel')}
        </T>
        <PinDots length={4} filled={pin.length} />
        <PinPad onDigit={onDigit} onBackspace={() => setPin(pin.slice(0, -1))} />
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

      <Button label={t('authForgotPin')} variant="ghost" onPress={() => setShowHelp((v) => !v)} />
      {showHelp && (
        <Card>
          <T size={14} color={colors.muted}>
            {t('authForgotPinHelp')}
          </T>
        </Card>
      )}

      {!hasAccount && (
        <Button
          label={t('authSwitchToSignUp')}
          variant="secondary"
          onPress={() => router.replace('/sign-up')}
        />
      )}
      <Ministry />
    </Screen>
  );
}
