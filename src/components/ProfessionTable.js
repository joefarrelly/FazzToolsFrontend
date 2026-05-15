import React, { useState } from 'react';
import CollapsePanel from 'components/CollapsePanel';

function ProfessionTableRow({ recipe }) {
  const [open, setOpen] = useState(false);
  const mats = recipe.slice(3).map((mat, index) => (
    <div className="flex flex-col items-center gap-1" key={index}>
      <img
        className={mat[3].toLowerCase()}
        src={mat[2]}
        title={mat[0]}
        alt={mat[0]}
        width="48"
        height="48"
      />
      <span className="text-xs text-zinc-400 text-center">
        {mat[1]}x {mat[0]}
      </span>
    </div>
  ));

  return (
    <div className="mb-1">
      <div
        className="w-72 bg-zinc-800/40 hover:bg-zinc-700/60 rounded px-3 py-2 cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="text-sm text-zinc-200">{recipe[0]}</div>
        <div className="text-xs text-zinc-500">
          Rank: {recipe[1]} &bull; Qty: {recipe[2]}
        </div>
      </div>
      <CollapsePanel open={open}>
        <div className="flex flex-wrap gap-3 pt-2 pl-2 pb-2">{mats}</div>
      </CollapsePanel>
    </div>
  );
}

function ProfessionTableRowTemp({ recipe }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-60 text-left bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded transition-colors text-sm flex items-center justify-between"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span>{recipe[0]}</span>
        <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      <CollapsePanel open={open}>
        <div className="pl-4 pt-1 space-y-1">
          {recipe[1].map((data, index) => (
            <ProfessionTableRow recipe={data} key={index} />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

function ProfessionTableCol({ tier }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-80 text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded transition-colors font-medium text-sm flex items-center justify-between"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span>{tier[0]}</span>
        <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      <CollapsePanel open={open}>
        <div className="pl-4 pt-1 space-y-1">
          {tier[1].map((data, index) => (
            <ProfessionTableRowTemp recipe={data} key={index} />
          ))}
        </div>
      </CollapsePanel>
    </div>
  );
}

function ProfessionTable({ tiers }) {
  return (
    <div className="space-y-1">
      {tiers.map((data, index) => (
        <ProfessionTableCol tier={data} key={index} />
      ))}
    </div>
  );
}

export default ProfessionTable;
