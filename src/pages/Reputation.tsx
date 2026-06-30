import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CollapsePanel from 'components/CollapsePanel';
import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';
import { cookies } from 'cookies';
import { config } from 'Constants';
import type { ReputationEntry } from 'types';

// Derive standing from raw rep value using WoW's fixed thresholds.
// standing_type stored in DB is currently unreliable (was pulling wrong field from API).
function standingFromRaw(raw: number): string {
  if (raw >= 42000) return 'Exalted';
  if (raw >= 21000) return 'Revered';
  if (raw >= 9000) return 'Honored';
  if (raw >= 3000) return 'Friendly';
  if (raw >= 0) return 'Neutral';
  if (raw >= -3000) return 'Unfriendly';
  if (raw >= -6000) return 'Hostile';
  return 'Hated';
}

// Progress within the current tier as a percentage.
const TIER_MIN: Record<string, number> = {
  Hated: -42000,
  Hostile: -6000,
  Unfriendly: -3000,
  Neutral: 0,
  Friendly: 3000,
  Honored: 9000,
  Revered: 21000,
  Exalted: 42000,
};
const TIER_MAX: Record<string, number> = {
  Hated: -6001,
  Hostile: -3001,
  Unfriendly: -1,
  Neutral: 2999,
  Friendly: 8999,
  Honored: 20999,
  Revered: 41999,
  Exalted: 42999,
};

function tierPct(standing: string, raw: number): number {
  if (standing === 'Exalted') return 100;
  const min = TIER_MIN[standing] ?? 0;
  const max = TIER_MAX[standing] ?? 0;
  return Math.min(100, Math.max(0, Math.round(((raw - min) / (max - min + 1)) * 100)));
}

function valueLabel(standing: string, raw: number): string {
  if (standing === 'Exalted') return 'Max';
  const min = TIER_MIN[standing];
  const max = TIER_MAX[standing];
  if (min === undefined || max === undefined) return raw.toLocaleString();
  return `${(raw - min).toLocaleString()} / ${(max - min + 1).toLocaleString()}`;
}

const BADGE: Record<string, string> = {
  Exalted: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Revered: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Honored: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Friendly: 'bg-green-500/20 text-green-300 border-green-500/40',
  Neutral: 'bg-zinc-600/40 text-zinc-400 border-zinc-600/60',
  Unfriendly: 'bg-orange-700/20 text-orange-400 border-orange-700/40',
  Hostile: 'bg-red-700/20 text-red-400 border-red-700/40',
  Hated: 'bg-red-900/30 text-red-500 border-red-900/50',
};

const BAR: Record<string, string> = {
  Exalted: 'bg-amber-400',
  Revered: 'bg-purple-400',
  Honored: 'bg-blue-400',
  Friendly: 'bg-green-400',
  Neutral: 'bg-zinc-400',
  Unfriendly: 'bg-orange-500',
  Hostile: 'bg-red-500',
  Hated: 'bg-red-700',
};

interface FactionRowProps {
  rep: ReputationEntry;
}

function FactionRow({ rep }: FactionRowProps) {
  const standing = standingFromRaw(rep.standing_value);
  const pct = tierPct(standing, rep.standing_value);
  const label = valueLabel(standing, rep.standing_value);

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-2 mb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-zinc-200">{rep.faction_name}</span>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <span className="text-xs text-zinc-500">{label}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded border ${BADGE[standing] ?? BADGE['Neutral']}`}
          >
            {standing}
          </span>
        </div>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all ${BAR[standing] ?? BAR['Neutral']}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface ExpansionGroupProps {
  category: string;
  reputations: ReputationEntry[];
}

function ExpansionGroup({ category, reputations }: ExpansionGroupProps) {
  const [open, setOpen] = useState(false);
  const exaltedCount = reputations.filter(
    (r) => standingFromRaw(r.standing_value) === 'Exalted'
  ).length;

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-700/50 hover:bg-zinc-700 px-3 py-2 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {category || 'Other'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{reputations.length}</span>
          {exaltedCount > 0 && (
            <span className="text-xs text-amber-400 font-semibold">{exaltedCount} ✦</span>
          )}
          <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-1 pl-2 space-y-0.5">
          {reputations.map((r) => (
            <FactionRow key={r.faction} rep={r} />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

interface AltPanelProps {
  altName: string;
  reputations: ReputationEntry[];
}

function AltPanel({ altName, reputations }: AltPanelProps) {
  const [open, setOpen] = useState(false);
  const exaltedCount = reputations.filter(
    (r) => standingFromRaw(r.standing_value) === 'Exalted'
  ).length;

  const byCategory = useMemo(() => {
    const EXPANSION_ORDER = [
      'Midnight',
      'The War Within',
      'Dragonflight',
      'Shadowlands',
      'Battle for Azeroth',
      'Legion',
      'Warlords of Draenor',
      'Mists of Pandaria',
      'Cataclysm',
      'Wrath of the Lich King',
      'The Burning Crusade',
      'Classic',
    ];
    const map = new Map<string, ReputationEntry[]>();
    for (const r of reputations) {
      const cat = r.faction_category || 'Other';
      const list = map.get(cat) ?? [];
      list.push(r);
      map.set(cat, list);
    }
    return [...map.entries()].sort(([a], [b]) => {
      const ai = EXPANSION_ORDER.indexOf(a);
      const bi = EXPANSION_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [reputations]);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-zinc-200">{altName}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">{reputations.length} factions</span>
          {exaltedCount > 0 && (
            <span className="text-xs text-amber-400 font-semibold">{exaltedCount} exalted</span>
          )}
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-1 pl-1 space-y-1">
          {byCategory.map(([cat, reps]) => (
            <ExpansionGroup key={cat} category={cat} reputations={reps} />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

function Reputation() {
  const [data, setData] = useState<ReputationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(config.url.API_URL + '/api/profile/altreputations/', {
          params: { user: cookies.get('userid') },
        });
        setData(res.data as ReputationEntry[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const byAlt = useMemo(() => {
    const map = new Map<number, ReputationEntry[]>();
    for (const r of data) {
      const list = map.get(r.alt) ?? [];
      list.push(r);
      map.set(r.alt, list);
    }
    return [...map.values()].sort((a, b) => {
      const exA = a.filter((r) => standingFromRaw(r.standing_value) === 'Exalted').length;
      const exB = b.filter((r) => standingFromRaw(r.standing_value) === 'Exalted').length;
      if (exB !== exA) return exB - exA;
      return (a[0]?.alt_name ?? '').localeCompare(b[0]?.alt_name ?? '');
    });
  }, [data]);

  const totalExalted = useMemo(
    () =>
      new Set(
        data.filter((r) => standingFromRaw(r.standing_value) === 'Exalted').map((r) => r.faction)
      ).size,
    [data]
  );

  return (
    <PageLayout title={`Reputations — ${totalExalted} exalted factions`}>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && byAlt.length === 0 && (
        <p className="text-zinc-500 text-sm">No reputation data found. Run a scan first.</p>
      )}
      {!loading && !error && byAlt.length > 0 && (
        <div className="max-w-2xl">
          {byAlt.map((reps) => (
            <AltPanel key={reps[0]?.alt} altName={reps[0]?.alt_name ?? ''} reputations={reps} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Reputation;
