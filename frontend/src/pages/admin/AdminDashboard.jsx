import { useEffect, useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, Users, ShoppingBag, Clock, User } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { fetchAdminStats } from '../../api/admin';

export const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/admin/menu', label: 'Menu Items', icon: <UtensilsCrossed size={16} /> },
  { to: '/admin/users', label: 'Staff & Users', icon: <Users size={16} /> },
  { to: '/admin/orders', label: 'All Orders', icon: <ShoppingBag size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const AdminDashboardSkeleton = () => (
  <div className="dash-grid">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div key={idx} className="skeleton-card" style={{ height: 110 }}>
        <div className="skeleton-line" style={{ width: '20%', height: 20, borderRadius: '50%' }} />
        <div className="skeleton-line" style={{ width: '60%', height: 16, marginTop: 10 }} />
        <div className="skeleton-line" style={{ width: '30%', height: 12 }} />
      </div>
    ))}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then((r) => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: 'var(--red)' },
        { label: "Today's Orders", value: stats.todayOrders, icon: <ShoppingBag size={22} />, color: '#2563EB' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={22} />, color: '#D97706' },
        { label: 'Registered Students', value: stats.totalUsers, icon: <Users size={22} />, color: '#16A34A' },
        { label: 'Active Menu Items', value: stats.totalMenuItems, icon: <UtensilsCrossed size={22} />, color: '#8B5CF6' },
      ]
    : [];

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar links={ADMIN_LINKS} />
        <main className="main-content">
          <h1 className="page-title">Admin Overview</h1>
          <p style={{ color: 'var(--grey-text)', marginBottom: 24, fontSize: '0.875rem' }}>
            System metrics and management summary for QueueLess
          </p>

          {loading ? (
            <AdminDashboardSkeleton />
          ) : (
            <div className="dash-grid">
              {cards.map((c) => (
                <div key={c.label} className="dash-card" style={{ borderTopColor: c.color }}>
                  <div className="icon" style={{ color: c.color }}>{c.icon}</div>
                  <h3>{c.label}</h3>
                  <p style={{ color: 'var(--text)' }}>{c.value}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
