import type { CognitiveDomain, PlayRecord, Progress } from './types';

const DOMAINS: CognitiveDomain[] = ['memory', 'attention', 'language', 'problem'];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function playsToday(progress: Progress): PlayRecord[] {
  const from = startOfToday();
  return progress.plays.filter((p) => p.playedAt >= from);
}

export function playsWithin(progress: Progress, days: number): PlayRecord[] {
  const from = startOfToday() - (days - 1) * 86_400_000;
  return progress.plays.filter((p) => p.playedAt >= from);
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Average of the last 20 plays in a domain, rounded. 0 when never played. */
export function domainScore(progress: Progress, domain: CognitiveDomain): number {
  const recent = progress.plays
    .filter((p) => p.domain === domain)
    .slice(-20)
    .map((p) => p.score);
  return Math.round(mean(recent));
}

export function domainScores(progress: Progress): Record<CognitiveDomain, number> {
  return DOMAINS.reduce(
    (acc, d) => {
      acc[d] = domainScore(progress, d);
      return acc;
    },
    {} as Record<CognitiveDomain, number>,
  );
}

/**
 * Headline 0-100 "Activity Score": how well the person is playing, nudged by
 * how much they have played today. A brand-new account scores 0 rather than
 * showing an invented number.
 */
export function activityScore(progress: Progress): number {
  if (!progress.plays.length) return 0;
  const quality = mean(progress.plays.slice(-20).map((p) => p.score));
  const consistency = Math.min(playsToday(progress).length, 3) / 3;
  return Math.round(quality * 0.8 + consistency * 20);
}

export function rating(score: number): 'building' | 'fair' | 'good' | 'strong' {
  if (score >= 85) return 'strong';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'building';
}

/** Seven day-by-day totals ending today, for the progress chart. */
export function weeklySeries(progress: Progress): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = startOfToday() - i * 86_400_000;
    const dayEnd = dayStart + 86_400_000;
    const scores = progress.plays
      .filter((p) => p.playedAt >= dayStart && p.playedAt < dayEnd)
      .map((p) => p.score);
    out.push({
      label: String(new Date(dayStart).getDate()),
      value: Math.round(mean(scores)),
    });
  }
  return out;
}

export function relativeTime(ts: number | null): string {
  if (!ts) return '—';
  const mins = Math.round((Date.now() - ts) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
