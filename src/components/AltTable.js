import React from 'react';
import { Link } from 'react-router-dom';

const tdBase = 'px-4 py-2 border border-zinc-700 text-center text-sm text-zinc-100';
const linkCls = 'text-amber-400 hover:text-amber-300 hover:underline underline-offset-2';

function AltTableRowData(props) {
  if (props.page === 'profession') {
    if (props.alt === props.fullalt[2]) return null;
    if (props.alt === props.fullalt[3] && props.fullalt[3] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link className={linkCls} to={`/profession/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace('\'', '')}/${props.fullalt[3].toLowerCase()}`}>
            {props.fullalt[3]}
          </Link>
        </td>
      );
    }
    if (props.alt === props.fullalt[4] && props.fullalt[4] !== 'Missing') {
      return (
        <td className={tdBase}>
          <Link className={linkCls} to={`/profession/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace('\'', '')}/${props.fullalt[4].toLowerCase()}`}>
            {props.fullalt[4]}
          </Link>
        </td>
      );
    }
    if (props.alt === 'Missing') {
      return <td className={`${tdBase} text-zinc-500`}>{props.alt}</td>;
    }
    return <td className={`${tdBase} ${props.fullalt[2].replace(/\s/g, '')}`}>{props.alt}</td>;
  }

  if (props.page === 'gear') {
    if (props.alt === props.fullalt[2]) return null;
    if (props.fullalt.includes(props.alt, 4)) return <td className={tdBase}>{props.alt}</td>;
    if (props.alt === props.fullalt[3]) {
      return (
        <td className={tdBase}>
          <Link className={linkCls} to={`/gear/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase().replace('\'', '')}`}>
            {props.alt}
          </Link>
        </td>
      );
    }
    return <td className={`${tdBase} ${props.fullalt[2].replace(/\s/g, '')}`}>{props.alt}</td>;
  }

  if (props.page === 'kb') {
    if (props.alt === props.fullalt[2]) return null;
    for (const i of [3, 4, 5, 6]) {
      if (props.alt === props.fullalt[i] && props.fullalt[i] !== '---') {
        return (
          <td className={tdBase}>
            <Link className={linkCls} to={`/keybind/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase()}/${props.fullalt[i].toLowerCase()}`}>
              {props.fullalt[i]}
            </Link>
          </td>
        );
      }
    }
    if (props.alt === '---') return <td className={`${tdBase} text-zinc-500`}>{props.alt}</td>;
    return <td className={`${tdBase} ${props.fullalt[2].replace(/\s/g, '')}`}>{props.alt}</td>;
  }

  return <td className={`${tdBase} ${props.fullalt[3].replace(/\s/g, '')}`}>{props.alt}</td>;
}

function AltTableRow(props) {
  const alt = Object.values(props.alt);
  return (
    <tr className="hover:brightness-110 transition-all">
      <td className="bg-zinc-900 px-4 py-2 border border-zinc-700 text-center text-zinc-500"></td>
      {alt.map((data, index) => (
        <AltTableRowData alt={data} key={index} fullalt={props.alt} page={props.page} />
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
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-semibold">#</th>
            {heads.map((col, index) => (
              <th key={index} className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 text-sm font-semibold">
                {col}
              </th>
            ))}
          </tr>
          {alts.map((row, index) => (
            <AltTableRow alt={row} key={index} page={page} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AltTable;
