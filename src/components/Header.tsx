import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MenuBar from 'components/MenuBar';
import { cookies } from 'cookies';
import { config } from 'Constants';

const STALE_MS = 30 * 24 * 60 * 60 * 1000;
const AUTO_SCAN_INTERVAL_MS = 3_600_000;

function isStale(lastupdate: string | undefined): boolean {
  if (!lastupdate) return false;
  return Date.now() - parseInt(lastupdate) > STALE_MS;
}

function Header() {
  const initialLastUpdate = cookies.get('lastupdate');
  const [update, setUpdate] = useState<string | null>(
    initialLastUpdate ? new Date(parseInt(initialLastUpdate)).toLocaleString() : null
  );

  useEffect(() => {
    if (!cookies.get('userid')) return;

    const lastupdate: string | undefined = cookies.get('lastupdate');
    const needsScan = !lastupdate || Date.now() - parseInt(lastupdate) > AUTO_SCAN_INTERVAL_MS;
    if (!needsScan) return;

    async function autoScan() {
      try {
        await axios.post(config.url.API_URL + '/api/custom/scanalt/', {
          userid: cookies.get('userid'),
        });
        const now = Date.now();
        cookies.set('lastupdate', now, { path: '/', sameSite: 'lax', secure: true });
        setUpdate(new Date(now).toLocaleString());
      } catch (err) {
        console.error('Auto-scan failed:', err);
      }
    }
    void autoScan();
  }, []);

  const lastupdate: string | undefined = cookies.get('lastupdate');
  const stale = isStale(lastupdate);

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
          <span className="text-zinc-400 text-sm">Last updated: {update ?? 'pending…'}</span>
        )}
      </header>
      {cookies.get('userid') && stale && (
        <div className="bg-amber-900/60 border-b border-amber-700 px-6 py-2 text-amber-300 text-sm text-center">
          Your data is over 30 days old — it will refresh automatically the next time you visit.
        </div>
      )}
    </>
  );
}

export default Header;
