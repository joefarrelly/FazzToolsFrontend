import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { cookies } from 'cookies';
import { config } from 'Constants';

function AuthRedirect() {
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function getData() {
      const query = new URLSearchParams(location.search);
      const response = await axios.post(config.url.API_URL + '/api/custom/bnetlogin/', {
        state: query.get('state'),
        code: query.get('code'),
        client_id: '39658b8731b945fcba53f216556351b6',
      });
      cookies.set('userid', response.data['user'], { path: '/', sameSite: 'Lax', secure: true });
      setReadyToRedirect(true);
    }
    getData();
  }, [location]);

  if (readyToRedirect) return <Navigate to="/account" />;
  return null;
}

export default AuthRedirect;
