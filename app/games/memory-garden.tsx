import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { GameOver, GameShell } from '../../src/components/GameShell';
import { Card, T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

const SYMBOLS = ['🌸', '🌿', '🍀', '🌻', '🌺', '🍃', '🌼', '🌾'];

type CardState = { id: number; symbol: string; flipped: boolean; matched: boolean };

function newDeck(): CardState[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol, id) => ({
    id,
    symbol,
    flipped: false,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGarden() {
  const { t, recordPlay } = useApp();
  const [deck, setDeck] = useState<CardState[]>(newDeck);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const pairs = useMemo(() => deck.filter((c) => c.matched).length / 2, [deck]);

  // Resolve a pair one beat after the second card is turned over.
  useEffect(() => {
    if (picked.length !== 2) return;
    const [a, b] = picked;
    const timer = setTimeout(() => {
      setDeck((prev) => {
        const match = prev[a].symbol === prev[b].symbol;
        return prev.map((c, i) =>
          i === a || i === b
            ? { ...c, matched: c.matched || match, flipped: match ? true : false }
            : c,
        );
      });
      setPicked([]);
    }, 700);
    return () => clearTimeout(timer);
  }, [picked]);

  useEffect(() => {
    if (done || deck.some((c) => !c.matched)) return;
    setDone(true);
    // Perfect play is 8 moves; the score tapers off as moves climb.
    const score = Math.max(20, Math.round((8 / Math.max(moves, 8)) * 100));
    void recordPlay({ gameId: 'memory-garden', score, domain: 'memory' });
  }, [deck, done, moves, recordPlay]);

  const flip = (index: number) => {
    if (picked.length === 2) return;
    const card = deck[index];
    if (card.matched || card.flipped) return;
    setDeck((prev) => prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)));
    const next = [...picked, index];
    setPicked(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  const restart = () => {
    setDeck(newDeck());
    setPicked([]);
    setMoves(0);
    setDone(false);
  };

  return (
    <GameShell title="Memory Garden" status={`${t('level')} 1 • Easy`}>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        {done ? (
          <GameOver
            score={Math.max(20, Math.round((8 / Math.max(moves, 8)) * 100))}
            detail={`${pairs} pairs in ${moves} moves`}
            onPlayAgain={restart}
          />
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.md,
                justifyContent: 'center',
              }}
            >
              {deck.map((c, i) => {
                const face = c.flipped || c.matched;
                return (
                  <Pressable
                    key={c.id}
                    accessibilityRole="button"
                    accessibilityLabel={face ? c.symbol : 'Hidden card'}
                    onPress={() => flip(i)}
                    style={{
                      width: 72,
                      height: 82,
                      borderRadius: radius.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: c.matched
                        ? colors.tealSoft
                        : face
                          ? colors.surface
                          : colors.teal,
                      borderWidth: 2,
                      borderColor: c.matched ? colors.teal : colors.tealLine,
                    }}
                  >
                    <T size={32}>{face ? c.symbol : '🌱'}</T>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <T size={13} color={colors.muted}>
                  Pairs Found
                </T>
                <T size={22} weight="800" color={colors.teal}>
                  {pairs} / 8
                </T>
              </Card>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <T size={13} color={colors.muted}>
                  Moves
                </T>
                <T size={22} weight="800" color={colors.teal}>
                  {moves}
                </T>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </GameShell>
  );
}
