import type { ActivityTag, CognitiveDomain } from './types';

export type GameCategory = 'memory' | 'attention' | 'logic' | 'language' | 'family';

export type GameMeta = {
  id: string;
  route: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: GameCategory;
  domain: CognitiveDomain;
  tags: ActivityTag[];
  badge?: 'popular' | 'new' | 'today' | 'multiplayer';
};

export const GAMES: GameMeta[] = [
  {
    id: 'memory-garden',
    route: '/games/memory-garden',
    title: 'Memory Garden',
    subtitle: 'Recall & Practice',
    emoji: '🌿',
    category: 'memory',
    domain: 'memory',
    tags: ['memory'],
    badge: 'popular',
  },
  {
    id: 'math-rain',
    route: '/games/math-rain',
    title: 'Math Rain',
    subtitle: 'Raindrop Arithmetic',
    emoji: '💧',
    category: 'logic',
    domain: 'problem',
    tags: ['number', 'challenge'],
    badge: 'new',
  },
  {
    id: 'pattern-path',
    route: '/games/pattern-path',
    title: 'Pattern Path',
    subtitle: 'Focus & Attention',
    emoji: '🔆',
    category: 'attention',
    domain: 'attention',
    tags: ['puzzle'],
    badge: 'today',
  },
  {
    id: 'picture-recall',
    route: '/games/picture-recall',
    title: 'Picture Recall',
    subtitle: 'Remember What You See',
    emoji: '🖼️',
    category: 'memory',
    domain: 'memory',
    tags: ['picture', 'memory'],
  },
  {
    id: 'word-trek',
    route: '/games/word-trek',
    title: 'Word Trek',
    subtitle: 'Language & Thinking',
    emoji: '🔤',
    category: 'language',
    domain: 'language',
    tags: ['word', 'story'],
  },
  {
    id: 'two-player',
    route: '/games/two-player',
    title: 'Family Play',
    subtitle: 'Play with family or caregiver',
    emoji: '👨‍👩‍👧',
    category: 'family',
    domain: 'attention',
    tags: ['challenge'],
    badge: 'multiplayer',
  },
];

export function gameById(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}

/** Games whose tags overlap the person's chosen favourites, best matches first. */
export function recommendedGames(favourites: ActivityTag[], limit = 4): GameMeta[] {
  const scored = GAMES.filter((g) => g.category !== 'family').map((g) => ({
    game: g,
    hits: g.tags.filter((t) => favourites.includes(t)).length,
  }));
  scored.sort((a, b) => b.hits - a.hits);
  return scored.slice(0, limit).map((s) => s.game);
}

/** Stable "game of the day" so the Daily Pick does not change on every render. */
export function dailyPick(): GameMeta {
  const playable = GAMES.filter((g) => g.category !== 'family');
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return playable[dayIndex % playable.length];
}
