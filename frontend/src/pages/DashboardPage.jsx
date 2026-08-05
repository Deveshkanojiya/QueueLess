import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Clock, LayoutDashboard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchMyOrders } from '../api/orders';

const STUDENT_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/menu', label: 'Browse Menu', icon: <UtensilsCrossed size={16} /> },
  { to: '/orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
];

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    fetchMyOrders()
      .then((res) => {
        const orders = res.data.orders;
        if (orders.length > 0) setRecentOrder(orders[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar links={STUDENT_LINKS} />
        <main className="main-content">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--grey-text)', marginBottom: 28, fontSize: '0.9375rem' }}>
            What would you like to eat today?
          </p>

          <div className="dash-grid">
            <Link to="/menu" style={{ textDecoration: 'none' }}>
              <div className="dash-card card-hover">
                <div className="icon">
                  <UtensilsCrossed size={24} />
                </div>
                <h3>View Menu</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Explore & Order</p>
              </div>
            </Link>

            <Link to="/orders" style={{ textDecoration: 'none' }}>
              <div className="dash-card card-hover">
                <div className="icon">
                  <ShoppingBag size={24} />
                </div>
                <h3>My Orders</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Track & History</p>
              </div>
            </Link>
          </div>

          {recentOrder && (
            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} className="text-red" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Latest Order Status</span>
                </div>
                <span className={`status-badge status-${recentOrder.status}`}>{recentOrder.status}</span>
              </div>
              {recentOrder.status === 'Cancelled' && recentOrder.cancellationReason && (
                <div style={{ marginBottom: 12, padding: 10, background: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px solid #FECACA' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#991B1B', fontWeight: 500 }}>
                    <strong>Cancellation Reason:</strong> {recentOrder.cancellationReason}
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--grey-border)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                    Token #{recentOrder.tokenNumber}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 2 }}>
                    {recentOrder.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--red)' }}>
                    ₹{recentOrder.totalPrice}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', marginTop: 2 }}>
                    {new Date(recentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
