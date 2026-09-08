import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../store/AppProvider';
import { colors, MIN_TAP, radius, shadow, spacing } from '../theme';

/**
 * Every piece of text in NIMO goes through <T>, so the accessibility text-size
 * setting scales the entire app from one place.
 */
export function T({
  children,
  size = 16,
  weight = '500',
  color = colors.ink,
  align,
  style,
  numberOfLines,
  onPress,
}: {
  children: React.ReactNode;
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: () => void;
}) {
  const { scale } = useApp();
  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[
        {
          fontSize: Math.round(size * scale),
          lineHeight: Math.round(size * scale * 1.4),
          fontWeight: weight,
          color,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const inner = (
    <View style={[padded && { padding: spacing.lg, gap: spacing.lg }, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    primary: { bg: colors.coral, fg: colors.onTeal, border: 'transparent' },
    secondary: { bg: colors.tealMist, fg: colors.teal, border: colors.tealSoft },
    ghost: { bg: 'transparent', fg: colors.teal, border: 'transparent' },
    danger: { bg: colors.surface, fg: colors.danger, border: colors.danger },
  }[variant];

  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: inactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <T size={18} weight="700" color={palette.fg} align="center">
          {label}
        </T>
      )}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <T size={13} weight="700" color={colors.muted} style={{ letterSpacing: 1 }}>
      {children}
    </T>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.teal : colors.surface,
          borderColor: selected ? colors.teal : colors.tealLine,
        },
      ]}
    >
      <T size={15} weight="600" color={selected ? colors.onTeal : colors.inkSoft}>
        {label}
      </T>
    </Pressable>
  );
}

/** Radio / checkbox row used all over onboarding and the profile screen. */
export function OptionRow({
  label,
  hint,
  selected,
  onPress,
  multi,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.optionRow,
        { borderColor: selected ? colors.teal : colors.tealLine },
        selected && { backgroundColor: colors.tealMist },
      ]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <T size={17} weight="600">
          {label}
        </T>
        {!!hint && (
          <T size={13} color={colors.muted}>
            {hint}
          </T>
        )}
      </View>
      <View
        style={[
          styles.tick,
          {
            borderColor: selected ? colors.teal : colors.tealLine,
            backgroundColor: selected ? colors.teal : 'transparent',
            borderRadius: multi ? 6 : radius.pill,
          },
        ]}
      >
        {selected && (
          <T size={14} weight="900" color={colors.onTeal}>
            ✓
          </T>
        )}
      </View>
    </Pressable>
  );
}

export function StatTile({
  value,
  label,
  hint,
}: {
  value: string | number;
  label: string;
  hint?: string;
}) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.lg }}>
      <T size={26} weight="800" color={colors.teal}>
        {value}
      </T>
      <T size={13} color={colors.muted} align="center">
        {label}
      </T>
      {!!hint && (
        <T size={12} color={colors.success}>
          {hint}
        </T>
      )}
    </Card>
  );
}

export function Ministry() {
  const { t } = useApp();
  return (
    <T size={11} color={colors.muted} align="center" style={{ marginTop: spacing.xl }}>
      {t('ministry')}
    </T>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.tealLine }} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.tealLine,
    ...shadow.card,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  button: {
    minHeight: MIN_TAP,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  optionRow: {
    minHeight: MIN_TAP,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tick: {
    width: 28,
    height: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
