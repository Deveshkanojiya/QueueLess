import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, UtensilsCrossed } from 'lucide-react';

const Sidebar = ({ links }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <div className="sidebar-brand">
        <UtensilsCrossed size={18} />
        <span>QueueLess</span>
      </div>
      <div className="sidebar-user">
        <div className="name">{user?.name}</div>
        <div className="role">{user?.role}</div>
      </div>
      <nav>
        <ul className="sidebar-nav">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
