import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, QrCode, ShoppingBag } from 'lucide-react';
import { confirmPayment, fetchCanteenQr } from '../api/orders';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const order = state?.order;
  const [canteenQr, setCanteenQr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order?.paymentMethod === 'Canteen QR') {
      fetchCanteenQr().then((res) => setCanteenQr(res.data.qr)).catch(() => {});
    }
  }, [order]);

  const handleIHavePaid = async () => {
    if (!order) return;
    setLoading(true);
    try {
      await confirmPayment(order._id);
      // simple feedback and go to orders
      alert('Marked as paid (awaiting staff verification)');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not mark payment');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="page flex-center" style={{ minHeight: '80vh' }}>
          <div className="empty-state" style={{ maxWidth: 400 }}>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>No recent order found</p>
            <Link to="/menu">
              <button className="btn btn-primary" style={{ marginTop: 16 }}>
                Browse Menu
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container success-page">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ background: '#DCFCE7', padding: 16, borderRadius: '50%', color: '#16A34A', display: 'flex', marginBottom: 4 }}>
              <CheckCircle size={44} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ color: 'var(--grey-text)', fontSize: '0.9rem', marginTop: -6 }}>
              Present your digital token at the counter when called
            </p>

            <div className="card" style={{ textAlign: 'center', marginTop: 8, width: '100%' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                YOUR TOKEN NUMBER
              </p>
              <div className="token-display">#{order.tokenNumber}</div>
            </div>

            {/* Show canteen QR for QR payments, otherwise show order QR */}
            <div className="card" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <QrCode size={18} className="text-red" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Scan QR at Counter</span>
              </div>
              <div className="qr-box">
                <img src={order.paymentMethod === 'Canteen QR' ? (canteenQr || order.qrCode) : order.qrCode} alt="QR Code" />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', fontFamily: 'monospace' }}>
                Order ID: {order._id}
              </p>

              {order.paymentMethod === 'Canteen QR' && (
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={handleIHavePaid} disabled={loading}>
                    {loading ? 'Marking...' : 'I Have Paid'}
                  </button>
                </div>
              )}
            </div>

            <div className="card" style={{ width: '100%' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 12, borderBottom: '1px solid var(--grey-border)', paddingBottom: 8 }}>
                Order Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.875rem' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 500 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--grey-border)', fontWeight: 700, fontSize: '1rem' }}>
                <span>Total Paid</span>
                <span className="text-red">₹{order.totalPrice}</span>
              </div>
              <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--grey-text)' }}>
                Payment Method: <strong>{order.paymentMethod}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%', justifyContent: 'center' }}>
              <Link to="/orders" style={{ flex: 1 }}>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  <ShoppingBag size={16} />
                  My Orders
                </button>
              </Link>
              <Link to="/menu" style={{ flex: 1 }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Order More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
