import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Card, Chip, Ministry, Screen, T } from '../../src/components/ui';
import { GAMES, type GameCategory } from '../../src/lib/games';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

export default function Games() {
  const router = useRouter();
  const { t, progress } = useApp();
  const [filter, setFilter] = useState<GameCategory | 'all'>('all');

  const filters: { key: GameCategory | 'all'; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'memory', label: t('filterMemory') },
    { key: 'attention', label: t('filterAttention') },
    { key: 'logic', label: t('filterLogic') },
    { key: 'language', label: t('filterLanguage') },
    { key: 'family', label: t('filterFamily') },
  ];

  const badgeLabel = (b?: string) =>
    b === 'popular'
      ? t('badgePopular')
      : b === 'new'
        ? t('badgeNew')
        : b === 'today'
          ? t('badgeToday')
          : b === 'multiplayer'
            ? t('badgeMultiplayer')
            : null;

  const visible = GAMES.filter((g) => filter === 'all' || g.category === filter);

  return (
    <Screen>
      <T size={26} weight="800">
        {t('gamesTitle')}
      </T>
      <T size={14} color={colors.muted}>
        {t('gamesBlurb')}
      </T>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>

      <View style={{ gap: spacing.md }}>
        {visible.map((g) => {
          const best = progress.bestScores[g.id];
          const label = badgeLabel(g.badge);
          return (
            <Card
              key={g.id}
              onPress={() => router.push(g.route as never)}
              accessibilityLabel={g.title}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.md,
                  backgroundColor: colors.tealMist,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T size={30}>{g.emoji}</T>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                {!!label && (
                  <T size={11} weight="800" color={colors.coral}>
                    {label.toUpperCase()}
                  </T>
                )}
                <T size={18} weight="700">
                  {g.title}
                </T>
                <T size={13} color={colors.muted}>
                  {g.subtitle}
                </T>
                {best != null && (
                  <T size={12} weight="700" color={colors.success}>
                    {t('score')}: {best}
                  </T>
                )}
              </View>
              <T size={22} color={colors.teal}>
                ›
              </T>
            </Card>
          );
        })}
      </View>
      <Ministry />
    </Screen>
  );
}
