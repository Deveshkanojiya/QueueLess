import { useEffect, useState, useCallback } from 'react';
import { LayoutDashboard, ClipboardList, Search, ChefHat, CheckCircle2, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CancellationReasonModal from '../../components/CancellationReasonModal';
import { fetchStaffStats, fetchAllOrders, updateOrderStatus, verifyOrderPayment, staffCancelOrder } from '../../api/staff';

const SIDEBAR_LINKS = [
  { to: '/staff', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
  { to: '/staff/orders', label: 'All Orders', icon: <ClipboardList size={16} /> },
];

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status}`}>{status}</span>
);

const OrderCard = ({ order, onStatusChange }) => {
 const [loading, setLoading] = useState(false);
 const [showCancelModal, setShowCancelModal] = useState(false);

 const handleUpdate = async (newStatus) => {
   setLoading(true);
   try {
     await updateOrderStatus(order._id, newStatus);
     onStatusChange();
   } catch {
     alert('Failed to update status');
   } finally {
     setLoading(false);
   }
 };

 const handleVerifyPayment = async () => {
   setLoading(true);
   try {
     await verifyOrderPayment(order._id);
     onStatusChange();
   } catch (err) {
     alert('Failed to verify payment');
   } finally {
     setLoading(false);
   }
 };

 const handleStaffCancelConfirm = async (reason, customReason) => {
   const finalReason = customReason || reason;
   try {
     await staffCancelOrder(order._id, finalReason);
     setShowCancelModal(false);
     onStatusChange();
   } catch (err) {
     alert('Failed to cancel order');
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
           {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </p>
       </div>
     </div>
     <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--grey-border)', flexWrap: 'wrap' }}>
       {order.status === 'Pending' && (
         <button className="btn btn-primary btn-sm" onClick={() => handleUpdate('Preparing')} disabled={loading}>
           <ChefHat size={14} />
           {loading ? 'Updating...' : 'Start Preparing'}
         </button>
       )}
       {order.status === 'Preparing' && (
         <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)' }} onClick={() => handleUpdate('Completed')} disabled={loading}>
           <CheckCircle2 size={14} />
           {loading ? 'Updating...' : 'Mark Completed'}
         </button>
       )}

       {order.paymentStatus && order.paymentStatus !== 'Paid' && (
         <button className="btn btn-ghost btn-sm" onClick={handleVerifyPayment} disabled={loading} style={{ border: '1px solid var(--grey-border)' }}>
           {loading ? 'Processing...' : 'Verify Payment'}
         </button>
       )}

       {order.status !== 'Cancelled' && (
         <button className="btn btn-danger btn-sm" onClick={() => setShowCancelModal(true)} disabled={loading}>
           {loading ? 'Processing...' : 'Cancel Order'}
         </button>
       )}
     </div>
   </div>
 );
};

const StaffDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, preparing: 0, completedToday: 0 });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetchStaffStats(),
        fetchAllOrders({ status: activeTab, search }),
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

  return (
    <>
      <Navbar />
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
              {['Pending', 'Preparing', 'Completed', 'Cancelled'].map((tab) => (
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
              <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--grey-border)' }} onClick={() => {
                const v = window.prompt('Enter token number or order ID');
                if (v) setSearch(v.trim());
              }}>
                Open by Token / QR
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-box"><div className="spinner" /></div>
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
