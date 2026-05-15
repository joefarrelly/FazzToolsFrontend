import React from 'react';

function KeybindTableRow({ bind }) {
  return (
    <tr className="hover:bg-zinc-800/50 transition-colors">
      {bind.map((col, index) => (
        <td key={index} className="bg-zinc-900 px-4 py-1.5 border border-zinc-700 text-zinc-200 text-sm">
          {col}
        </td>
      ))}
    </tr>
  );
}

function KeybindTable({ binds }) {
  return (
    <div className="mb-4">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th colSpan="2" className="bg-zinc-700 text-zinc-100 px-4 py-2 border border-zinc-600 font-semibold text-center">
              {binds[0]}
            </th>
          </tr>
          <tr>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-medium">Spell</th>
            <th className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 font-medium">Bind</th>
          </tr>
        </thead>
        <tbody>
          {binds[1].map((row, index) => (
            <KeybindTableRow bind={row} key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KeybindTable;
