import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ onClose }) => {
  const navigate = useNavigate();
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={20} className="text-red" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Your Cart</h2>
            <span className="status-badge status-Preparing" style={{ borderRadius: 12, padding: '2px 8px' }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close Cart">
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛒</p>
            <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>Your cart is empty</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
              Explore our menu and add items to your cart
            </p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price} × {item.quantity} = <strong>₹{item.price * item.quantity}</strong></p>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => decreaseQty(item._id)} aria-label="Decrease quantity">
                      −
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item._id)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromCart(item._id)}
                    style={{ color: 'var(--danger)', padding: 6 }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total Amount</span>
                <span className="text-red">₹{totalPrice}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: 8 }} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', color: 'var(--grey-text)' }} onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
