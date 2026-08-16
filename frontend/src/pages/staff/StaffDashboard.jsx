import { useEffect, useState, useCallback } from 'react';
import { LayoutDashboard, ClipboardList, Search, ChefHat, CheckCircle2, Clock, QrCode, Check, User } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CancellationReasonModal from '../../components/CancellationReasonModal';
import OpenOrderModal from '../../components/OpenOrderModal';
import { formatOrderDate, formatOrderTime } from '../../utils/date';
import { fetchStaffStats, fetchAllOrders, updateOrderStatus, verifyOrderPayment, staffCancelOrder } from '../../api/staff';

const SIDEBAR_LINKS = [
  { to: '/staff', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/staff/orders', label: 'All Orders', icon: <ClipboardList size={16} /> },
  { to: '/profile', label: 'Profile', icon: <User size={16} /> },
];

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status.replace(/\s+/g, '')}`}>{status}</span>
);

const OrderCard = ({ order, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleUpdate = async (newStatus) => {
    setCardError('');
    setLoading(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      onStatusChange();
    } catch {
      setCardError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    setCardError('');
    setLoading(true);
    try {
      await verifyOrderPayment(order._id);
      onStatusChange();
    } catch {
      setCardError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffCancelConfirm = async (reason, customReason) => {
    setCardError('');
    const finalReason = customReason || reason;
    try {
      await staffCancelOrder(order._id, finalReason);
      setShowCancelModal(false);
      onStatusChange();
    } catch {
      setCardError('Failed to cancel order');
    }
  };

  return (
    <div className="order-card">
      {showCancelModal && (
        <CancellationReasonModal
          onConfirm={handleStaffCancelConfirm}
          onCancel={() => setShowCancelModal(false)}
        />
      )}
      <div className="order-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>Token #{order.tokenNumber}</span>
            <StatusBadge status={order.status} />
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)' }}>
            <strong>{order.student?.name}</strong> · {order.paymentMethod} {order.paymentStatus ? `· ${order.paymentStatus}` : ''}
          </p>
          <p className="order-items-list" style={{ marginTop: 6, fontSize: '0.875rem' }}>
            {order.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--red)' }}>₹{order.totalPrice}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', marginTop: 4 }}>
            {formatOrderDate(order.createdAt)} at {formatOrderTime(order.createdAt)}
          </p>
        </div>
      </div>

      {cardError && (
        <p className="form-error" style={{ fontSize: '0.8rem', marginTop: 8, marginBottom: 0 }}>
          {cardError}
        </p>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--grey-border)', flexWrap: 'wrap' }}>
        {order.status === 'Pending' && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => handleUpdate('Accepted')} disabled={loading}>
              <Check size={14} />
              {loading ? 'Updating...' : 'Accept Order'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => handleUpdate('Preparing')} disabled={loading}>
              <ChefHat size={14} />
              {loading ? 'Updating...' : 'Start Preparing'}
            </button>
          </>
        )}
        {order.status === 'Accepted' && (
          <button className="btn btn-primary btn-sm" onClick={() => handleUpdate('Preparing')} disabled={loading}>
            <ChefHat size={14} />
            {loading ? 'Updating...' : 'Start Preparing'}
          </button>
        )}
        {order.status === 'Preparing' && (
          <button className="btn btn-primary btn-sm" style={{ background: '#059669', borderColor: '#059669' }} onClick={() => handleUpdate('Ready for Pickup')} disabled={loading}>
            <CheckCircle2 size={14} />
            {loading ? 'Updating...' : 'Mark Ready for Pickup'}
          </button>
        )}
        {(order.status === 'Ready' || order.status === 'Ready for Pickup') && (
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)' }} onClick={() => handleUpdate('Completed')} disabled={loading}>
            <CheckCircle2 size={14} />
            {loading ? 'Updating...' : 'Mark Completed (Collected)'}
          </button>
        )}

        {order.paymentStatus && order.paymentStatus !== 'Paid' && (
          <button className="btn btn-ghost btn-sm" onClick={handleVerifyPayment} disabled={loading} style={{ border: '1px solid var(--grey-border)' }}>
            {loading ? 'Processing...' : 'Verify Payment'}
          </button>
        )}

        {order.status !== 'Cancelled' && order.status !== 'Completed' && (
          <button className="btn btn-danger btn-sm" onClick={() => setShowCancelModal(true)} disabled={loading}>
            {loading ? 'Processing...' : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
};

const StaffOrderSkeleton = () => (
  <div className="order-list">
    {Array.from({ length: 3 }).map((_, idx) => (
      <div key={idx} className="skeleton-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '60%' }}>
            <div className="skeleton-line" style={{ width: '40%', height: 18 }} />
            <div className="skeleton-line" style={{ width: '80%', height: 14 }} />
            <div className="skeleton-line" style={{ width: '100%', height: 14 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, width: '20%' }}>
            <div className="skeleton-line" style={{ width: '70%', height: 18 }} />
            <div className="skeleton-line" style={{ width: '50%', height: 12 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--grey-border)' }}>
          <div className="skeleton-line" style={{ width: '30%', height: 32, borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton-line" style={{ width: '30%', height: 32, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
    ))}
  </div>
);

const StaffDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, preparing: 0, completedToday: 0 });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetchStaffStats(),
        fetchAllOrders({
          status: activeTab === 'All' ? undefined : activeTab,
          search: search.trim() || undefined,
        }),
      ]);
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data.orders);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => { load(); }, [load]);

  const handleOrderFound = (searchTerm, order) => {
    if (order?.status) {
      setActiveTab(order.status);
    } else {
      setActiveTab('All');
    }
    setSearch(searchTerm);
  };

  return (
    <>
      <Navbar />
      {showOpenModal && (
        <OpenOrderModal
          onClose={() => setShowOpenModal(false)}
          onOrderFound={handleOrderFound}
        />
      )}

      <div className="dashboard-layout">
        <Sidebar links={SIDEBAR_LINKS} />
        <main className="main-content">
          <h1 className="page-title">Staff Kitchen Dashboard</h1>

          <div className="dash-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Pending Orders', value: stats.pending, color: '#D97706', icon: <Clock size={20} /> },
              { label: 'Preparing Orders', value: stats.preparing, color: '#2563EB', icon: <ChefHat size={20} /> },
              { label: "Today's Completed", value: stats.completedToday, color: '#16A34A', icon: <CheckCircle2 size={20} /> },
            ].map((s) => (
              <div key={s.label} className="dash-card" style={{ borderTopColor: s.color }}>
                <div style={{ color: s.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s.icon}
                  <h3>{s.label}</h3>
                </div>
                <p style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {['Pending', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled', 'All'].map((tab) => (
                <button
                  key={tab}
                  className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-text)' }} />
              <input
                className="search-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search by token # or order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowOpenModal(true)}
              >
                <QrCode size={16} />
                <span>Open by Token / QR</span>
              </button>
            </div>
          </div>

          {loading ? (
            <StaffOrderSkeleton />
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>📋</p>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No {activeTab.toLowerCase()} orders</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                Orders in this queue will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onStatusChange={load} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default StaffDashboard;
