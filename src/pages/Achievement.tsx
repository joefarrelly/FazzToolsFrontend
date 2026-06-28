import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CollapsePanel from 'components/CollapsePanel';
import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { AchievementEntry } from 'types';

interface CategorySummary {
  category_name: string;
  count: number;
  points: number;
}

const CATEGORY_ORDER = [
  'Character',
  'Quests',
  'Exploration',
  'Player vs. Player',
  'Dungeons & Raids',
  'Professions',
  'Reputation',
  'World Events',
  'Pet Battles',
  'Collections',
  'Expansion Features',
];

function categorySort(a: string, b: string): number {
  const ai = CATEGORY_ORDER.indexOf(a);
  const bi = CATEGORY_ORDER.indexOf(b);
  if (ai === -1 && bi === -1) return a.localeCompare(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
}

interface CategoryPanelProps {
  summary: CategorySummary;
  userId: string;
}

function CategoryPanel({ summary, userId }: CategoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !fetched) {
      setLoading(true);
      try {
        const res = await axios.get(config.url.API_URL + '/api/profile/altachievements/', {
          params: { user: userId, category: summary.category_name },
        });
        setAchievements(res.data as AchievementEntry[]);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    }
  }

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-zinc-200">{summary.category_name}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">{summary.count} earned</span>
          <span className="text-xs text-amber-400 font-semibold">
            {summary.points.toLocaleString()} pts
          </span>
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-1 pl-1">
          {loading && (
            <div className="py-3 px-3">
              <LoadingSpinner />
            </div>
          )}
          {!loading && fetched && (
            <div className="space-y-1">
              {achievements.map((a) => (
                <div
                  key={a.achievement}
                  className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2"
                >
                  <span className="text-sm text-zinc-200">{a.achievement_name}</span>
                  <span className="text-xs text-amber-400/80 font-medium ml-4 shrink-0">
                    {a.achievement_points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsePanel>
    </div>
  );
}

function Achievement() {
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = cookies.get<string>('userid') ?? '';

  useEffect(() => {
    async function getSummary() {
      try {
        const res = await axios.get(config.url.API_URL + '/api/profile/altachievements/', {
          params: { user: userId, summary: 1 },
        });
        setSummary(res.data as CategorySummary[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getSummary();
  }, [userId]);

  const sorted = useMemo(
    () => [...summary].sort((a, b) => categorySort(a.category_name, b.category_name)),
    [summary]
  );

  const totalPoints = useMemo(() => summary.reduce((s, c) => s + c.points, 0), [summary]);

  return (
    <PageLayout title={`Achievements — ${totalPoints.toLocaleString()} pts`}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && sorted.length === 0 && (
        <p className="text-zinc-500 text-sm">No achievements found. Run a scan first.</p>
      )}
      {!loading && !error && sorted.length > 0 && (
        <div className="max-w-2xl">
          {sorted.map((cat) => (
            <CategoryPanel key={cat.category_name} summary={cat} userId={userId} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Achievement;
