import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, Card, Chip, Ministry, Screen, T } from '../../src/components/ui';
import { formatTime12h } from '../../src/lib/time';
import type { ReminderCategory } from '../../src/lib/types';
import { useApp } from '../../src/store/AppProvider';
import { colors, radius, spacing } from '../../src/theme';

const CATEGORIES: ReminderCategory[] = [
  'medication',
  'appointment',
  'task',
  'hydration',
  'exercise',
];

export default function Reminders() {
  const { t, reminders, addReminder, toggleReminder, deleteReminder, scale } = useApp();
  const [filter, setFilter] = useState<ReminderCategory | 'all'>('all');
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('medication');

  const visible = reminders.filter((r) => filter === 'all' || r.category === filter);
  const active = reminders.filter((r) => !r.done).length;

  const input = {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.tealLine,
    paddingHorizontal: spacing.lg,
    fontSize: Math.round(17 * scale),
    color: colors.ink,
    backgroundColor: colors.cream,
  } as const;

  const submit = async () => {
    if (!title.trim()) return;
    await addReminder({ category, title: title.trim(), time, note: note.trim() });
    setTitle('');
    setNote('');
    setAdding(false);
  };

  return (
    <Screen>
      <T size={26} weight="800">
        {t('remindersTitle')}
      </T>
      <T size={14} color={colors.muted}>
        {t('remindersCount', { n: active })}
      </T>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Chip label={t('reminderAll')} selected={filter === 'all'} onPress={() => setFilter('all')} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c[0].toUpperCase() + c.slice(1)}
            selected={filter === c}
            onPress={() => setFilter(c)}
          />
        ))}
      </View>

      <Button
        label={adding ? t('cancel') : t('reminderAdd')}
        variant="secondary"
        onPress={() => setAdding((v) => !v)}
      />

      {adding && (
        <Card style={{ gap: spacing.md }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What should we remind you about?"
            placeholderTextColor={colors.muted}
            style={input}
            accessibilityLabel="Reminder title"
          />
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="HH:MM"
            placeholderTextColor={colors.muted}
            style={input}
            accessibilityLabel="Reminder time"
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Note (optional)"
            placeholderTextColor={colors.muted}
            style={input}
            accessibilityLabel="Reminder note"
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c[0].toUpperCase() + c.slice(1)}
                selected={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
          <Button label={t('save')} onPress={submit} disabled={!title.trim()} />
        </Card>
      )}

      {visible.length === 0 && (
        <Card>
          <T size={15} color={colors.muted} align="center">
            {t('reminderEmpty')}
          </T>
        </Card>
      )}

      <View style={{ gap: spacing.md }}>
        {visible.map((r) => (
          <Card key={r.id} style={{ gap: spacing.sm, opacity: r.done ? 0.55 : 1 }}>
            <T size={11} weight="800" color={colors.coral}>
              {r.category.toUpperCase()}
            </T>
            <T
              size={18}
              weight="700"
              style={r.done ? { textDecorationLine: 'line-through' } : undefined}
            >
              {r.title}
            </T>
            <T size={15} weight="700" color={colors.teal}>
              {formatTime12h(r.time)}
            </T>
            {!!r.note && (
              <T size={13} color={colors.muted}>
                {r.note}
              </T>
            )}
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button
                label={r.done ? t('reminderDone') + ' ✓' : t('reminderDone')}
                variant="secondary"
                onPress={() => toggleReminder(r.id)}
                style={{ flex: 1 }}
              />
              <Button
                label={t('reminderDelete')}
                variant="danger"
                onPress={() => deleteReminder(r.id)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ))}
      </View>
      <Ministry />
    </Screen>
  );
}
