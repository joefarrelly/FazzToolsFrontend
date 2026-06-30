import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cookies } from 'cookies';

interface NavLinkProps {
  to: string;
  danger?: boolean;
  children: React.ReactNode;
}

function NavLink({ to, children, danger }: NavLinkProps) {
  const { pathname } = useLocation();
  const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
  const colour = danger
    ? 'text-red-400 hover:text-red-300'
    : active
      ? 'text-zinc-100 border-b border-amber-400 pb-0.5'
      : 'text-zinc-400 hover:text-zinc-100';
  return (
    <Link to={to} className={`text-sm ${colour}`}>
      {children}
    </Link>
  );
}

function LoginLogout() {
  if (cookies.get('userid')) {
    return (
      <>
        <NavLink to="/">Account</NavLink>
        <NavLink to="/gear">Gear</NavLink>
        <NavLink to="/mount">Mount</NavLink>
        <NavLink to="/pet">Pet</NavLink>
        <NavLink to="/achievement">Achievements</NavLink>
        <NavLink to="/reputation">Reputations</NavLink>
        <NavLink to="/mythicplus">Mythic+</NavLink>
        <NavLink to="/logout" danger>
          Logout
        </NavLink>
      </>
    );
  }
  return <NavLink to="/auth">Login</NavLink>;
}

function MenuBar() {
  return (
    <nav className="flex items-center gap-5">
      <LoginLogout />
    </nav>
  );
}

export default MenuBar;
