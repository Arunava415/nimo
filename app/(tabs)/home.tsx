import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Card, Ministry, Screen, StatTile, T } from '../../src/components/ui';
import { dailyPick, recommendedGames } from '../../src/lib/games';
import { activityScore, playsToday, rating } from '../../src/lib/scoring';
import { formatTime12h } from '../../src/lib/time';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

function greetingKey(): 'greetMorning' | 'greetAfternoon' | 'greetEvening' {
  const h = new Date().getHours();
  if (h < 12) return 'greetMorning';
  if (h < 17) return 'greetAfternoon';
  return 'greetEvening';
}

export default function Home() {
  const router = useRouter();
  const { t, account, profile, progress, reminders } = useApp();

  const score = activityScore(progress);
  const todayCount = playsToday(progress).length;
  const dueCount = reminders.filter((r) => !r.done).length;
  const recommended = recommendedGames(profile.favourites, 4);
  const pick = dailyPick();
  const nextReminder = reminders.find((r) => !r.done);

  const ratingLabel = {
    strong: t('ratingStrong'),
    good: t('ratingGood'),
    fair: t('ratingFair'),
    building: t('ratingBuilding'),
  }[rating(score)];

  return (
    <Screen>
      <View style={{ gap: 2 }}>
        <T size={26} weight="800">
          {t(greetingKey())}, {account?.name}
        </T>
        <T size={15} color={colors.muted}>
          {t('homeReady')}
        </T>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T size={18} weight="700">
          {t('homeOverview')}
        </T>
        <T size={14} weight="700" color={colors.teal} onPress={() => router.push('/progress')}>
          {t('homeViewAll')}
        </T>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile value={todayCount} label={t('homeGamesCompleted')} />
        <StatTile value={dueCount} label={t('homeRemindersDue')} />
        <StatTile value={score} label={t('homeActivityScore')} hint={`(${ratingLabel})`} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <T size={18} weight="700">
            {t('homeRecommended')}
          </T>
          <T size={13} color={colors.muted}>
            {t('homeRecommendedBlurb')}
          </T>
        </View>
        <T size={14} weight="700" color={colors.teal} onPress={() => router.push('/games')}>
          {t('homeSeeAll')}
        </T>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {recommended.map((g) => (
          <Card
            key={g.id}
            onPress={() => router.push(g.route as never)}
            accessibilityLabel={g.title}
            style={{ flexBasis: '47%', flexGrow: 1, gap: spacing.xs }}
          >
            {g.id === pick.id && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: colors.coralSoft,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                  borderRadius: radius.pill,
                }}
              >
                <T size={11} weight="700" color={colors.coral}>
                  {t('homeDailyPick')}
                </T>
              </View>
            )}
            <T size={30}>{g.emoji}</T>
            <T size={16} weight="700">
              {g.title}
            </T>
            <T size={12} color={colors.muted}>
              {g.subtitle}
            </T>
          </Card>
        ))}
      </View>

      {!!nextReminder && (
        <Card
          onPress={() => router.push('/reminders')}
          accessibilityLabel={nextReminder.title}
          style={{ gap: 4, borderColor: colors.coralSoft, borderWidth: 2 }}
        >
          <T size={11} weight="800" color={colors.coral}>
            {nextReminder.category.toUpperCase()}
          </T>
          <T size={17} weight="700">
            {nextReminder.title}
          </T>
          <T size={14} color={colors.teal} weight="700">
            {formatTime12h(nextReminder.time)}
          </T>
          <T size={13} color={colors.muted}>
            {nextReminder.note}
          </T>
        </Card>
      )}

      <T size={18} weight="700">
        {t('homeQuickAccess')}
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {[
          { emoji: '🔊', label: t('homeVoiceAssist'), href: '/profile' },
          { emoji: '📅', label: t('homeCalendar'), href: '/reminders' },
          { emoji: '🧑‍⚕️', label: t('homeCaregiver'), href: '/caregiver' },
          { emoji: '❓', label: t('homeHelp'), href: '/profile' },
        ].map((q) => (
          <Card
            key={q.label}
            onPress={() => router.push(q.href as never)}
            accessibilityLabel={q.label}
            style={{ flexBasis: '47%', flexGrow: 1, alignItems: 'center', gap: spacing.xs }}
          >
            <T size={26}>{q.emoji}</T>
            <T size={14} weight="600">
              {q.label}
            </T>
          </Card>
        ))}
      </View>

      <T size={13} color={colors.muted} align="center">
        {t('homeOfflineNote')}
      </T>
      <Ministry />
    </Screen>
  );
}
