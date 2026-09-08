import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../store/AppProvider';
import { colors, radius, spacing } from '../theme';
import { Button, Card, T } from './ui';

/**
 * Chrome shared by every game: a back button, a title, an optional status line,
 * and the end-of-round card that reports the score and writes it to progress.
 */
export function GameShell({
  title,
  status,
  children,
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/games'))}
          style={styles.backBtn}
        >
          <T size={22} weight="800" color={colors.teal}>
            ←
          </T>
        </Pressable>
        <View style={{ flex: 1 }}>
          <T size={22} weight="800">
            {title}
          </T>
          {!!status && (
            <T size={14} color={colors.muted}>
              {status}
            </T>
          )}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

export function GameOver({
  score,
  detail,
  onPlayAgain,
}: {
  score: number;
  detail: string;
  onPlayAgain: () => void;
}) {
  const router = useRouter();
  const { t } = useApp();
  return (
    <Card style={{ gap: spacing.lg, alignItems: 'center' }}>
      <T size={40}>{score >= 70 ? '🎉' : '🌱'}</T>
      <T size={24} weight="800" align="center">
        {t('wellDone')}
      </T>
      <T size={44} weight="900" color={colors.teal}>
        {score}
      </T>
      <T size={15} color={colors.muted} align="center">
        {detail}
      </T>
      <Button label={t('playAgain')} onPress={onPlayAgain} style={{ alignSelf: 'stretch' }} />
      <Button
        label={t('exit')}
        variant="secondary"
        onPress={() => router.replace('/games')}
        style={{ alignSelf: 'stretch' }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tealLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, padding: spacing.lg, gap: spacing.lg },
});
