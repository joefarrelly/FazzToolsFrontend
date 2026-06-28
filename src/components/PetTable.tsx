import React, { useState } from 'react';
import CollapsePanel from 'components/CollapsePanel';
import type { CollectionEntry, PetItem } from 'types';

interface PetIconProps {
  pet: PetItem;
  collected: boolean;
}

function PetIcon({ pet, collected }: PetIconProps) {
  const img = (
    <img
      src={pet.icon}
      title={pet.name}
      alt={pet.name}
      width="48"
      height="48"
      className="rounded block"
    />
  );
  return (
    <div className={collected ? 'epic' : 'epic uncollected'}>
      {pet.link ? (
        <a href={pet.link} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}

interface PetTableColProps {
  alt: CollectionEntry;
}

function PetTableCol({ alt }: PetTableColProps) {
  const [open, setOpen] = useState(false);
  const [showUncollected, setShowUncollected] = useState(false);
  const { collected_count, total_count, collected, uncollected } = alt[1];
  const pct = total_count > 0 ? Math.round((collected_count / total_count) * 100) : 0;
  const collectedPets = collected as PetItem[];
  const uncollectedPets = uncollected as PetItem[];

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
            {collectedPets.map((p, i) => (
              <PetIcon key={i} pet={p} collected />
            ))}
          </div>
          {uncollectedPets.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowUncollected(!showUncollected)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-1"
              >
                {showUncollected ? '▲ Hide' : '▼ Show'} {uncollectedPets.length} uncollected
              </button>
              {showUncollected && (
                <div className="flex flex-wrap gap-1">
                  {uncollectedPets.map((p, i) => (
                    <PetIcon key={i} pet={p} collected={false} />
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

function PetTable({ alts }: { alts: CollectionEntry[] }) {
  return (
    <div>
      {alts.map((col, index) => (
        <PetTableCol alt={col} key={index} />
      ))}
    </div>
  );
}

export default PetTable;
