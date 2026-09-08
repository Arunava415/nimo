import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useApp } from '../src/store/AppProvider';
import { colors } from '../src/theme';

/**
 * Entry gate. Decides, in order:
 *   not signed in + no account yet  -> welcome
 *   not signed in + account exists  -> sign in
 *   signed in but not onboarded     -> onboarding
 *   signed in and onboarded         -> home
 */
export default function Index() {
  const { ready, signedIn, hasAccount, account } = useApp();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.teal} size="large" />
      </View>
    );
  }

  if (!signedIn) return <Redirect href={hasAccount ? '/sign-in' : '/welcome'} />;
  if (!account?.onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/home" />;
}
