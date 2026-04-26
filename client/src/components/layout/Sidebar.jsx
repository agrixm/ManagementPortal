import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/employees', label: 'Employees' },
  { to: '/profile', label: 'Profile' }
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-bx-border bg-bx-surface p-4 md:block">
      <div className="mb-6 rounded-md border border-bx-red/40 bg-bx-red/10 p-3">
        <p className="font-display text-lg font-semibold text-bx-text">BlockX Portal</p>
        <p className="text-xs text-bx-muted">Project and Task Management</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-bx-red/20 text-bx-text' : 'text-bx-muted hover:bg-white/5 hover:text-bx-text'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
