import { useState } from 'react';

const CANCELLATION_REASONS = [
  'Out of Stock',
  'Ingredients Not Available',
  'Kitchen Closed',
  'Technical Issue',
  'Item Unavailable',
  'Other',
];

const CancellationReasonModal = ({ onConfirm, onCancel }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) {
      alert('Please select a cancellation reason');
      return;
    }

    if (selectedReason === 'Other') {
      if (!customReason.trim()) {
        alert('Please enter a custom reason for "Other"');
        return;
      }
      setLoading(true);
      try {
        await onConfirm(selectedReason, customReason.trim());
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await onConfirm(selectedReason, null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-box"
        style={{
          maxWidth: 420,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16, color: 'var(--text)' }}>
          Cancel Order
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--grey-text)', marginBottom: 16 }}>
          Select a cancellation reason
        </p>

        <div className="form-group">
          <label style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>
            Reason
          </label>
          <select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value !== 'Other') setCustomReason('');
            }}
            className="form-group"
            style={{
              padding: '10px 14px',
              border: '1.5px solid var(--grey-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              color: 'var(--text)',
              background: '#ffffff',
              outline: 'none',
              marginBottom: 0,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            <option value="">-- Select a reason --</option>
            {CANCELLATION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {selectedReason === 'Other' && (
          <div className="form-group" style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>
              Custom Reason (required)
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter custom cancellation reason"
              style={{
                padding: '10px 14px',
                border: '1.5px solid var(--grey-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: 'var(--text)',
                background: '#ffffff',
                outline: 'none',
                marginBottom: 0,
                minHeight: 44,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--red)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--grey-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Back
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Processing...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationReasonModal;
