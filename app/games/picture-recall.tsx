import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { GameOver, GameShell } from '../../src/components/GameShell';
import { Button, Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

const SCENE = ['🌳', '🏠', '🐦', '🌻', '⛰️', '🐄'];
const DECOYS = ['🚲', '🐟', '🌵', '🦋'];
const OBSERVE_SECONDS = 6;

function pickQuestions() {
  const present = [...SCENE].sort(() => Math.random() - 0.5).slice(0, 2);
  const absent = [...DECOYS].sort(() => Math.random() - 0.5).slice(0, 2);
  return [...present.map((e) => ({ emoji: e, inScene: true })), ...absent.map((e) => ({ emoji: e, inScene: false }))].sort(
    () => Math.random() - 0.5,
  );
}

export default function PictureRecall() {
  const { t, recordPlay } = useApp();
  const [phase, setPhase] = useState<'observe' | 'quiz' | 'done'>('observe');
  const [left, setLeft] = useState(OBSERVE_SECONDS);
  const [questions, setQuestions] = useState(pickQuestions);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    if (phase !== 'observe') return;
    if (left <= 0) {
      setPhase('quiz');
      return;
    }
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left, phase]);

  const answer = (said: boolean) => {
    const right = said === questions[index].inScene;
    const nextCorrect = right ? correct + 1 : correct;
    setCorrect(nextCorrect);
    if (index + 1 >= questions.length) {
      const score = Math.round((nextCorrect / questions.length) * 100);
      void recordPlay({ gameId: 'picture-recall', score, domain: 'memory' });
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setQuestions(pickQuestions());
    setIndex(0);
    setCorrect(0);
    setLeft(OBSERVE_SECONDS);
    setPhase('observe');
  };

  const score = Math.round((correct / questions.length) * 100);

  return (
    <GameShell
      title="Picture Recall"
      status={
        phase === 'observe'
          ? `Observe carefully (${left}s)`
          : phase === 'quiz'
            ? `Question ${index + 1} of ${questions.length}`
            : t('done')
      }
    >
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        {phase === 'observe' && (
          <>
            <T size={17} weight="700">
              Observe the peaceful garden scene:
            </T>
            <Card
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.lg,
                justifyContent: 'center',
                backgroundColor: colors.tealMist,
              }}
            >
              {SCENE.map((s) => (
                <T key={s} size={46}>
                  {s}
                </T>
              ))}
            </Card>
            <T size={15} color={colors.coral} align="center" weight="700">
              Hiding in {left} seconds...
            </T>
          </>
        )}

        {phase === 'quiz' && (
          <>
            <T size={17} weight="700" align="center">
              Was this in the picture?
            </T>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 140,
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderWidth: 2,
                borderColor: colors.tealLine,
              }}
            >
              <T size={64}>{questions[index].emoji}</T>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button label="Yes" onPress={() => answer(true)} style={{ flex: 1 }} />
              <Button
                label="No"
                variant="secondary"
                onPress={() => answer(false)}
                style={{ flex: 1 }}
              />
            </View>
          </>
        )}

        {phase === 'done' && (
          <GameOver
            score={score}
            detail={`${correct} of ${questions.length} remembered correctly`}
            onPlayAgain={restart}
          />
        )}
      </ScrollView>
    </GameShell>
  );
}
