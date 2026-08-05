import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchMyOrders, cancelOrder } from '../api/orders';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const loadOrders = () => {
    fetchMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

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

  return (
    <>
      <Navbar />
      {confirmCancelId && (
        <ConfirmDialog
          message="Are you sure you want to cancel this order? This action cannot be undone."
          onConfirm={handleCancel}
          onCancel={() => setConfirmCancelId(null)}
        />
      )}
      <div className="page">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 className="page-title">My Orders</h1>

          {loading ? (
            <div className="loading-box"><div className="spinner" /></div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>📋</p>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No orders yet</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                When you place an order from the menu, it will appear here.
              </p>
              <Link to="/menu"><button className="btn btn-primary" style={{ marginTop: 16 }}>Browse Menu</button></Link>
            </div>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Token #{order.tokenNumber}</span>
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                      {order.status === 'Cancelled' && order.cancellationReason && (
                        <div style={{ marginTop: 6, fontSize: '0.8125rem', color: 'var(--grey-text)' }}>
                          <strong>Cancellation Reason:</strong> {order.cancellationReason}
                        </div>
                      )}
                      </div>
                      <p className="order-items-list">{order.items.map(i => `${i.name} ×${i.quantity}`).join(' · ')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--red)' }}>₹{order.totalPrice}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', marginTop: 2 }}>
                        {order.paymentMethod} {order.paymentStatus ? `· ${order.paymentStatus}` : ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--grey-border)' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--grey-text)' }}>
                      {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
