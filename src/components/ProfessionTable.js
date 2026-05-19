import React, { useState } from 'react';

function RecipeRow({ recipe }) {
  const [name, learned, rank, qty, icon] = recipe;
  const mats = recipe.slice(5);

  return (
    <div
      className={`border-b border-zinc-800 last:border-0 flex items-center justify-between px-4 py-2.5 gap-4 ${!learned ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        {icon && icon !== 'Not Found' && (
          <img
            src={icon}
            alt={name}
            title={name}
            width="28"
            height="28"
            className="shrink-0 rounded"
          />
        )}
        <span className={`text-sm truncate ${learned ? 'text-zinc-200' : 'text-zinc-400 italic'}`}>
          {name}
        </span>
        <span className="text-xs text-zinc-500 shrink-0">Rank {rank}</span>
        <span className="text-xs text-zinc-500 shrink-0">Qty {qty}</span>
      </div>
      {mats.length > 0 && (
        <div className="flex items-center gap-3 shrink-0">
          {mats.map((mat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <img
                className={mat[3].toLowerCase()}
                src={mat[2]}
                title={mat[0]}
                alt={mat[0]}
                width="28"
                height="28"
              />
              <span className="text-xs text-zinc-400">
                <span className="text-zinc-500">{mat[1]}x</span> {mat[0]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-1 py-1 text-left group"
      >
        <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
          {category[0]}
        </h3>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-xs">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 overflow-hidden mt-2">
          {category[1].map((recipe, i) => (
            <RecipeRow key={i} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfessionTable({ tiers }) {
  const [activeTier, setActiveTier] = useState(0);

  if (!tiers.length) return null;

  return (
    <div className="flex gap-6">
      <nav className="shrink-0 w-48 space-y-1">
        {tiers.map((tier, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveTier(i)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              i === activeTier
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            {tier[0]}
          </button>
        ))}
      </nav>
      <div className="flex-1 min-w-0">
        {tiers[activeTier][1].map((category, i) => (
          <CategorySection key={i} category={category} />
        ))}
      </div>
    </div>
  );
}

export default ProfessionTable;
