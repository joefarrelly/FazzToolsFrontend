import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CollapsePanel from 'components/CollapsePanel';
import { classColor } from 'classColors';

export interface AccountAlt {
  altId: number;
  name: string;
  realm: string;
  realmSlug: string;
  level: number;
  race: string;
  className: string;
  faction: string;
  ilvl: number;
}

interface AccountAltRowProps {
  alt: AccountAlt;
  mythicRating: number | null;
  professions: [string, string] | null;
}

function AccountAltRow({ alt, mythicRating, professions }: AccountAltRowProps) {
  const [open, setOpen] = useState(false);
  const color = classColor(alt.className) ?? '#e4e4e7';

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-zinc-500 shrink-0">{alt.level}</span>
          <Link
            to={`/alt/${alt.name.toLowerCase()}/${alt.realmSlug}`}
            onClick={(e) => e.stopPropagation()}
            style={{ color }}
            className="text-sm font-medium hover:underline underline-offset-2 truncate"
          >
            {alt.name}
          </Link>
          <span className="text-xs text-zinc-500 truncate">{alt.realm}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-zinc-400">{alt.faction}</span>
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="text-zinc-400">
            ilvl <span className="text-zinc-200">{alt.ilvl || '—'}</span>
          </span>
          <span className="text-zinc-400">
            M+ rating{' '}
            <span className="text-zinc-200">
              {mythicRating !== null ? mythicRating.toFixed(1) : '—'}
            </span>
          </span>
          <span className="text-zinc-400">
            Professions{' '}
            <span className="text-zinc-200">
              {professions ? professions.filter((p) => p !== 'Missing').join(' / ') || '—' : '—'}
            </span>
          </span>
        </div>
      </CollapsePanel>
    </div>
  );
}

export default AccountAltRow;
