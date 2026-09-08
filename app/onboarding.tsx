import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Button, Card, Ministry, OptionRow, Screen, SectionTitle, T } from '../src/components/ui';
import { LANGUAGES } from '../src/i18n/languages';
import type {
  ActivityLevel,
  ActivityTag,
  ComfortLevel,
  Difficulty,
  Gender,
  SessionMinutes,
} from '../src/lib/types';
import { useApp } from '../src/store/AppProvider';
import { colors, radius, spacing } from '../src/theme';

const AVATARS = [
  { id: 'gentle-elder', emoji: '🧓', label: 'Gentle Elder' },
  { id: 'garden', emoji: '🌻', label: 'Sunflower' },
  { id: 'hills', emoji: '⛰️', label: 'Hills' },
  { id: 'tea', emoji: '🍵', label: 'Tea' },
];

const COMFORT: { value: ComfortLevel; label: string }[] = [
  { value: 'very', label: 'Very Comfortable' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'sometimes', label: 'Sometimes Difficult' },
  { value: 'often', label: 'Often Difficult' },
  { value: 'noSay', label: 'Prefer not to answer' },
];

const FOCUS: { value: ComfortLevel; label: string }[] = [
  { value: 'very', label: 'Very Easy' },
  { value: 'comfortable', label: 'Easy' },
  { value: 'sometimes', label: 'Sometimes Difficult' },
  { value: 'often', label: 'Often Difficult' },
  { value: 'noSay', label: 'Prefer not to answer' },
];

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: 'very', label: 'Very Active' },
  { value: 'active', label: 'Active' },
  { value: 'moderate', label: 'Moderately Active' },
  { value: 'less', label: 'Less Active' },
];

const TAGS: { value: ActivityTag; label: string; hint: string }[] = [
  { value: 'memory', label: 'Memory Games', hint: 'Remember plants, shapes & cards' },
  { value: 'picture', label: 'Picture Games', hint: 'Visual recall and recognition' },
  { value: 'word', label: 'Word Games', hint: 'Vocabulary, letters & crosswords' },
  { value: 'puzzle', label: 'Puzzle Games', hint: 'Mazes, sorting & logic paths' },
  { value: 'music', label: 'Music & Sounds', hint: 'Melodies, sound pairs & rhythms' },
  { value: 'story', label: 'Stories & Lore', hint: 'Regional folk tales and narratives' },
  { value: 'number', label: 'Number Games', hint: 'Gentle math and counting' },
  { value: 'challenge', label: 'Simple Challenges', hint: 'Fun daily goals & streaks' },
];

const DURATIONS: { value: SessionMinutes; label: string; hint: string }[] = [
  { value: 5, label: '5 minutes', hint: 'Quick & refreshing session' },
  { value: 10, label: '10 minutes', hint: 'Balanced daily playtime' },
  { value: 15, label: '15 minutes', hint: 'Immersive focus and relaxation' },
  { value: 20, label: '20+ minutes', hint: 'Extended exploration & games' },
];

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'relaxed', label: 'Relaxed', hint: 'Gentle, zero pressure, calming' },
  { value: 'easy', label: 'Easy', hint: 'Fun, approachable, encouraging' },
  { value: 'moderate', label: 'Moderate', hint: 'Pleasant mental exercise' },
  { value: 'challenging', label: 'Challenging', hint: 'Engaging brain puzzles' },
];

