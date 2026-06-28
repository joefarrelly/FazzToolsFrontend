import axios from 'axios';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { config } from 'Constants';
import { cookies } from 'cookies';

function Logout() {
  useEffect(() => {
    axios.post(`${config.url.API_URL}/api/custom/logout/`).finally(() => {
      cookies.remove('userid', { path: '/', sameSite: 'lax', secure: true });
    });
  });
  return <Navigate to="/" />;
}

export default Logout;
