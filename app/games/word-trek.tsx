import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { GameOver, GameShell } from '../../src/components/GameShell';
import { Button, Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

type Puzzle = { word: string; blankAt: number; clue: string; options: string[] };

const PUZZLES: Puzzle[] = [
  { word: 'FLOWER', blankAt: 2, clue: 'A blooming blossom in nature', options: ['O', 'E', 'A', 'U'] },
  { word: 'RIVER', blankAt: 1, clue: 'Water flowing through the valley', options: ['I', 'A', 'O', 'U'] },
  { word: 'MOUNTAIN', blankAt: 4, clue: 'A tall peak in the hills', options: ['T', 'D', 'K', 'P'] },
  { word: 'FAMILY', blankAt: 3, clue: 'The people who care for you', options: ['I', 'E', 'O', 'A'] },
];

export default function WordTrek() {
  const { t, recordPlay } = useApp();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);

  const puzzle = PUZZLES[index];
  const target = puzzle.word[puzzle.blankAt];

  const choose = (letter: string) => {
    if (feedback) return;
    const right = letter === target;
    setFeedback(right ? 'right' : 'wrong');
    if (right) setCorrect((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      if (!right) return; // let them try again on the same word
      if (index + 1 >= PUZZLES.length) {
        const score = Math.round(((correct + 1) / PUZZLES.length) * 100);
        void recordPlay({ gameId: 'word-trek', score, domain: 'language' });
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 800);
  };

  const restart = () => {
    setIndex(0);
    setCorrect(0);
    setFeedback(null);
    setDone(false);
  };

  return (
    <GameShell title="Word Trek" status={`Word ${index + 1} of ${PUZZLES.length}`}>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        {done ? (
          <GameOver
            score={Math.round((correct / PUZZLES.length) * 100)}
            detail={`${correct} of ${PUZZLES.length} words completed`}
            onPlayAgain={restart}
          />
        ) : (
          <>
            <T size={16} color={colors.muted} align="center">
              {puzzle.clue}
            </T>
            <T size={17} weight="700" align="center">
              Complete the word:
            </T>

            <View
              style={{
                flexDirection: 'row',
                gap: spacing.sm,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {puzzle.word.split('').map((ch, i) => {
                const blank = i === puzzle.blankAt;
                return (
                  <View
                    key={i}
                    style={{
                      width: 44,
                      height: 56,
                      borderRadius: radius.sm,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: blank ? colors.tealMist : colors.surface,
                      borderWidth: 2,
                      borderColor: blank ? colors.teal : colors.tealLine,
                    }}
                  >
                    <T size={24} weight="800" color={blank ? colors.teal : colors.ink}>
                      {blank ? '_' : ch}
                    </T>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: spacing.md,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {puzzle.options.map((o) => (
                <Button
                  key={o}
                  label={o}
                  variant="secondary"
                  onPress={() => choose(o)}
                  style={{ minWidth: 84 }}
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