export default function Onboarding() {
  const router = useRouter();
  const { t, account, updateAccount, profile, saveProfile, language, scale } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(account?.name ?? '');
  const [age, setAge] = useState(account?.age ?? 68);
  const [gender, setGender] = useState<Gender>(account?.gender ?? 'unspecified');
  const [avatar, setAvatar] = useState(account?.avatar ?? 'gentle-elder');
  const [draft, setDraft] = useState(profile);

  const lang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const toggleTag = (tag: ActivityTag) => {
    setDraft((d) => ({
      ...d,
      favourites: d.favourites.includes(tag)
        ? d.favourites.filter((x) => x !== tag)
        : [...d.favourites, tag],
    }));
  };

  const goNext = async () => {
    if (step === 1) {
      await updateAccount({ name: name.trim() || account?.name || 'Friend', age, gender, avatar });
      setStep(2);
      return;
    }
    if (step === 2) {
      await saveProfile(draft);
      setStep(3);
      return;
    }
    await updateAccount({ onboarded: true });
    router.replace('/home');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        {step > 1 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back to previous step"
            onPress={() => setStep(step - 1)}
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.tealLine,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T size={22} weight="800" color={colors.teal}>
              ←
            </T>
          </Pressable>
        )}
        <T size={22} weight="800" color={colors.teal} style={{ flex: 1 }} align="center">
          nimo
        </T>
        {step > 1 && <View style={{ width: 48 }} />}
      </View>

      <StepBar step={step} />

      {step === 1 && (
        <>
          <T size={26} weight="800" align="center">
            {t('onbStep1Title')}
          </T>
          <T size={15} color={colors.muted} align="center">
            {t('onbStep1Blurb')}
          </T>

          <Card style={{ gap: spacing.sm }}>
            <T size={16} weight="700">
              {t('authNameLabel')}
            </T>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('authNamePlaceholder')}
              placeholderTextColor={colors.muted}
              accessibilityLabel={t('authNameLabel')}
              style={{
                minHeight: 56,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: colors.tealLine,
                paddingHorizontal: spacing.lg,
                fontSize: Math.round(18 * scale),
                color: colors.ink,
                backgroundColor: colors.cream,
              }}
            />
          </Card>

          <Card style={{ gap: spacing.md }}>
            <T size={16} weight="700">
              {t('onbAgeLabel')}
            </T>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stepper label="Decrease age by 1 year" onPress={() => setAge(Math.max(40, age - 1))}>
                −
              </Stepper>
              <View style={{ alignItems: 'center' }}>
                <T size={38} weight="900" color={colors.teal}>
                  {age}
                </T>
                <T size={13} color={colors.muted}>
                  {t('onbYearsOld')}
                </T>
              </View>
              <Stepper label="Increase age by 1 year" onPress={() => setAge(Math.min(110, age + 1))}>
                +
              </Stepper>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.sm,
                alignItems: 'center',
              }}
            >
              <T size={13} color={colors.muted}>
                {t('onbQuickSelect')}
              </T>
              {[
                { label: '50s', value: 55 },
                { label: '60s', value: 65 },
                { label: '70s', value: 75 },
                { label: '80+', value: 85 },
              ].map((q) => {
                const on = Math.floor(age / 10) === Math.floor(q.value / 10);
                return (
                  <Pressable
                    key={q.label}
                    accessibilityRole="button"
                    accessibilityLabel={`Select age around ${q.label}`}
                    onPress={() => setAge(q.value)}
                    style={{
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: radius.pill,
                      backgroundColor: on ? colors.teal : colors.tealMist,
                    }}
                  >
                    <T size={14} weight="700" color={on ? colors.onTeal : colors.teal}>
                      {q.label}
                    </T>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <SectionTitle>{t('onbGender')}</SectionTitle>
          <View style={{ gap: spacing.sm }}>
            {(
              [
                ['male', t('onbMale')],
                ['female', t('onbFemale')],
                ['unspecified', t('onbNoSay')],
              ] as [Gender, string][]
            ).map(([value, label]) => (
              <OptionRow
                key={value}
                label={label}
                selected={gender === value}
                onPress={() => setGender(value)}
              />
            ))}
          </View>

          <SectionTitle>
            {t('onbPhoto')} · {t('onbOptional')}
          </SectionTitle>
          <View style={{ flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' }}>
            {AVATARS.map((a) => {
              const on = a.id === avatar;
              return (
                <Pressable
                  key={a.id}
                  accessibilityRole="button"
                  accessibilityLabel={a.label}
                  onPress={() => setAvatar(a.id)}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: on ? colors.tealSoft : colors.surface,
                    borderWidth: on ? 3 : 1.5,
                    borderColor: on ? colors.teal : colors.tealLine,
                  }}
                >
                  <T size={34}>{a.emoji}</T>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <T size={26} weight="800" align="center">
            {t('onbStep2Title')}
          </T>
          <T size={15} color={colors.muted} align="center">
            {t('onbStep2Blurb')}
          </T>

          <Question title={t('onbQMemory')}>
            {COMFORT.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                selected={draft.memoryComfort === o.value}
                onPress={() => setDraft({ ...draft, memoryComfort: o.value })}
              />
            ))}
          </Question>

          <Question title={t('onbQFocus')}>
            {FOCUS.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                selected={draft.focus === o.value}
                onPress={() => setDraft({ ...draft, focus: o.value })}
              />
            ))}
          </Question>

          <Question title={t('onbQActive')}>
            {ACTIVITY.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                selected={draft.activity === o.value}
                onPress={() => setDraft({ ...draft, activity: o.value })}
              />
            ))}
          </Question>

          <Question title={t('onbQEnjoy')} hint={t('onbQEnjoyHint')}>
            {TAGS.map((o) => (
              <OptionRow
                key={o.value}
                multi
                label={o.label}
                hint={o.hint}
                selected={draft.favourites.includes(o.value)}
                onPress={() => toggleTag(o.value)}
              />
            ))}
          </Question>

          <Question title={t('onbQDuration')}>
            {DURATIONS.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                hint={o.hint}
                selected={draft.sessionMinutes === o.value}
                onPress={() => setDraft({ ...draft, sessionMinutes: o.value })}
              />
            ))}
          </Question>

          <Question title={t('onbQDifficulty')}>
            {DIFFICULTIES.map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                hint={o.hint}
                selected={draft.difficulty === o.value}
                onPress={() => setDraft({ ...draft, difficulty: o.value })}
              />
            ))}
          </Question>
        </>
      )}

      {step === 3 && (
        <>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <T size={56}>🎉</T>
            <T size={26} weight="800" align="center">
              {t('onbStep3Title')}
            </T>
            <T size={17} weight="600" color={colors.teal} align="center">
              {t('onbWelcomeUser', { name: name.trim() || account?.name || 'Friend' })}
            </T>
            <T size={15} color={colors.muted} align="center">
              {t('onbReadyBlurb')}
            </T>
          </View>

          <SectionTitle>{t('onbSetupHeading')}</SectionTitle>
          <Card style={{ gap: spacing.md }}>
            <SummaryRow label={t('onbLanguage')} value={lang.label.split(' (')[0]} />
            <SummaryRow
              label={t('onbPace')}
              value={DIFFICULTIES.find((d) => d.value === draft.difficulty)?.label ?? '—'}
            />
            <SummaryRow label={t('onbTarget')} value={`${draft.sessionMinutes} Minutes`} />
            <SummaryRow
              label={t('onbFavourites')}
              value={
                draft.favourites.length
                  ? draft.favourites
                      .map((f) => TAGS.find((tg) => tg.value === f)?.label ?? f)
                      .join(', ')
                  : '—'
              }
            />
          </Card>
        </>
      )}

      <Button label={step === 3 ? t('onbStartCta') : t('continue')} onPress={goNext} />
      <Ministry />
    </Screen>
  );
}

