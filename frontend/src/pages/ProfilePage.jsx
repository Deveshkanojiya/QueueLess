import { useEffect, useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, ClipboardList, User, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchMyOrders } from '../api/orders';

const STUDENT_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/menu', label: 'Browse Menu', icon: <UtensilsCrossed size={16} /> },
  { to: '/orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const STAFF_LINKS = [
  { to: '/staff', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/staff/orders', label: 'All Orders', icon: <ClipboardList size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/admin/menu', label: 'Menu Items', icon: <UtensilsCrossed size={16} /> },
  { to: '/admin/users', label: 'Staff & Users', icon: <Users size={16} /> },
  { to: '/admin/orders', label: 'All Orders', icon: <ShoppingBag size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getSidebarLinks = () => {
    if (user?.role === 'admin') return ADMIN_LINKS;
    if (user?.role === 'staff') return STAFF_LINKS;
    return STUDENT_LINKS;
  };

  // User details
  const name = user?.name || 'N/A';
  const email = user?.email || 'N/A';
  const role = user?.role || 'student';
  
  // Calculate initials for Avatar
  const getInitials = (fullName) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Get date for "Member Since"
  const getMemberSince = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    // Fallback to oldest order if present
    if (orders.length > 0) {
      const oldestOrder = orders[orders.length - 1];
      return new Date(oldestOrder.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    // Fallback to current date or standard fallback
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculations for orders
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  // Calculate preferred payment method
  const getPreferredPayment = () => {
    if (orders.length === 0) return 'None';
    const methods = orders.map(o => o.paymentMethod || 'Cash');
    const counts = methods.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'Cash');
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar links={getSidebarLinks()} />
        <main className="main-content">
          <h1 className="page-title" style={{ marginBottom: 20 }}>My Profile</h1>

          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Left Card - User Bio */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
              <div 
                className="profile-avatar" 
                style={{ 
                  width: 96, 
                  height: 96, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--red) 0%, var(--red-dark) 100%)', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2.25rem', 
                  fontWeight: 800, 
                  marginBottom: 16,
                  boxShadow: '0 4px 10px rgba(220, 38, 38, 0.25)',
                  border: '4px solid #ffffff'
                }}
              >
                {getInitials(name)}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {name}
              </h2>
              <span className={`status-badge status-${role}`} style={{ textTransform: 'capitalize', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600 }}>
                {role}
              </span>

              <div style={{ width: '100%', borderTop: '1px solid var(--grey-border)', marginTop: 24, paddingTop: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <User size={16} style={{ color: 'var(--grey-text)' }} />
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>{name}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ShieldCheck size={16} style={{ color: 'var(--grey-text)' }} />
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>{email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Calendar size={16} style={{ color: 'var(--grey-text)' }} />
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Member Since</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>
                      {loading ? <div className="skeleton-line" style={{ width: 100, height: 14, margin: 0 }} /> : getMemberSince()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Analytics & Stats */}
            <div className="card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Account Analytics</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginBottom: 20 }}>Overview of your canteen orders and payments</p>
                
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton-line" style={{ width: '100%', height: 50 }} />
                    <div className="skeleton-line" style={{ width: '100%', height: 50 }} />
                    <div className="skeleton-line" style={{ width: '100%', height: 50 }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--grey-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--grey-border)' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Total Orders Placed</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{totalOrders}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--grey-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--grey-border)' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Completed Orders</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{completedOrders}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--grey-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--grey-border)' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Cancelled Orders</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)' }}>{cancelledOrders}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--grey-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--grey-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CreditCard size={16} style={{ color: 'var(--grey-text)' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Preferred Payment</span>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                        {getPreferredPayment()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--grey-border)', marginTop: 24, paddingTop: 16, fontSize: '0.78rem', color: 'var(--grey-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔒 This profile page is read-only. For updates contact admin.</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
