import React from 'react';
import { Link } from 'react-router-dom';
import { cookies } from 'cookies';

interface SidebarLinkProps {
  to: string;
  danger?: boolean;
  children: React.ReactNode;
}

function SidebarLink({ to, children, danger }: SidebarLinkProps) {
  const base = 'block py-2 px-3 rounded text-sm transition-colors';
  const colour = danger
    ? 'text-red-400 hover:bg-zinc-800 hover:text-red-300'
    : 'text-zinc-300 hover:bg-zinc-800 hover:text-amber-400';
  return (
    <Link to={to} className={`${base} ${colour}`}>
      {children}
    </Link>
  );
}

function LoginLogout() {
  if (cookies.get('userid')) {
    return (
      <>
        <SidebarLink to="/account">Account</SidebarLink>
        <SidebarLink to="/keybind">Keybind</SidebarLink>
        <SidebarLink to="/gear">Gear</SidebarLink>
        <SidebarLink to="/profession">Profession</SidebarLink>
        <SidebarLink to="/mount">Mount</SidebarLink>
        <SidebarLink to="/pet">Pet</SidebarLink>
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <SidebarLink to="/logout" danger>
            Logout
          </SidebarLink>
        </div>
      </>
    );
  }
  return <SidebarLink to="/auth">Login</SidebarLink>;
}

function MenuBar() {
  return (
    <nav className="p-3 space-y-1">
      <SidebarLink to="/">Home</SidebarLink>
      <LoginLogout />
    </nav>
  );
}

export default MenuBar;
