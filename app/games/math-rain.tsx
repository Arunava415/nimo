import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { GameOver, GameShell } from '../../src/components/GameShell';
import { Button, Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

type Drop = { id: number; a: number; b: number; op: '+' | '-' | 'x'; answer: number; y: number };

const TICK_MS = 400;
const FALL_STEP = 4; // percent of the pond height per tick
const SPAWN_EVERY = 6; // ticks

function makeDrop(id: number, level: number): Drop {
  const ops: Drop['op'][] = level > 2 ? ['+', '-', 'x'] : ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const a = 1 + Math.floor(Math.random() * (op === 'x' ? 9 : 20));
  const b = 1 + Math.floor(Math.random() * (op === 'x' ? 9 : 20));
  const answer = op === '+' ? a + b : op === '-' ? Math.max(a, b) - Math.min(a, b) : a * b;
  return { id, a: op === '-' ? Math.max(a, b) : a, b: op === '-' ? Math.min(a, b) : b, op, answer, y: 0 };
}

export default function MathRain() {
  const { t, recordPlay, progress } = useApp();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'over'>('intro');
  const [drops, setDrops] = useState<Drop[]>([]);
  const [entry, setEntry] = useState('');
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const tickRef = useRef(0);
  const idRef = useRef(0);

  const best = progress.bestScores['math-rain'] ?? 0;

  const reset = useCallback(() => {
    setDrops([]);
    setEntry('');
    setLives(3);
    setPoints(0);
    tickRef.current = 0;
    idRef.current = 0;
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      tickRef.current += 1;
      const level = 1 + Math.floor(points / 50);

      setDrops((prev) => {
        let next = prev.map((d) => ({ ...d, y: d.y + FALL_STEP }));
        const landed = next.filter((d) => d.y >= 100);
        if (landed.length) {
          next = next.filter((d) => d.y < 100);
          setLives((l) => l - landed.length);
        }
        if (tickRef.current % SPAWN_EVERY === 0 && next.length < 4) {
          idRef.current += 1;
          next = [...next, makeDrop(idRef.current, level)];
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [phase, points]);

  // End the round once the last life is gone.
  useEffect(() => {
    if (phase !== 'playing' || lives > 0) return;
    setPhase('over');
    // 200 raw points is a strong round; cap the stored score at 100.
    void recordPlay({
      gameId: 'math-rain',
      score: Math.min(100, Math.round((points / 200) * 100)),
      domain: 'problem',
    });
  }, [lives, phase, points, recordPlay]);

  const submit = () => {
    if (!entry) return;
    const value = Number(entry);
    const hit = drops.find((d) => d.answer === value);
    if (hit) {
      setDrops((prev) => prev.filter((d) => d.id !== hit.id));
      setPoints((p) => p + 10);
    }
    setEntry('');
  };

  const start = () => {
    reset();
    setPhase('playing');
  };

  if (phase === 'intro') {
    return (
      <GameShell title="Math Rain" status="Raindrop Arithmetic">
        <Card style={{ gap: spacing.md }}>
          <T size={13} weight="800" color={colors.muted}>
            BEST SCORE
          </T>
          <T size={34} weight="900" color={colors.teal}>
            {best}
          </T>
          <T size={15}>💧 Solve falling raindrops before they hit the pond</T>
          <T size={15}>💔 If a raindrop splashes the ground, you lose 1 life</T>
          <T size={15}>⌨️ Type the answer on the keypad & press ENTER to pop drops</T>
          <T size={15}>⭐ Earn +10 points per drop and build your brain score!</T>
        </Card>
        <Button label="▶  PLAY NOW" onPress={start} />
      </GameShell>
    );
  }

  if (phase === 'over') {
    return (
      <GameShell title="Math Rain" status="Raindrop Arithmetic">
        <GameOver
          score={Math.min(100, Math.round((points / 200) * 100))}
          detail={`${points} points collected`}
          onPlayAgain={start}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Math Rain" status={`${'❤️'.repeat(Math.max(lives, 0))}   ${points} pts`}>
      <View
        style={{
          flex: 1,
          minHeight: 240,
          backgroundColor: colors.tealMist,
          borderRadius: radius.lg,
          borderWidth: 2,
          borderColor: colors.tealSoft,
          overflow: 'hidden',
        }}
      >
        {drops.map((d) => (
          <View
            key={d.id}
            style={{
              position: 'absolute',
              top: `${Math.min(d.y, 96)}%`,
              left: `${(d.id * 37) % 60}%`,
              backgroundColor: colors.surface,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              borderWidth: 2,
              borderColor: colors.teal,
            }}
          >
            <T size={18} weight="800" color={colors.teal}>
              {d.a} {d.op} {d.b}
            </T>
          </View>
        ))}
      </View>

      <Card style={{ alignItems: 'center', paddingVertical: spacing.md }}>
        <T size={28} weight="900" color={colors.teal}>
          {entry || '—'}
        </T>
      </Card>

      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}
      >
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '⏎'].map((k) => (
          <Pressable
            key={k}
            accessibilityRole="button"
            accessibilityLabel={k === '⏎' ? 'Enter' : k === '⌫' ? 'Delete' : `Digit ${k}`}
            onPress={() => {
              if (k === '⌫') setEntry((e) => e.slice(0, -1));
              else if (k === '⏎') submit();
              else if (entry.length < 4) setEntry((e) => e + k);
            }}
            style={{
              width: 72,
              height: 54,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: k === '⏎' ? colors.coral : colors.surface,
              borderWidth: 1.5,
              borderColor: colors.tealLine,
            }}
          >
            <T size={20} weight="700" color={k === '⏎' ? colors.onTeal : colors.ink}>
              {k}
            </T>
          </Pressable>
        ))}
      </View>
      <T size={12} color={colors.muted} align="center">
        {t('score')}: {points}
      </T>
    </GameShell>
  );
}
