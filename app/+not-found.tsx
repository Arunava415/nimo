import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button, Screen, T } from '../src/components/ui';
import { colors, spacing } from '../src/theme';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: spacing.lg, paddingTop: spacing.xxl }}>
        <T size={56}>🧭</T>
        <T size={24} weight="800" align="center">
          This page does not exist
        </T>
        <T size={15} color={colors.muted} align="center">
          Let us take you back to a familiar place.
        </T>
        <Button label="Go Home" onPress={() => router.replace('/')} style={{ alignSelf: 'stretch' }} />
      </View>
    </Screen>
  );
}