function StepBar({ step }: { step: number }) {
  const { t } = useApp();
  const labels = ['Profile Information', 'Personalization', 'Confirmation'];
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{
            backgroundColor: colors.tealMist,
            paddingHorizontal: spacing.md,
            paddingVertical: 4,
            borderRadius: radius.pill,
          }}
        >
          <T size={12} weight="700" color={colors.teal}>
            {t('onbStep', { n: step })}
          </T>
        </View>
        <T size={12} color={colors.muted}>
          {labels[step - 1]}
        </T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3].map((n, i) => (
          <React.Fragment key={n}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: n <= step ? colors.teal : colors.surface,
                borderWidth: 1.5,
                borderColor: n <= step ? colors.teal : colors.tealLine,
              }}
            >
              <T size={14} weight="800" color={n <= step ? colors.onTeal : colors.muted}>
                {n < step ? '✓' : n}
              </T>
            </View>
            {i < 2 && (
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: n < step ? colors.teal : colors.tealLine,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

function Question({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      <T size={17} weight="700">
        {title}
      </T>
      {!!hint && (
        <T size={13} color={colors.muted}>
          {hint}
        </T>
      )}
      <View style={{ gap: spacing.sm }}>{children}</View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <T size={14} color={colors.muted}>
        {label}
      </T>
      <T size={14} weight="700" style={{ flex: 1 }} align="right">
        {value}
      </T>
    </View>
  );
}

function Stepper({
  children,
  onPress,
  label,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: 56,
        height: 56,
        borderRadius: radius.pill,
        backgroundColor: colors.tealMist,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T size={28} weight="800" color={colors.teal}>
        {children}
      </T>
    </Pressable>
  );
}
