import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, QrCode, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';
import ViewQrModal from '../components/ViewQrModal';
import { fetchMyOrders, cancelOrder } from '../api/orders';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [viewQrOrder, setViewQrOrder] = useState(null);

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

  const handleDownloadQr = (qrDataUrl, tokenNumber) => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QueueLess-Token-${tokenNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {viewQrOrder && (
        <ViewQrModal
          order={viewQrOrder}
          onClose={() => setViewQrOrder(null)}
          onDownload={handleDownloadQr}
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
              {orders.map((order) => {
                const isActive = order.status !== 'Completed' && order.status !== 'Cancelled';
                return (
                  <div key={order._id} className="order-card">
                    {/* Header Details */}
                    <div className="order-card-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>Token #{order.tokenNumber}</span>
                          <span className={`status-badge status-${order.status}`}>{order.status}</span>
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

                    {/* QR Code Section for Active Orders (Pending, Accepted, Preparing, Ready) */}
                    {isActive && order.qrCode && (
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

                    {/* Completed Order State */}
                    {order.status === 'Completed' && (
                      <div className="order-collected-badge">
                        <CheckCircle2 size={16} />
                        <span>Order Collected</span>
                      </div>
                    )}

                    {/* Cancelled Order State */}
                    {order.status === 'Cancelled' && (
                      <div style={{ marginTop: 10, padding: '10px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: '#991B1B' }}>
                        <strong>Cancellation Reason:</strong> {order.cancellationReason || 'Cancelled by user or staff'}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--grey-border)', flexWrap: 'wrap', gap: 8 }}>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
