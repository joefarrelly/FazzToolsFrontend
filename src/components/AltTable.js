import React from 'react';
import { Link } from 'react-router-dom';

const tdBase = 'px-4 py-2 border border-zinc-700 text-center text-sm';
const linkCls = 'text-amber-400 hover:text-amber-300 hover:underline underline-offset-2';

const CLASS_COLORS = {
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

function classColor(name) {
  if (typeof name !== 'string') return null;
  return CLASS_COLORS[name.replace(/\s/g, '')] ?? null;
}

function AltTableRowData(props) {
  if (props.page === 'profession') {
    if (props.alt === props.fullalt[2]) return null;
    if (props.alt === props.fullalt[3] && props.fullalt[3] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/profession/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace("'", '')}/${props.fullalt[3].toLowerCase()}`}
          >
            {props.fullalt[3]}
          </Link>
        </td>
      );
    }
    if (props.alt === props.fullalt[4] && props.fullalt[4] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/profession/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace("'", '')}/${props.fullalt[4].toLowerCase()}`}
          >
            {props.fullalt[4]}
          </Link>
        </td>
      );
    }
    if (props.alt === 'Missing') {
      return <td className={`${tdBase} text-zinc-500`}>{props.alt}</td>;
    }
    return <td className={tdBase}>{props.alt}</td>;
  }

  if (props.page === 'gear') {
    if (props.alt === props.fullalt[2]) return null;
    if (props.fullalt.includes(props.alt, 4)) return <td className={tdBase}>{props.alt}</td>;
    if (props.alt === props.fullalt[3]) {
      return (
        <td className={tdBase}>
          <Link
            className={linkCls}
            to={`/gear/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace("'", '')}`}
          >
            {props.alt}
          </Link>
        </td>
      );
    }
    return <td className={tdBase}>{props.alt}</td>;
  }

  if (props.page === 'kb') {
    if (props.alt === props.fullalt[2]) return null;
    for (const i of [3, 4, 5, 6]) {
      if (props.alt === props.fullalt[i] && props.fullalt[i] !== '---') {
        return (
          <td className={tdBase}>
            <Link
              className={linkCls}
              to={`/keybind/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase()}/${props.fullalt[i].toLowerCase()}`}
            >
              {props.fullalt[i]}
            </Link>
          </td>
        );
      }
    }
    if (props.alt === '---') return <td className={`${tdBase} text-zinc-500`}>{props.alt}</td>;
    return <td className={tdBase}>{props.alt}</td>;
  }

  return <td className={tdBase}>{props.alt}</td>;
}

function AltTableRow({ alt: row, page, index }) {
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

function AltTable({ alts, heads, page }) {
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
