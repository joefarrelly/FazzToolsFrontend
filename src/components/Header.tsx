import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MenuBar from 'components/MenuBar';
import { cookies } from 'cookies';
import { config } from 'Constants';

const COOLDOWN_MS = 300_000;
const STALE_MS = 30 * 24 * 60 * 60 * 1000;

type BtnState = 'idle' | 'loading' | 'done' | 'error';

function isStale(lastupdate: string | undefined): boolean {
  if (!lastupdate) return false;
  return Date.now() - parseInt(lastupdate) > STALE_MS;
}

function Header() {
  const [update, setUpdate] = useState(
    new Date(parseInt(cookies.get('lastupdate'))).toLocaleString()
  );
  const [btnState, setBtnState] = useState<BtnState>('idle');

  async function updateAllAlt() {
    setBtnState('loading');
    try {
      await axios.post(config.url.API_URL + '/api/custom/scanalt/', {
        userid: cookies.get('userid'),
      });
      cookies.set('lastupdate', new Date().getTime(), {
        path: '/',
        sameSite: 'lax',
        secure: true,
      });
      setUpdate(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
      setBtnState('done');
    } catch {
      setBtnState('error');
    } finally {
      setTimeout(() => setBtnState('idle'), 3000);
    }
  }

  async function getLastUpdate() {
    const response = await axios.get(config.url.API_URL + '/api/profile/users/', {
      params: { user: cookies.get('userid'), page: 'header' },
    });
    cookies.set('lastupdate', response.data[0], { path: '/', sameSite: 'lax', secure: true });
    setUpdate(new Date(response.data[0]).toLocaleString());
  }

  if (cookies.get('userid') && !cookies.get('lastupdate')) {
    void getLastUpdate();
  }

  const lastupdate: string | undefined = cookies.get('lastupdate');
  const onCooldown = btnState !== 'idle' || Date.now() < parseInt(lastupdate ?? '0') + COOLDOWN_MS;
  const stale = isStale(lastupdate);

  const btnLabels: Record<BtnState, string> = {
    idle: 'Update',
    loading: 'Updating…',
    done: 'Queued!',
    error: 'Failed',
  };
  const btnLabel = btnLabels[btnState];
  const btnCls =
    btnState === 'error'
      ? 'bg-red-700 hover:bg-red-600 text-zinc-100'
      : btnState === 'done'
        ? 'bg-green-700 text-zinc-100'
        : 'bg-amber-600 hover:bg-amber-500 text-zinc-950';

  return (
    <>
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-amber-400 tracking-wide">
            Fazz Tools
          </Link>
          <MenuBar />
        </div>
        {cookies.get('userid') && (
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">Last updated: {update}</span>
            <button
              disabled={onCooldown}
              onClick={updateAllAlt}
              className={`${btnCls} disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-3 py-1.5 rounded text-sm transition-colors`}
            >
              {btnLabel}
            </button>
          </div>
        )}
      </header>
      {cookies.get('userid') && stale && (
        <div className="bg-amber-900/60 border-b border-amber-700 px-6 py-2 text-amber-300 text-sm text-center">
          Your data is over 30 days old — click <strong>Update</strong> to sync your characters.
        </div>
      )}
    </>
  );
}

export default Header;
