import { useEffect } from 'react';
import { X, Download, QrCode } from 'lucide-react';

const ViewQrModal = ({ order, onClose, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-qr-modal-title"
    >
      <div
        className="view-qr-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="view-qr-header">
          <div>
            <h2 id="view-qr-modal-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
              Token #{order.tokenNumber}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--grey-text)', fontFamily: 'monospace', marginTop: 2, wordBreak: 'break-all' }}>
              Order ID: {order._id}
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close modal"
            style={{ padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="view-qr-body" style={{ textAlign: 'center', padding: '16px 0' }}>
          <div className="full-qr-box">
            <img src={order.qrCode} alt={`QR Code for Token #${order.tokenNumber}`} />
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 12 }}>
            Present this QR code at the canteen counter to collect your order.
          </p>
        </div>

        <div className="view-qr-actions">
          <button
            className="btn btn-primary"
            onClick={() => onDownload(order.qrCode, order.tokenNumber)}
            style={{ flex: 1 }}
          >
            <Download size={16} />
            <span>Download QR</span>
          </button>
          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQrModal;
