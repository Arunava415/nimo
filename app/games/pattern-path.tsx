import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { GameOver, GameShell } from '../../src/components/GameShell';
import { Button, Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

type Round = { sequence: string[]; options: { emoji: string; label: string }[]; answer: string };

const ROUNDS: Round[] = [
  {
    sequence: ['🍃', '🌸', '🍃', '🌸', '🍃'],
    options: [
      { emoji: '🍃', label: 'Leaf' },
      { emoji: '🌸', label: 'Flower' },
      { emoji: '☀️', label: 'Sun' },
    ],
    answer: '🌸',
  },
  {
    sequence: ['☀️', '☀️', '🌙', '☀️', '☀️'],
    options: [
      { emoji: '🌙', label: 'Moon' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '⭐', label: 'Star' },
    ],
    answer: '🌙',
  },
  {
    sequence: ['🔵', '🟢', '🟡', '🔵', '🟢'],
    options: [
      { emoji: '🔵', label: 'Blue' },
      { emoji: '🟡', label: 'Yellow' },
      { emoji: '🟢', label: 'Green' },
    ],
    answer: '🟡',
  },
];

export default function PatternPath() {
  const { t, recordPlay } = useApp();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);

  const round = ROUNDS[index];
  const score = Math.round((correct / ROUNDS.length) * 100);

  const answer = (emoji: string) => {
    if (feedback) return;
    const right = emoji === round.answer;
    setFeedback(right ? 'right' : 'wrong');
    if (right) setCorrect((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= ROUNDS.length) {
        const finalScore = Math.round(((right ? correct + 1 : correct) / ROUNDS.length) * 100);
        void recordPlay({ gameId: 'pattern-path', score: finalScore, domain: 'attention' });
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 900);
  };

  const restart = () => {
    setIndex(0);
    setCorrect(0);
    setFeedback(null);
    setDone(false);
  };

  return (
    <GameShell title="Pattern Path" status={`${t('level')} ${index + 1} of ${ROUNDS.length}`}>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        {done ? (
          <GameOver
            score={score}
            detail={`${correct} of ${ROUNDS.length} patterns correct`}
            onPlayAgain={restart}
          />
        ) : (
          <>
            <T size={17} weight="700">
              Look at the pattern:
            </T>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.sm,
                justifyContent: 'center',
              }}
            >
              {[...round.sequence, '?'].map((s, i) => (
                <View
                  key={i}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: s === '?' ? colors.tealMist : colors.surface,
                    borderWidth: 2,
                    borderColor: s === '?' ? colors.teal : colors.tealLine,
                  }}
                >
                  <T size={28} weight="800" color={colors.teal}>
                    {s}
                  </T>
                </View>
              ))}
            </View>

            <T size={17} weight="700">
              What comes next?
            </T>
            <View style={{ gap: spacing.md }}>
              {round.options.map((o) => (
                <Button
                  key={o.emoji}
                  label={`${o.emoji}   ${o.label}`}
                  variant="secondary"
                  onPress={() => answer(o.emoji)}
                />
              ))}
            </View>

            {!!feedback && (
              <Card
                style={{
                  backgroundColor: feedback === 'right' ? colors.tealMist : colors.coralSoft,
                }}
              >
                <T
                  size={18}
                  weight="800"
                  align="center"
                  color={feedback === 'right' ? colors.success : colors.danger}
                >
                  {feedback === 'right' ? t('correct') : t('tryAgain')}
                </T>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </GameShell>
  );
}
