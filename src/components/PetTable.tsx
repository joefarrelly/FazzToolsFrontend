import React, { useState } from 'react';
import CollapsePanel from 'components/CollapsePanel';
import type { CollectionEntry, PetItem } from 'types';

interface PetTableRowProps {
  alt: PetItem;
  grayclass: string;
}

function PetTableRow({ alt, grayclass }: PetTableRowProps) {
  return (
    <div
      className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded mb-1 px-3 py-1"
      style={{ width: '22rem' }}
    >
      <span className="text-sm text-zinc-200">{alt.name}</span>
      <div className={grayclass}>
        <a href={alt.link} target="_blank" rel="noopener noreferrer">
          <img
            src={alt.icon}
            title={alt.name}
            alt="No Icon"
            width="48"
            height="48"
            className="rounded"
          />
        </a>
      </div>
    </div>
  );
}

interface PetTableColProps {
  alt: CollectionEntry;
}

function PetTableCol({ alt }: PetTableColProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded transition-colors text-sm flex items-center justify-between"
        style={{ width: '22rem' }}
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span>{alt[0]}</span>
        <span className="text-zinc-400 text-xs">
          {alt[1].collected_count}/{alt[1].total_count}
        </span>
      </button>
      <CollapsePanel open={open}>
        <div className="pt-1 pl-1">
          {(alt[1].collected as PetItem[]).map((row, index) => (
            <PetTableRow alt={row} key={index} grayclass="epic" />
          ))}
          {(alt[1].uncollected as PetItem[]).map((row, index) => (
            <PetTableRow alt={row} key={index} grayclass="epic uncollected" />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

interface PetTableProps {
  alts: CollectionEntry[];
}

function PetTable({ alts }: PetTableProps) {
  return (
    <div className="space-y-1">
      {alts.map((col, index) => (
        <PetTableCol alt={col} key={index} />
      ))}
    </div>
  );
}

export default PetTable;
