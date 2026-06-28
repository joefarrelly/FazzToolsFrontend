import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { cookies } from 'cookies';

function Logout() {
  useEffect(() => {
    cookies.remove('userid', { path: '/', sameSite: 'lax', secure: true });
  });
  return <Navigate to="/" />;
}

export default Logout;
