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
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    if (!selectedReason) {
      setError('Please select a cancellation reason');
      return;
    }

    if (selectedReason === 'Other') {
      if (!customReason.trim()) {
        setError('Please enter a custom reason');
        return;
      }
      setLoading(true);
      try {
        await onConfirm(selectedReason, customReason.trim());
      } catch (err) {
        setError('Failed to cancel order');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await onConfirm(selectedReason, null);
      } catch (err) {
        setError('Failed to cancel order');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-box"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4, color: 'var(--text)' }}>
          Cancel Order
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--grey-text)', marginBottom: 20 }}>
          Please select a reason for order cancellation
        </p>

        <div className="form-group">
          <label htmlFor="cancel-reason-select">Cancellation Reason</label>
          <select
            id="cancel-reason-select"
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value !== 'Other') setCustomReason('');
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
          <div className="form-group">
            <label htmlFor="custom-reason-input">Custom Reason (required)</label>
            <input
              id="custom-reason-input"
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter custom cancellation reason"
            />
          </div>
        )}

        {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
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
