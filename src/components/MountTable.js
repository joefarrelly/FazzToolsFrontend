import React, { useState } from 'react';
import CollapsePanel from 'components/CollapsePanel';

function MountTableRow({ alt, grayclass }) {
  return (
    <div
      className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded mb-1 px-3 py-1"
      style={{ width: '22rem' }}
    >
      <span className="text-sm text-zinc-200">{alt['name']}</span>
      <div className={grayclass}>
        <img
          src={alt['icon']}
          title={alt['name']}
          alt="No Icon"
          width="48"
          height="48"
          className="rounded"
        />
      </div>
    </div>
  );
}

function MountTableCol({ alt }) {
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
          {alt[1].collected.map((row, index) => (
            <MountTableRow alt={row} key={index} grayclass="epic" />
          ))}
          {alt[1].uncollected.map((row, index) => (
            <MountTableRow alt={row} key={index} grayclass="epic uncollected" />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

function MountTable({ alts }) {
  return (
    <div className="space-y-1">
      {alts.map((col, index) => (
        <MountTableCol alt={col} key={index} />
      ))}
    </div>
  );
}

export default MountTable;
