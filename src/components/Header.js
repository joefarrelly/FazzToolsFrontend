import React, { useState } from 'react';
import axios from 'axios';
import { cookies } from 'cookies';
import { config } from 'Constants';

function Header() {
  let disable = false;
  const [update, setUpdate] = useState(
    new Date(parseInt(cookies.get('lastupdate'))).toLocaleString()
  );

  function updateAllAlt() {
    axios.post(config.url.API_URL + '/api/custom/scanalt/', { userid: cookies.get('userid') });
    cookies.set('lastupdate', new Date().getTime(), { path: '/', sameSite: 'Lax', secure: true });
    setUpdate(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
  }

  if (new Date().getTime() < parseInt(cookies.get('lastupdate')) + 300000) {
    disable = true;
  }

  async function getLastUpdate() {
    const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
      params: { user: cookies.get('userid'), page: 'header' },
    });
    cookies.set('lastupdate', response.data[0], { path: '/', sameSite: 'Lax', secure: true });
    setUpdate(new Date(response.data[0]).toLocaleString());
  }

  if (!cookies.get('lastupdate')) {
    getLastUpdate();
  }

  if (cookies.get('userid')) {
    return (
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-amber-400 tracking-wide">Fazz Tools</h1>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">Last updated: {update}</span>
          <button
            disabled={disable}
            onClick={updateAllAlt}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold px-3 py-1.5 rounded text-sm transition-colors"
          >
            Update
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
      <h1 className="text-2xl font-bold text-amber-400 tracking-wide">Fazz Tools</h1>
    </header>
  );
}

export default Header;
