import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Clock, LayoutDashboard, QrCode, Eye, Download, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchMyOrders } from '../api/orders';
import OrderDetailsModal, { getEstimatedWaitDisplay } from '../components/OrderDetailsModal';
import ViewQrModal from '../components/ViewQrModal';

const STUDENT_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/menu', label: 'Browse Menu', icon: <UtensilsCrossed size={16} /> },
  { to: '/orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const DashboardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {/* Stats Grid Skeleton */}
    <div className="compact-stats-grid">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="skeleton-card" style={{ height: 68 }} />
      ))}
    </div>
    <div className="skeleton-card" style={{ height: 160 }}>
      <div className="skeleton-line" style={{ width: '40%', height: 20 }} />
      <div className="skeleton-line" style={{ width: '70%', height: 14 }} />
      <div className="skeleton-line" style={{ width: '100%', height: 40 }} />
    </div>
    <div className="dash-grid">
      <div className="skeleton-card" style={{ height: 110 }}>
        <div className="skeleton-line" style={{ width: '30%', height: 18 }} />
        <div className="skeleton-line" style={{ width: '50%', height: 12 }} />
      </div>
      <div className="skeleton-card" style={{ height: 110 }}>
        <div className="skeleton-line" style={{ width: '30%', height: 18 }} />
        <div className="skeleton-line" style={{ width: '50%', height: 12 }} />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [viewQrOrder, setViewQrOrder] = useState(null);

  // Notification banner states
  const [notification, setNotification] = useState(null);
  const [notifActive, setNotifActive] = useState(false);
  const notifTimeoutRef = useRef(null);

  const checkStatusChanges = useCallback((fetchedOrders) => {
    try {
      const cachedData = localStorage.getItem('queueless_order_status_cache');
      const cache = cachedData ? JSON.parse(cachedData) : null;
      
      if (!cache) {
        // Initialize cache and don't notify on first load/visit
        const initialCache = {};
        fetchedOrders.forEach(order => {
          initialCache[order._id] = order.status;
        });
        localStorage.setItem('queueless_order_status_cache', JSON.stringify(initialCache));
        return;
      }
      
      let updatedCache = { ...cache };
      let notificationToShow = null;
      
      fetchedOrders.forEach(order => {
        const oldStatus = cache[order._id];
        const newStatus = order.status;
        
        if (oldStatus && oldStatus !== newStatus) {
          let emoji = '🔔';
          let msg = `Your order status is now ${newStatus}.`;
          
          if (newStatus === 'Preparing') {
            emoji = '🍳';
            msg = 'Your order is now being prepared.';
          } else if (newStatus === 'Ready' || newStatus === 'Ready for Pickup') {
            emoji = '🔔';
            msg = 'Your order is ready for pickup.';
          } else if (newStatus === 'Completed') {
            emoji = '✅';
            msg = 'Your order has been completed.';
          } else if (newStatus === 'Cancelled') {
            emoji = '❌';
            msg = 'Your order has been cancelled.';
          } else if (newStatus === 'Accepted') {
            emoji = '👍';
            msg = 'Your order has been accepted.';
          }
          
          notificationToShow = { emoji, message: msg };
        }
        
        updatedCache[order._id] = newStatus;
      });
      
      // Clean up cache to keep only fetched orders
      const activeIds = fetchedOrders.map(o => o._id);
      const cleanedCache = {};
      activeIds.forEach(id => {
        if (updatedCache[id]) {
          cleanedCache[id] = updatedCache[id];
        }
      });
      
      localStorage.setItem('queueless_order_status_cache', JSON.stringify(cleanedCache));
      
      if (notificationToShow) {
        setNotification(notificationToShow);
        // Clean previous timeout if any
        if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
        
        // Wait slightly for render, then slide down
        setTimeout(() => setNotifActive(true), 50);
        
        notifTimeoutRef.current = setTimeout(() => {
          setNotifActive(false);
          setTimeout(() => setNotification(null), 300);
        }, 5000);
      }
    } catch (err) {
      console.error('Error tracking status changes:', err);
    }
  }, []);

  const loadOrders = useCallback(() => {
    fetchMyOrders()
      .then((res) => {
        const fetched = res.data.orders || [];
        setOrders(fetched);
        checkStatusChanges(fetched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [checkStatusChanges]);

  useEffect(() => {
    loadOrders();
    return () => {
      if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    };
  }, [loadOrders]);

  // Polling for active orders
  useEffect(() => {
    const hasActive = orders.some(o => 
      ['Pending', 'Accepted', 'Preparing', 'Ready', 'Ready for Pickup'].includes(o.status)
    );
    if (!hasActive) return;

    const interval = setInterval(() => {
      fetchMyOrders()
        .then((res) => {
          const fetched = res.data.orders || [];
          setOrders(fetched);
          checkStatusChanges(fetched);
        })
        .catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [orders, checkStatusChanges]);

  const handleDownloadQr = (qrDataUrl, tokenNumber) => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QueueLess-Token-${tokenNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeOrder = orders.find(o => 
    ['Pending', 'Accepted', 'Preparing', 'Ready', 'Ready for Pickup'].includes(o.status)
  );

  return (
    <>
      <Navbar />
      {notification && (
        <div className={`status-notification-banner ${notifActive ? 'show' : ''}`} role="alert" aria-live="polite">
          <span className="status-notification-emoji">{notification.emoji}</span>
          <span className="status-notification-message">{notification.message}</span>
        </div>
      )}
      {selectedDetailOrder && (
        <OrderDetailsModal
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
        />
      )}
      {viewQrOrder && (
        <ViewQrModal
          order={viewQrOrder}
          onClose={() => setViewQrOrder(null)}
          onDownload={handleDownloadQr}
        />
      )}

      <div className="dashboard-layout">
        <Sidebar links={STUDENT_LINKS} />
        <main className="main-content">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--grey-text)', marginBottom: 20, fontSize: '0.9rem' }}>
            What would you like to eat today?
          </p>

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="compact-stats-grid">
                <div className="compact-stat-card">
                  <span className="compact-stat-label">Total Orders</span>
                  <span className="compact-stat-value">{orders.length}</span>
                </div>
                <div className="compact-stat-card">
                  <span className="compact-stat-label">Completed</span>
                  <span className="compact-stat-value" style={{ color: 'var(--success)' }}>
                    {orders.filter(o => o.status === 'Completed').length}
                  </span>
                </div>
                <div className="compact-stat-card">
                  <span className="compact-stat-label">Active</span>
                  <span className="compact-stat-value" style={{ color: 'var(--red)' }}>
                    {orders.filter(o => ['Pending', 'Accepted', 'Preparing', 'Ready', 'Ready for Pickup'].includes(o.status)).length}
                  </span>
                </div>
                <div className="compact-stat-card">
                  <span className="compact-stat-label">Cancelled</span>
                  <span className="compact-stat-value" style={{ color: 'var(--danger)' }}>
                    {orders.filter(o => o.status === 'Cancelled').length}
                  </span>
                </div>
              </div>

              {/* Active Order Widget */}
              {activeOrder ? (
                <div className="card" style={{ marginTop: 0, marginBottom: 20, borderLeft: '4px solid var(--red)', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={16} className="text-red" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Current Order</span>
                    </div>
                    <span className={`status-badge status-${activeOrder.status.replace(/\s+/g, '')}`}>{activeOrder.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontWeight: 850, fontSize: '1.3rem', color: 'var(--text)' }}>
                        Token #{activeOrder.tokenNumber}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--grey-text)', marginTop: 4 }}>
                        {activeOrder.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Estimated Wait</p>
                      <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--red)', marginTop: 2 }}>
                        {getEstimatedWaitDisplay(activeOrder)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--grey-border)', paddingTop: 12 }}>
                    {activeOrder.qrCode && (
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} 
                        onClick={() => setViewQrOrder(activeOrder)}
                      >
                        <QrCode size={14} /> View QR
                      </button>
                    )}
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{ flex: 1 }} 
                      onClick={() => setSelectedDetailOrder(activeOrder)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ) : (
                /* No Active Order Empty State */
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', marginTop: 0, marginBottom: 20 }}>
                  <span style={{ fontSize: '2.5rem', marginBottom: 8 }} role="img" aria-label="burger">🍔</span>
                  <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>No Active Orders</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4, marginBottom: 12 }}>
                    Hungry? Order delicious food from our menu now!
                  </p>
                  <Link to="/menu">
                    <button className="btn btn-primary btn-sm">Browse Menu</button>
                  </Link>
                </div>
              )}

              {/* Action Grid */}
              <div className="dash-grid">
                <Link to="/menu" style={{ textDecoration: 'none' }}>
                  <div className="dash-card card-hover">
                    <div className="icon">
                      <UtensilsCrossed size={20} />
                    </div>
                    <h3>View Menu</h3>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Explore & Order</p>
                  </div>
                </Link>

                <Link to="/orders" style={{ textDecoration: 'none' }}>
                  <div className="dash-card card-hover">
                    <div className="icon">
                      <ShoppingBag size={20} />
                    </div>
                    <h3>My Orders</h3>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Track & History</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
