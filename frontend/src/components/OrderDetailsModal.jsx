import React from 'react';
import { X, Calendar, Clock, CreditCard, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

const getEstimatedWaitDisplay = (order) => {
  if (!order) return '';
  const status = order.status;
  const est = order.estimatedPrepTime || 10;
  
  if (status === 'Pending') {
    return `${est} mins`;
  }
  if (status === 'Accepted') {
    return `${Math.max(1, Math.round(est * 0.8))} mins`;
  }
  if (status === 'Preparing') {
    return `${Math.max(1, Math.round(est * 0.4))} mins`;
  }
  if (status === 'Ready' || status === 'Ready for Pickup') {
    return 'Ready to Collect';
  }
  if (status === 'Completed') {
    return 'Collected';
  }
  if (status === 'Cancelled') {
    return 'Cancelled';
  }
  return '';
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const isActive = ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = new Date(order.createdAt).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const completedTime = order.status === 'Completed' 
    ? new Date(order.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : null;

  // Timeline statuses helper
  const statuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1100 }}>
      <div className="modal-box" style={{ maxWidth: 520, padding: '24px 28px', width: '90%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--grey-border)', paddingBottom: 12 }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--grey-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Order Details
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
              Token #{order.tokenNumber}
            </h3>
          </div>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={onClose} 
            style={{ padding: 6, borderRadius: '50%', color: 'var(--grey-text)' }}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
          
          {/* Status Alert */}
          <div style={{ 
            background: order.status === 'Cancelled' ? '#FEF2F2' : order.status === 'Completed' ? '#F0FDF4' : '#EFF6FF',
            color: order.status === 'Cancelled' ? 'var(--red)' : order.status === 'Completed' ? '#15803D' : '#1D4ED8',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {order.status === 'Cancelled' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>
              Order is <strong>{order.status}</strong>
              {isActive && ` • Est. Wait: ${getEstimatedWaitDisplay(order)}`}
            </span>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Order ID</p>
              <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: 2 }}>{order._id}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Placed On</p>
              <p style={{ fontSize: '0.85rem', marginTop: 2 }}>{formattedDate} at {formattedTime}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Payment Method</p>
              <p style={{ fontSize: '0.85rem', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CreditCard size={14} /> {order.paymentMethod}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontWeight: 600, textTransform: 'uppercase' }}>Payment Status</p>
              <span className={`status-badge ${
                order.paymentStatus === 'Paid' ? 'status-Completed' : order.paymentStatus === 'Awaiting Verification' ? 'status-Preparing' : 'status-Pending'
              }`} style={{ display: 'inline-block', marginTop: 4 }}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* QR Code section (only if active order) */}
          {isActive && order.qrCode && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F8FAFC', padding: 16, borderRadius: 'var(--radius)', border: '1px dashed var(--grey-border)', marginBottom: 20 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: 8 }}>
                Present this QR code at the counter
              </p>
              <div style={{ background: '#FFFFFF', padding: 8, borderRadius: 'var(--radius-sm)', border: '1px solid var(--grey-border)', width: 140, height: 140 }}>
                <img src={order.qrCode} alt="Order QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Items ordered
            </h4>
            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--grey-border)' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem', borderBottom: i < order.items.length - 1 ? '1px solid var(--grey-border)' : 'none' }}>
                  <span style={{ color: 'var(--text-light)' }}>
                    {item.name} <strong style={{ color: 'var(--text)', marginLeft: 4 }}>× {item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2px solid var(--grey-border)', fontWeight: 800, fontSize: '0.95rem' }}>
                <span>Total</span>
                <span className="text-red">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Timeline & Cancel Details */}
          {order.status === 'Cancelled' ? (
            <div style={{ background: '#FEF2F2', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5', marginBottom: 12 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>
                Cancellation Reason
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#991B1B' }}>
                {order.cancellationReason || 'No reason specified'}
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Order Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', paddingLeft: 20 }}>
                {/* Vertical timeline line */}
                <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 2, background: 'var(--grey-border)' }} />
                
                {statuses.map((step, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      {/* Circle indicator */}
                      <div style={{ 
                        position: 'absolute', 
                        left: -20, 
                        width: 14, 
                        height: 14, 
                        borderRadius: '50%', 
                        background: isCurrent ? 'var(--red)' : isDone ? 'var(--success)' : 'var(--grey-border)',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 0 0 1px var(--grey-border)'
                      }} />
                      
                      <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: isCurrent ? 700 : 500, 
                        color: isCurrent ? 'var(--text)' : isDone ? 'var(--text-light)' : 'var(--grey-text)' 
                      }}>
                        {step}
                      </span>

                      <span style={{ fontSize: '0.78rem', color: 'var(--grey-text)' }}>
                        {step === 'Pending' && formattedTime}
                        {step === 'Completed' && completedTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--grey-border)' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
export { getEstimatedWaitDisplay };
