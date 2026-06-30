import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CollapsePanel from 'components/CollapsePanel';
import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { MythicPlusDungeonEntry, MythicPlusEntry } from 'types';

interface DungeonRowProps {
  dungeon: MythicPlusDungeonEntry;
}

function DungeonRow({ dungeon }: DungeonRowProps) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2 mb-1 flex items-center justify-between">
      <span className="text-sm text-zinc-200">{dungeon.dungeon_name}</span>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <span className="text-xs text-zinc-500">{dungeon.score.toFixed(1)}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${
            dungeon.is_completed_within_time
              ? 'bg-green-500/20 text-green-300 border-green-500/40'
              : 'bg-zinc-600/40 text-zinc-400 border-zinc-600/60'
          }`}
        >
          +{dungeon.keystone_level}
        </span>
      </div>
    </div>
  );
}

interface AltPanelProps {
  altName: string;
  rating: number;
  dungeons: MythicPlusDungeonEntry[];
}

function AltPanel({ altName, rating, dungeons }: AltPanelProps) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => [...dungeons].sort((a, b) => b.score - a.score), [dungeons]);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-zinc-200">{altName}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400 font-semibold">{rating.toFixed(1)} rating</span>
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-1 pl-1 space-y-1">
          {sorted.length === 0 ? (
            <p className="text-zinc-500 text-xs px-2 py-1">No dungeon runs recorded.</p>
          ) : (
            sorted.map((d) => <DungeonRow key={d.dungeon} dungeon={d} />)
          )}
        </div>
      </CollapsePanel>
    </div>
  );
}

function MythicPlus() {
  const [summary, setSummary] = useState<MythicPlusEntry[]>([]);
  const [dungeons, setDungeons] = useState<MythicPlusDungeonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const params = { user: cookies.get('userid') };
        const [summaryRes, dungeonsRes] = await Promise.all([
          axios.get(config.url.API_URL + '/api/profile/altmythicplus/', { params }),
          axios.get(config.url.API_URL + '/api/profile/altmythicplusdungeons/', { params }),
        ]);
        setSummary(summaryRes.data as MythicPlusEntry[]);
        setDungeons(dungeonsRes.data as MythicPlusDungeonEntry[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const byAlt = useMemo(() => {
    const dungeonsByAlt = new Map<number, MythicPlusDungeonEntry[]>();
    for (const d of dungeons) {
      const list = dungeonsByAlt.get(d.alt) ?? [];
      list.push(d);
      dungeonsByAlt.set(d.alt, list);
    }
    return [...summary]
      .sort((a, b) => b.mythic_rating - a.mythic_rating)
      .map((s) => ({ ...s, dungeons: dungeonsByAlt.get(s.alt) ?? [] }));
  }, [summary, dungeons]);

  const topRating = byAlt[0]?.mythic_rating ?? 0;

  return (
    <PageLayout title={`Mythic+ — top rating ${topRating.toFixed(1)}`}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && byAlt.length === 0 && (
        <p className="text-zinc-500 text-sm">No Mythic+ data found. Run a scan first.</p>
      )}
      {!loading && !error && byAlt.length > 0 && (
        <div className="max-w-2xl">
          {byAlt.map((alt) => (
            <AltPanel
              key={alt.alt}
              altName={alt.alt_name}
              rating={alt.mythic_rating}
              dungeons={alt.dungeons}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default MythicPlus;
