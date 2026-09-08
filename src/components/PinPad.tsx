import React from 'react';
import { Pressable, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { T } from './ui';

/**
 * A large on-screen keypad. Elderly users on a shared phone found the system
 * keyboard fiddly, and a fixed 4-digit PIN does not need one.
 */
export function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 22,
            height: 22,
            borderRadius: radius.pill,
            borderWidth: 2,
            borderColor: colors.teal,
            backgroundColor: i < filled ? colors.teal : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

export function PinPad({
  onDigit,
  onBackspace,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
      }}
    >
      {keys.map((k, i) => {
        if (k === '') return <View key={i} style={{ width: 84, height: 68 }} />;
        const isBack = k === '⌫';
        return (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={isBack ? 'Delete last digit' : `Digit ${k}`}
            onPress={() => (isBack ? onBackspace() : onDigit(k))}
            style={({ pressed }) => ({
              width: 84,
              height: 68,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? colors.tealSoft : colors.surface,
              borderWidth: 1.5,
              borderColor: colors.tealLine,
            })}
          >
            <T size={isBack ? 22 : 28} weight="700" color={colors.ink}>
              {k}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}
