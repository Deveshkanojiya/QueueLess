import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true">
    <div className="modal-box" style={{ maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#FEE2E2', color: 'var(--red)', padding: 8, borderRadius: '50%', display: 'flex' }}>
          <AlertTriangle size={20} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>Confirm Action</h3>
      </div>
      <p style={{ marginBottom: 24, fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary btn-sm" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
