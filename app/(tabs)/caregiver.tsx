import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button, Card, Ministry, Screen, StatTile, T } from '../../src/components/ui';
import { playsToday, relativeTime } from '../../src/lib/scoring';
import { useApp } from '../../src/store/AppProvider';
import { colors, spacing } from '../../src/theme';

export default function Caregiver() {
  const router = useRouter();
  const { t, account, progress, reminders } = useApp();

  const name = account?.name ?? '—';
  const today = playsToday(progress);
  const activeReminders = reminders.filter((r) => !r.done).length;

  return (
    <Screen>
      <T size={26} weight="800">
        {t('caregiverTitle')}
      </T>
      <T size={14} color={colors.muted}>
        {t('caregiverSub', { name })}
      </T>

      <Card style={{ gap: spacing.sm, borderColor: colors.tealSoft, borderWidth: 2 }}>
        <T size={19} weight="700">
          {today.length ? t('caregiverStatusGood', { name }) : t('caregiverNoActivity')}
        </T>
        {today.length > 0 && (
          <T size={14} color={colors.muted}>
            Last active {relativeTime(progress.lastActiveAt)}. Completed {today.length}{' '}
            {today.length === 1 ? 'activity' : 'activities'} today.
          </T>
        )}
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile value={today.length} label={t('caregiverGamesPlayed')} />
        <StatTile value={relativeTime(progress.lastActiveAt)} label={t('caregiverLastActive')} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile value={`${progress.streak} Days`} label={t('caregiverStreak')} />
        <StatTile value={`${activeReminders} Active`} label={t('caregiverActiveReminders')} />
      </View>

      <Button
        label={t('caregiverViewProgress')}
        variant="secondary"
        onPress={() => router.push('/progress')}
      />
      <Button
        label={t('caregiverManageReminders')}
        variant="secondary"
        onPress={() => router.push('/reminders')}
      />
      <Ministry />
    </Screen>
  );
}
