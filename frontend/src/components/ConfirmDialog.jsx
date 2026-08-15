import { AlertTriangle, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({ 
  title = 'Confirm Action', 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'danger' 
}) => (
  <div className="modal-overlay" role="dialog" aria-modal="true">
    <div className="modal-box" style={{ maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ 
          background: type === 'danger' ? '#FEE2E2' : '#EFF6FF', 
          color: type === 'danger' ? 'var(--red)' : '#1D4ED8', 
          padding: 8, 
          borderRadius: '50%', 
          display: 'flex' 
        }}>
          {type === 'danger' ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
      </div>
      <p style={{ marginBottom: 24, fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          {cancelText}
        </button>
        <button 
          className="btn btn-primary btn-sm" 
          style={{ background: type === 'danger' ? 'var(--red)' : 'var(--success)' }}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
