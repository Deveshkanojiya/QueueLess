import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';
import { CreditCard, Banknote, ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    if (cart.length === 0) return setError('Your cart is empty');
    setLoading(true);
    setError('');
    try {
      const items = cart.map((i) => ({
        menuItem: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));
      const res = await placeOrder({ items, totalPrice, paymentMethod });
      clearCart();
      navigate('/order-success', { state: { order: res.data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page flex-center" style={{ minHeight: '80vh' }}>
          <div className="empty-state" style={{ maxWidth: 400 }}>
            <ShoppingBag size={48} style={{ color: 'var(--grey-text)', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>Your cart is empty</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
              Add items from our canteen menu before checking out.
            </p>
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
        <div className="container checkout-page">
          <h1 className="page-title">Order Checkout</h1>

          <div className="card mb-16">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14, color: 'var(--text)' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--grey-bg)', fontSize: '0.875rem' }}>
                  <span><strong>{item.name}</strong> <span style={{ color: 'var(--grey-text)' }}>× {item.quantity}</span></span>
                  <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--grey-border)', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total Payable</span>
              <span className="text-red">₹{totalPrice}</span>
            </div>
          </div>

          <div className="card mb-16">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14, color: 'var(--text)' }}>Select Payment Method</h3>
            <div className="payment-options">
              {[
                { id: 'Cash', label: 'Cash at Counter', icon: <Banknote size={20} /> },
                { id: 'Canteen QR', label: 'Canteen UPI QR', icon: <CreditCard size={20} /> },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={paymentMethod === method.id}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPaymentMethod(method.id); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  {method.icon}
                  <span>{method.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="alert alert-error mb-16">{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }} onClick={handleOrder} disabled={loading}>
            {loading ? 'Processing Order...' : `Place Order · ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
