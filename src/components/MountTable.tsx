import React, { useState } from 'react';
import CollapsePanel from 'components/CollapsePanel';
import type { CollectionEntry, MountItem } from 'types';

interface MountIconProps {
  mount: MountItem;
  collected: boolean;
}

function MountIcon({ mount, collected }: MountIconProps) {
  return (
    <div className={collected ? 'epic' : 'epic uncollected'}>
      <img
        src={mount.icon}
        title={mount.name}
        alt={mount.name}
        width="48"
        height="48"
        className="rounded block"
      />
    </div>
  );
}

interface MountTableColProps {
  alt: CollectionEntry;
}

function MountTableCol({ alt }: MountTableColProps) {
  const [open, setOpen] = useState(false);
  const [showUncollected, setShowUncollected] = useState(false);
  const { collected_count, total_count, collected, uncollected } = alt[1];
  const pct = total_count > 0 ? Math.round((collected_count / total_count) * 100) : 0;
  const collectedMounts = collected as MountItem[];
  const uncollectedMounts = uncollected as MountItem[];

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-zinc-200">{alt[0]}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">
            {collected_count}/{total_count}
          </span>
          <span className="text-xs text-amber-400 font-semibold">{pct}%</span>
          <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <CollapsePanel open={open}>
        <div className="mt-2 pl-1">
          <div className="flex flex-wrap gap-1">
            {collectedMounts.map((m, i) => (
              <MountIcon key={i} mount={m} collected />
            ))}
          </div>
          {uncollectedMounts.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowUncollected(!showUncollected)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-1"
              >
                {showUncollected ? '▲ Hide' : '▼ Show'} {uncollectedMounts.length} uncollected
              </button>
              {showUncollected && (
                <div className="flex flex-wrap gap-1">
                  {uncollectedMounts.map((m, i) => (
                    <MountIcon key={i} mount={m} collected={false} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsePanel>
    </div>
  );
}

interface MountTableProps {
  alts: CollectionEntry[];
}

function MountTable({ alts }: MountTableProps) {
  return (
    <div>
      {alts.map((col, index) => (
        <MountTableCol alt={col} key={index} />
      ))}
    </div>
  );
}

export default MountTable;
