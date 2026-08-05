import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartOpen }) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'staff') return '/staff';
    return '/dashboard';
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <Link to={getDashboardPath()} className="navbar-brand" aria-label="QueueLess Home">
          <UtensilsCrossed size={20} />
          <span>QueueLess</span>
        </Link>
        <div className="navbar-actions">
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }} aria-label="Main Navigation">
            <Link to={getDashboardPath()} className="btn btn-ghost btn-sm">Dashboard</Link>
            {user?.role === 'student' && (
              <>
                <Link to="/menu" className="btn btn-ghost btn-sm">Browse Menu</Link>
                <Link to="/orders" className="btn btn-ghost btn-sm">My Orders</Link>
              </>
            )}
            {user?.role === 'staff' && (
              <>
                <Link to="/staff/orders" className="btn btn-ghost btn-sm">All Orders</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/menu" className="btn btn-ghost btn-sm">Menu Items</Link>
                <Link to="/admin/users" className="btn btn-ghost btn-sm">Staff & Users</Link>
                <Link to="/admin/orders" className="btn btn-ghost btn-sm">Orders</Link>
              </>
            )}
          </nav>

          {onCartOpen && user?.role === 'student' && (
            <button
              className="btn btn-outline btn-sm"
              onClick={onCartOpen}
              style={{ position: 'relative' }}
              aria-label={`Open Cart (${totalItems} items)`}
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: 'var(--red)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          )}
          {user && (
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-light)' }}>
              Hi, {user.name?.split(' ')[0]}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} aria-label="Log Out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
