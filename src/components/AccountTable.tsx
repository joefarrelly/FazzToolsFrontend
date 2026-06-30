import React from 'react';
import { Link } from 'react-router-dom';
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

const thBase =
  'bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 text-sm font-semibold text-left';
const tdBase = 'px-4 py-2 border border-zinc-700 text-sm';
const profLinkCls = 'text-amber-400 hover:text-amber-300 hover:underline underline-offset-2';

interface ProfessionCellProps {
  altName: string;
  realmSlug: string;
  profession: string;
}

function ProfessionCell({ altName, realmSlug, profession }: ProfessionCellProps) {
  if (profession === 'Missing') {
    return <td className={`${tdBase} text-zinc-600`}>{profession}</td>;
  }
  return (
    <td className={tdBase}>
      <Link
        to={`/profession/${altName.toLowerCase()}/${realmSlug}/${profession.toLowerCase()}`}
        className={profLinkCls}
      >
        {profession}
      </Link>
    </td>
  );
}

interface AccountTableRowProps {
  alt: AccountAlt;
  mythicRating: number | null;
  professions: [string, string] | null;
  rowNumber: number;
  index: number;
}

function AccountTableRow({
  alt,
  mythicRating,
  professions,
  rowNumber,
  index,
}: AccountTableRowProps) {
  const color = classColor(alt.className) ?? '#e4e4e7';
  const bg = index % 2 === 0 ? '#18181b' : '#27272a';
  const [prof1, prof2] = professions ?? ['Missing', 'Missing'];

  return (
    <tr style={{ backgroundColor: bg }} className="hover:brightness-125 transition-all">
      <td className={`${tdBase} text-zinc-500 text-center`}>{rowNumber}</td>
      <td className={tdBase}>
        <Link
          to={`/alt/${alt.name.toLowerCase()}/${alt.realmSlug}`}
          style={{ color }}
          className="font-medium hover:underline underline-offset-2"
        >
          {alt.name}
        </Link>
      </td>
      <td className={`${tdBase} text-zinc-300`}>{alt.realm}</td>
      <td className={`${tdBase} text-zinc-300 text-center`}>{alt.level}</td>
      <td className={`${tdBase} text-zinc-300`}>{alt.race}</td>
      <td className={`${tdBase} text-zinc-300`}>{alt.faction}</td>
      <td className={`${tdBase} text-zinc-300 text-center`}>{alt.ilvl || '—'}</td>
      <td className={`${tdBase} text-zinc-300 text-center`}>
        {mythicRating !== null ? mythicRating.toFixed(1) : '—'}
      </td>
      <ProfessionCell altName={alt.name} realmSlug={alt.realmSlug} profession={prof1} />
      <ProfessionCell altName={alt.name} realmSlug={alt.realmSlug} profession={prof2} />
    </tr>
  );
}

interface AccountTableProps {
  alts: AccountAlt[];
  mythicByAlt: Map<number, number>;
  professionsByAlt: Map<number, [string, string]>;
}

function AccountTable({ alts, mythicByAlt, professionsByAlt }: AccountTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-800">
      <table className="border-collapse text-sm w-full">
        <thead>
          <tr>
            <th className={`${thBase} text-center`}>#</th>
            <th className={thBase}>Name</th>
            <th className={thBase}>Realm</th>
            <th className={thBase}>Level</th>
            <th className={thBase}>Race</th>
            <th className={thBase}>Faction</th>
            <th className={thBase}>ilvl</th>
            <th className={thBase}>M+ Rating</th>
            <th className={thBase}>Profession 1</th>
            <th className={thBase}>Profession 2</th>
          </tr>
        </thead>
        <tbody>
          {alts.map((alt, index) => (
            <AccountTableRow
              key={alt.altId}
              alt={alt}
              mythicRating={mythicByAlt.get(alt.altId) ?? null}
              professions={professionsByAlt.get(alt.altId) ?? null}
              rowNumber={index + 1}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountTable;
