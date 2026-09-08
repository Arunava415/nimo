import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { GameShell } from '../../src/components/GameShell';
import { Button, Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

/** Pass-and-play quiz: the elder and their caregiver alternate turns. */
const QUESTIONS = [
  { prompt: 'Which one is a flower?', options: ['🌸', '🪨', '🔧'], answer: '🌸' },
  { prompt: 'Which one do you drink?', options: ['🍵', '👞', '📻'], answer: '🍵' },
  { prompt: 'Which one tells the time?', options: ['🕰️', '🧺', '🪵'], answer: '🕰️' },
  { prompt: 'Which one is an animal?', options: ['🐄', '🚲', '🏠'], answer: '🐄' },
  { prompt: 'Which one grows on a tree?', options: ['🍎', '🧦', '💡'], answer: '🍎' },
  { prompt: 'Which one is used for rain?', options: ['☂️', '🍴', '📚'], answer: '☂️' },
];

export default function TwoPlayer() {
  const { t, account, recordPlay } = useApp();
  const [turn, setTurn] = useState<0 | 1>(0);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [done, setDone] = useState(false);

  const players = [
    { name: account?.name ?? 'Player 1', emoji: '🌸' },
    { name: 'Caregiver', emoji: '☀️' },
  ];

  const q = QUESTIONS[index];

  const answer = (option: string) => {
    const right = option === q.answer;
    const nextScores: [number, number] = [...scores] as [number, number];
    if (right) nextScores[turn] += 1;
    setScores(nextScores);

    if (index + 1 >= QUESTIONS.length) {
      // Only the account holder's own turns count towards their progress.
      const ownTurns = Math.ceil(QUESTIONS.length / 2);
      void recordPlay({
        gameId: 'two-player',
        score: Math.round((nextScores[0] / ownTurns) * 100),
        domain: 'attention',
      });
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setTurn((p) => (p === 0 ? 1 : 0));
  };

  const restart = () => {
    setTurn(0);
    setIndex(0);
    setScores([0, 0]);
    setDone(false);
  };

  return (
    <GameShell title="Family Play" status="Pass & Play with Caregiver or Family">
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          {players.map((p, i) => (
            <React.Fragment key={p.name}>
              <Card
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 2,
                  borderWidth: !done && turn === i ? 3 : 1,
                  borderColor: !done && turn === i ? colors.teal : colors.tealLine,
                  backgroundColor: !done && turn === i ? colors.tealMist : colors.surface,
                }}
              >
                <T size={30}>{p.emoji}</T>
                <T size={15} weight="700">
                  {p.name}
                </T>
                <T size={22} weight="900" color={colors.teal}>
                  {scores[i]}
                </T>
              </Card>
              {i === 0 && (
                <T size={16} weight="800" color={colors.muted}>
                  VS
                </T>
              )}
            </React.Fragment>
          ))}
        </View>

        {done ? (
          <Card style={{ gap: spacing.lg, alignItems: 'center' }}>
            <T size={40}>🏆</T>
            <T size={22} weight="800" align="center">
              {scores[0] === scores[1]
                ? "It's a tie!"
                : `${players[scores[0] > scores[1] ? 0 : 1].name} wins!`}
            </T>
            <T size={15} color={colors.muted}>
              {scores[0]} — {scores[1]}
            </T>
            <Button label={t('playAgain')} onPress={restart} style={{ alignSelf: 'stretch' }} />
          </Card>
        ) : (
          <>
            <Card style={{ alignItems: 'center', gap: spacing.sm }}>
              <T size={13} color={colors.muted}>
                Current Turn
              </T>
              <T size={20} weight="800" color={colors.teal}>
                {players[turn].emoji} {players[turn].name}
              </T>
            </Card>

            <T size={19} weight="700" align="center">
              {q.prompt}
            </T>

            <View
              style={{ flexDirection: 'row', gap: spacing.md, justifyContent: 'center' }}
            >
              {q.options.map((o) => (
                <Card
                  key={o}
                  onPress={() => answer(o)}
                  accessibilityLabel={`Option ${o}`}
                  style={{
                    width: 92,
                    height: 92,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.lg,
                  }}
                >
                  <T size={40}>{o}</T>
                </Card>
              ))}
            </View>

            <T size={13} color={colors.muted} align="center">
              Question {index + 1} of {QUESTIONS.length}
            </T>
          </>
        )}
      </ScrollView>
    </GameShell>
  );
}
