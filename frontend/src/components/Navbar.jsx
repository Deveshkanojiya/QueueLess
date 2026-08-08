import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, UtensilsCrossed, Menu, X, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <Link to={getDashboardPath()} className="navbar-brand" aria-label="QueueLess Home" onClick={closeMobileMenu}>
          <UtensilsCrossed size={20} />
          <span>QueueLess</span>
        </Link>
        <div className="navbar-actions">
          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 8, alignItems: 'center' }} aria-label="Main Navigation">
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
            <span className="user-greeting" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-light)' }}>
              Hi, {user.name?.split(' ')[0]}
            </span>
          )}

          <button className="btn btn-ghost btn-sm desktop-nav" onClick={handleLogout} aria-label="Log Out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          {user && (
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && user && (
        <div className="mobile-nav-dropdown">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--grey-border)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
              Hi, {user.name}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase' }}>
              {user.role}
            </span>
          </div>

          <div className="mobile-nav-links">
            <Link
              to={getDashboardPath()}
              className={location.pathname === getDashboardPath() ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>

            {user.role === 'student' && (
              <>
                <Link
                  to="/menu"
                  className={location.pathname === '/menu' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  <UtensilsCrossed size={16} />
                  <span>Browse Menu</span>
                </Link>
                <Link
                  to="/orders"
                  className={location.pathname === '/orders' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag size={16} />
                  <span>My Orders</span>
                </Link>
              </>
            )}

            {user.role === 'staff' && (
              <Link
                to="/staff/orders"
                className={location.pathname === '/staff/orders' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                <ShoppingBag size={16} />
                <span>All Orders</span>
              </Link>
            )}

            {user.role === 'admin' && (
              <>
                <Link
                  to="/admin/menu"
                  className={location.pathname === '/admin/menu' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  <UtensilsCrossed size={16} />
                  <span>Menu Items</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={location.pathname === '/admin/users' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  <Users size={16} />
                  <span>Staff & Users</span>
                </Link>
                <Link
                  to="/admin/orders"
                  className={location.pathname === '/admin/orders' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag size={16} />
                  <span>Orders</span>
                </Link>
              </>
            )}
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              closeMobileMenu();
              handleLogout();
            }}
            style={{ width: '100%', marginTop: 4 }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
