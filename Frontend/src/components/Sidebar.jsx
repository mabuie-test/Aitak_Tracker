import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  }, []);

  const links = [
    { to: '/dashboard',      label: 'Dashboard',          roles: ['super-admin','admin','user'] },
    { to: '/tenants',        label: 'Tenants',            roles: ['super-admin'] },
    { to: '/users',          label: 'Utilizadores',       roles: ['admin'] },
    { to: '/devices',        label: 'Dispositivos',       roles: ['admin','user'] }
  ];

  return (
    <aside className="w-64 bg-gray-100 p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Gestão</h2>
      {links.filter(l => l.roles.includes(role)).map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block p-2 mb-2 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-200'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
