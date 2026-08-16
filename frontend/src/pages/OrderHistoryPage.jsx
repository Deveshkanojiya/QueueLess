import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, CheckCircle2, Clock, Utensils, Check, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';
import ViewQrModal from '../components/ViewQrModal';
import { fetchMyOrders, cancelOrder } from '../api/orders';
import OrderDetailsModal, { getEstimatedWaitDisplay } from '../components/OrderDetailsModal';
import { formatOrderDateTime } from '../utils/date';

// Stage index mapping for live status tracking
const STATUS_STAGES = {
  Pending: 1,
  Accepted: 2,
  Preparing: 3,
  Ready: 4,
  'Ready for Pickup': 4,
  Completed: 5,
};

// Estimated wait time display handled by getEstimatedWaitDisplay

// Component for Swiggy/Zomato style Live Progress Tracker
const OrderProgressTracker = ({ currentStatus }) => {
  const currentStage = STATUS_STAGES[currentStatus] || 1;

  const steps = [
    { label: 'Order Placed', icon: <Utensils size={14} />, stage: 1 },
    { label: 'Accepted', icon: <Check size={14} />, stage: 2 },
    { label: 'Preparing', icon: <Clock size={14} />, stage: 3 },
    { label: 'Ready for Pickup', icon: <CheckCircle2 size={14} />, stage: 4 },
    { label: 'Completed', icon: <CheckCircle2 size={14} />, stage: 5 },
  ];

  return (
    <div className="tracker-container" aria-label="Order progress tracker">
      <div className="tracker-timeline">
        {steps.map((step) => {
          const isCompleted = step.stage < currentStage;
          const isCurrent = step.stage === currentStage;

          let stepClass = 'tracker-step';
          if (isCompleted) stepClass += ' completed';
          else if (isCurrent) stepClass += ' current';

          return (
            <div key={step.label} className={stepClass}>
              <div className="tracker-icon-box">
                {isCompleted ? <Check size={14} /> : step.icon}
              </div>
              <div>
                <div className="tracker-step-title">{step.label}</div>
                <div className="tracker-step-sub">
                  {isCompleted ? '✓ Done' : isCurrent ? 'In Progress' : 'Pending'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Skeleton loader component
const OrderSkeleton = () => (
  <div className="skeleton-card" style={{ marginBottom: 16 }}>
    <div className="skeleton-line" style={{ width: '40%', height: 20 }} />
    <div className="skeleton-line" style={{ width: '70%', height: 16 }} />
    <div className="skeleton-line" style={{ width: '100%', height: 60 }} />
    <div className="skeleton-line" style={{ width: '30%', height: 14 }} />
  </div>
);

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [viewQrOrder, setViewQrOrder] = useState(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);

  const loadOrders = useCallback((isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError('');

    fetchMyOrders()
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        if (!isBackground) {
          setError(err.response?.data?.message || 'Failed to load your orders. Please try again.');
        }
      })
      .finally(() => {
        if (!isBackground) setLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Lightweight 15s polling ONLY if there are active orders (Pending, Accepted, Preparing, Ready)
  useEffect(() => {
    const hasActiveOrders = orders.some(
      (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
    );

    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      loadOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [orders, loadOrders]);

  const handleCancel = async () => {
    if (!confirmCancelId) return;
    const id = confirmCancelId;
    setConfirmCancelId(null);
    setCancellingId(id);
    try {
      await cancelOrder(id);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadQr = (qrDataUrl, tokenNumber) => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QueueLess-Token-${tokenNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Separate active orders from past orders
  const activeOrders = orders.filter(
    (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'Completed' || o.status === 'Cancelled'
  );

  return (
    <>
      <Navbar />
      {confirmCancelId && (
        <ConfirmDialog
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Cancel Order"
          onConfirm={handleCancel}
          onCancel={() => setConfirmCancelId(null)}
        />
      )}
      {viewQrOrder && (
        <ViewQrModal
          order={viewQrOrder}
          onClose={() => setViewQrOrder(null)}
          onDownload={handleDownloadQr}
        />
      )}
      {selectedDetailOrder && (
        <OrderDetailsModal
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
        />
      )}

      <div className="page">
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>My Orders</h1>
            {!loading && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => loadOrders()}
                title="Refresh Orders"
                aria-label="Refresh Orders"
              >
                <RefreshCw size={15} />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div>
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : error ? (
            /* Error State */
            <div className="empty-state" style={{ padding: '36px 20px' }}>
              <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: 10 }} />
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>Could not load orders</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4, marginBottom: 16 }}>
                {error}
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => loadOrders()}>
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="empty-state">
              <p style={{ fontSize: '3rem', marginBottom: 8 }}>🍔</p>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.2rem', marginBottom: 4 }}>
                No Orders Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--grey-text)', maxWidth: 300, margin: '0 auto 20px' }}>
                Browse the menu and place your first order from our canteen.
              </p>
              <Link to="/menu">
                <button className="btn btn-primary btn-lg">Browse Menu</button>
              </Link>
            </div>
          ) : (
            <div className="order-list">
              {/* ── 1. ACTIVE ORDERS SECTION ────────────────── */}
              {activeOrders.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                      Active Order Live Tracking
                    </h2>
                    <span className="wait-time-chip">
                      <Clock size={13} className="text-red" />
                      <span>Live Updates</span>
                    </span>
                  </div>

                  {activeOrders.map((order) => {
                    const isReady = order.status === 'Ready' || order.status === 'Ready for Pickup';

                    return (
                      <div key={order._id} className="active-order-card">
                        {/* Active Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                          <div className="active-order-badge-title">
                            Live Order · Token #{order.tokenNumber}
                          </div>
                          <span className="wait-time-chip">
                            <Clock size={13} style={{ color: 'var(--red)' }} />
                            <span>Estimated Wait: <strong>{getEstimatedWaitDisplay(order)}</strong></span>
                          </span>
                        </div>

                        {/* Order Header */}
                        <div className="order-card-header" style={{ marginBottom: 12 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
                                Token #{order.tokenNumber}
                              </span>
                              <span className={`status-badge status-${order.status.replace(/\s+/g, '')}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="order-items-list" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                              {order.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--red)' }}>
                              ₹{order.totalPrice}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', marginTop: 2 }}>
                              {order.paymentMethod} {order.paymentStatus ? `· ${order.paymentStatus}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Live Swiggy/Zomato Progress Tracker */}
                        <OrderProgressTracker currentStatus={order.status} />

                        {/* Special Ready for Pickup Highlight Banner */}
                        {isReady && (
                          <div className="ready-for-pickup-banner">
                            <div style={{ background: '#22C55E', color: '#ffffff', borderRadius: '50%', padding: 4, display: 'flex', flexShrink: 0 }}>
                              <CheckCircle2 size={20} />
                            </div>
                            <div>
                              <h4 style={{ color: '#15803D', fontWeight: 700, fontSize: '0.95rem' }}>
                                🟢 Ready for Pickup!
                              </h4>
                              <p style={{ color: '#166534', fontSize: '0.8125rem', marginTop: 2 }}>
                                Please collect your order from the canteen counter. Show your QR code or Token Number to the staff.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Active QR Code Display */}
                        {order.qrCode && (
                          <div className="order-qr-container">
                            <div className="order-qr-box">
                              <img src={order.qrCode} alt={`QR Code for Token #${order.tokenNumber}`} />
                            </div>
                            <div className="order-qr-actions">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleDownloadQr(order.qrCode, order.tokenNumber)}
                              >
                                <Download size={14} />
                                <span>Download QR</span>
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setViewQrOrder(order)}
                              >
                                <Eye size={14} />
                                <span>View Full QR</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Cancel Button (Only if Pending) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--grey-border)', flexWrap: 'wrap', gap: 8 }}>
                          <p style={{ fontSize: '0.78rem', color: 'var(--grey-text)' }}>
                            Placed on {formatOrderDateTime(order.createdAt)}
                          </p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedDetailOrder(order)}
                            >
                              View Details
                            </button>
                            {order.status === 'Pending' && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setConfirmCancelId(order._id)}
                                disabled={cancellingId === order._id}
                              >
                                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── 2. PAST ORDERS HISTORY SECTION ─────────── */}
              {pastOrders.length > 0 && (
                <div>
                  {activeOrders.length > 0 && (
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
                      Past Order History
                    </h2>
                  )}

                  {pastOrders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                              Token #{order.tokenNumber}
                            </span>
                            <span className={`status-badge status-${order.status.replace(/\s+/g, '')}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="order-items-list">
                            {order.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--red)' }}>
                            ₹{order.totalPrice}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', marginTop: 2 }}>
                            {order.paymentMethod} {order.paymentStatus ? `· ${order.paymentStatus}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Completed Order State */}
                      {order.status === 'Completed' && (
                        <div className="order-collected-badge">
                          <CheckCircle2 size={16} />
                          <span>Collected Successfully</span>
                        </div>
                      )}

                      {/* Cancelled Order State */}
                      {order.status === 'Cancelled' && (
                        <div style={{ marginTop: 12, padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#991B1B' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 2 }}>
                            <XCircle size={15} />
                            <span>Order Cancelled</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: 2 }}>
                            <strong>Reason:</strong> {order.cancellationReason || 'Cancelled by staff or user'}
                          </p>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--grey-border)', flexWrap: 'wrap', gap: 8 }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--grey-text)' }}>
                          {formatOrderDateTime(order.createdAt)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedDetailOrder(order)}
                          >
                            View Details
                          </button>
                          <span style={{ fontSize: '0.75rem', color: 'var(--grey-text)', fontFamily: 'monospace' }}>
                            ID: {order._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
