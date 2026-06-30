import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { cookies } from 'cookies';
import { config } from 'Constants';

function AuthRedirect() {
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    async function getData() {
      try {
        const query = new URLSearchParams(location.search);
        const response = await axios.post(config.url.API_URL + '/api/custom/bnetlogin/', {
          state: query.get('state'),
          code: query.get('code'),
          client_id: process.env.REACT_APP_BLIZZ_CLIENT_ID,
        });
        if (cancelled) return;
        if (!response.data?.user) {
          setError('Login failed. Please try again.');
          return;
        }
        cookies.set('userid', response.data.user, { path: '/', sameSite: 'lax', secure: true });
        setReadyToRedirect(true);
      } catch {
        if (!cancelled) setError('Login failed. Please try again.');
      }
    }
    getData();
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (readyToRedirect) return <Navigate to="/" />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  return null;
}

export default AuthRedirect;
