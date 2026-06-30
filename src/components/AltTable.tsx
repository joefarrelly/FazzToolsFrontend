import React from 'react';
import { Link } from 'react-router-dom';
import type { AltRow, PageType } from 'types';

const tdBase = 'px-4 py-2 border border-zinc-700 text-center text-sm';
const linkCls = 'text-amber-400 hover:text-amber-300 hover:underline underline-offset-2';

const CLASS_COLORS: Record<string, string> = {
  Warrior: '#C79C6E',
  Paladin: '#F58CBA',
  Hunter: '#ABD473',
  Rogue: '#FFF569',
  Priest: '#FFFFFF',
  Shaman: '#0070DD',
  Mage: '#69CCF0',
  Warlock: '#9482C9',
  Monk: '#00FF96',
  Druid: '#FF7D0A',
  DemonHunter: '#A330C9',
  DeathKnight: '#C41F3B',
  Evoker: '#33937F',
};

function classColor(name: string): string | null {
  return CLASS_COLORS[name.replace(/\s/g, '')] ?? null;
}

interface AltTableRowDataProps {
  alt: string | number;
  fullalt: AltRow;
  page?: PageType;
}

function AltTableRowData({ alt, fullalt, page }: AltTableRowDataProps) {
  if (page === 'profession') {
    if (alt === fullalt[2]) return null;
    if (alt === fullalt[3] && fullalt[3] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/profession/${String(fullalt[0]).toLowerCase()}/${String(fullalt[1]).toLowerCase().replace("'", '')}/${String(fullalt[3]).toLowerCase()}`}
          >
            {fullalt[3]}
          </Link>
        </td>
      );
    }
    if (alt === fullalt[4] && fullalt[4] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/profession/${String(fullalt[0]).toLowerCase()}/${String(fullalt[1]).toLowerCase().replace("'", '')}/${String(fullalt[4]).toLowerCase()}`}
          >
            {fullalt[4]}
          </Link>
        </td>
      );
    }
    if (alt === 'Missing') {
      return <td className={`${tdBase} text-zinc-500`}>{alt}</td>;
    }
    return <td className={tdBase}>{alt}</td>;
  }

  if (page === 'gear') {
    if (alt === fullalt[2]) return null;
    for (const item of fullalt.slice(4)) {
      if (item === alt) return <td className={tdBase}>{alt}</td>;
    }
    if (alt === fullalt[3]) {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/gear/${String(fullalt[0]).toLowerCase()}/${String(fullalt[1]).toLowerCase().replace("'", '')}`}
          >
            {alt}
          </Link>
        </td>
      );
    }
    return <td className={tdBase}>{alt}</td>;
  }

  return <td className={tdBase}>{alt}</td>;
}

interface AltTableRowProps {
  alt: AltRow;
  page?: PageType;
  index: number;
}

function AltTableRow({ alt: row, page, index }: AltTableRowProps) {
  const alt = Object.values(row);
  const classIndex = page ? 2 : 3;
  const rawClass = alt[classIndex];
  const color = classColor(typeof rawClass === 'string' ? rawClass : '') ?? '#e4e4e7';
  const bg = index % 2 === 0 ? '#18181b' : '#27272a';
  return (
    <tr style={{ color, backgroundColor: bg }} className="hover:brightness-125 transition-all">
      <td className="px-4 py-2 border border-zinc-700 text-center text-zinc-500"></td>
      {alt.map((data, i) => (
        <AltTableRowData alt={data} key={i} fullalt={row} page={page} />
      ))}
    </tr>
  );
}

interface AltTableProps {
  alts: AltRow[];
  heads: string[];
  page?: PageType;
}

function AltTable({ alts, heads, page }: AltTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="alt-table border-collapse text-sm">
        <tbody>
          <tr>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">
              #
            </th>
            {heads.map((col, index) => (
              <th
                key={index}
                className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 text-sm font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
          {alts.map((row, index) => (
            <AltTableRow alt={row} key={index} index={index} page={page} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AltTable;
