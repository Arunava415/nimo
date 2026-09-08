import React, { useState } from 'react';
import { View } from 'react-native';

import { Card, Chip, Ministry, Screen, T } from '../../src/components/ui';
import { activityScore, domainScores, playsWithin, rating, weeklySeries } from '../../src/lib/scoring';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

export default function ProgressScreen() {
  const { t, progress } = useApp();
  const [range, setRange] = useState<1 | 7 | 30>(7);

  const score = activityScore(progress);
  const domains = domainScores(progress);
  const series = weeklySeries(progress);
  const played = playsWithin(progress, range).length;
  const max = Math.max(100, ...series.map((s) => s.value));

  const label = (n: number) =>
    ({
      strong: t('ratingStrong'),
      good: t('ratingGood'),
      fair: t('ratingFair'),
      building: t('ratingBuilding'),
    })[rating(n)];

  return (
    <Screen>
      <T size={26} weight="800">
        {t('progressTitle')}
      </T>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Chip label={t('progressDay')} selected={range === 1} onPress={() => setRange(1)} />
        <Chip label={t('progressWeek')} selected={range === 7} onPress={() => setRange(7)} />
        <Chip label={t('progressMonth')} selected={range === 30} onPress={() => setRange(30)} />
      </View>

      <Card style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}>
          <T size={16} weight="700" style={{ flex: 1 }}>
            {t('homeActivityScore')}
          </T>
          <T size={34} weight="900" color={colors.teal}>
            {score}
          </T>
          <T size={14} color={colors.muted}>
            /100
          </T>
        </View>
        <T size={13} weight="700" color={colors.success}>
          {label(score)}
        </T>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: 120 }}>
          {series.map((s, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: '70%',
                  height: Math.max(4, (s.value / max) * 96),
                  backgroundColor: s.value ? colors.teal : colors.tealLine,
                  borderRadius: radius.sm,
                }}
              />
              <T size={11} color={colors.muted}>
                {s.label}
              </T>
            </View>
          ))}
        </View>

        <T size={13} color={colors.muted}>
          {played} {played === 1 ? 'game' : 'games'} in this period
        </T>
      </Card>

      <T size={18} weight="700">
        {t('progressOverview')}
      </T>
      <View style={{ gap: spacing.md }}>
        {(
          [
            ['memory', t('progressMemory')],
            ['attention', t('progressAttention')],
            ['language', t('progressLanguage')],
            ['problem', t('progressProblem')],
          ] as const
        ).map(([key, name]) => {
          const value = domains[key];
          return (
            <Card key={key} style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T size={16} weight="700">
                  {name}
                </T>
                <T size={16} weight="800" color={colors.teal}>
                  {value}
                </T>
              </View>
              <View
                style={{ height: 10, backgroundColor: colors.tealLine, borderRadius: radius.pill }}
              >
                <View
                  style={{
                    width: `${Math.min(100, value)}%`,
                    height: 10,
                    backgroundColor: colors.teal,
                    borderRadius: radius.pill,
                  }}
                />
              </View>
              <T size={12} color={colors.muted}>
                {value ? label(value) : t('progressEmpty')}
              </T>
            </Card>
          );
        })}
      </View>

      <T size={18} weight="700">
        {t('progressInsights')}
      </T>
      <Card>
        <T size={15} color={colors.inkSoft}>
          {progress.plays.length
            ? `You have played ${progress.plays.length} ${progress.plays.length === 1 ? 'game' : 'games'} so far, with a ${progress.streak}-day streak. Keep going!`
            : t('progressEmpty')}
        </T>
      </Card>

      <T size={12} color={colors.muted}>
        {t('progressDisclaimer')}
      </T>
      <Ministry />
    </Screen>
  );
}
