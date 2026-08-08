import { useState, useEffect, useRef, useCallback } from 'react';
import { X, QrCode, Search, Camera, AlertCircle } from 'lucide-react';
import { fetchAllOrders } from '../api/staff';

const OpenOrderModal = ({ onClose, onOrderFound }) => {
  const [mode, setMode] = useState('token'); // 'token' | 'qr'
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const html5QrCodeRef = useRef(null);
  const tokenInputRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopScanner();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus token input when token mode is active
  useEffect(() => {
    if (mode === 'token' && tokenInputRef.current) {
      tokenInputRef.current.focus();
    }
  }, [mode]);

  // Stop scanner instance safely
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch {
        /* ignore cleanup errors */
      } finally {
        html5QrCodeRef.current = null;
        setIsScanning(false);
      }
    }
  }, []);

  // Clean up scanner on unmount or mode switch
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleModeChange = (newMode) => {
    setError('');
    setCameraError('');
    if (newMode !== 'qr') {
      stopScanner();
    }
    setMode(newMode);
  };

  // Perform backend search for order by token number or Order ID
  const processSearchQuery = async (queryTerm) => {
    const trimmed = queryTerm.trim();
    if (!trimmed) {
      setError('Please enter an order token or ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Call staff API without status filter to find order in any status queue
      const res = await fetchAllOrders({ search: trimmed });
      const orders = res.data.orders || [];

      if (orders.length === 0) {
        setError('Order not found');
      } else {
        await stopScanner();
        onOrderFound(trimmed, orders[0]);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      processSearchQuery(tokenInput);
    }
  };

  // Start QR Camera Scanner
  const startScanner = async () => {
    setError('');
    setCameraError('');
    setIsScanning(true);

    // Ensure Html5Qrcode is available (via window or dynamic fallback)
    const Html5QrcodeClass = window.Html5Qrcode;
    if (!Html5QrcodeClass) {
      setCameraError('QR Scanner library failed to load. Please refresh the page.');
      setIsScanning(false);
      return;
    }

    try {
      // Small timeout to allow DOM node render
      await new Promise((res) => setTimeout(res, 100));

      const scannerId = 'qr-reader-viewport';
      const element = document.getElementById(scannerId);
      if (!element) {
        setCameraError('Scanner element not found in DOM.');
        setIsScanning(false);
        return;
      }

      await stopScanner();

      const html5QrCode = new Html5QrcodeClass(scannerId);
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 230, height: 230 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          // On successful scan: automatically stop scanner, process QR result, and close modal
          await stopScanner();
          if (!decodedText || !decodedText.trim()) {
            setError('Invalid QR Code');
            return;
          }
          await processSearchQuery(decodedText.trim());
        },
        () => {
          /* ignore frame scan errors */
        }
      );
    } catch (err) {
      await stopScanner();
      const errStr = String(err).toLowerCase();
      if (errStr.includes('notallowed') || errStr.includes('permission') || errStr.includes('denied')) {
        setCameraError('Camera permission denied. Please allow camera access in browser settings to scan QR.');
      } else if (errStr.includes('notfound') || errStr.includes('device')) {
        setCameraError('No camera device found on this device.');
      } else {
        setCameraError('Could not start camera scanner. Please try again.');
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        stopScanner();
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="open-order-modal-title"
    >
      <div
        className="open-order-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="open-order-header">
          <h2 id="open-order-modal-title">Open Order</h2>
          <button
            className="btn btn-ghost btn-sm close-btn"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector (Radio buttons) */}
        <div className="open-order-mode-selector" role="radiogroup" aria-label="Order opening mode">
          <label className={`mode-option ${mode === 'token' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="openOrderMode"
              value="token"
              checked={mode === 'token'}
              onChange={() => handleModeChange('token')}
            />
            <Search size={16} />
            <span>Search by Token</span>
          </label>

          <label className={`mode-option ${mode === 'qr' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="openOrderMode"
              value="qr"
              checked={mode === 'qr'}
              onChange={() => handleModeChange('qr')}
            />
            <QrCode size={16} />
            <span>Scan QR Code</span>
          </label>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Token Mode Form */}
        {mode === 'token' && (
          <form onSubmit={handleTokenSubmit} style={{ width: '100%' }}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label htmlFor="token-input-field" style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 8, color: 'var(--text)' }}>
                Enter Token
              </label>
              <input
                id="token-input-field"
                ref={tokenInputRef}
                className="large-token-input"
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter order token"
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="open-order-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  stopScanner();
                  onClose();
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !tokenInput.trim()}
              >
                {loading ? 'Searching...' : 'Open Order'}
              </button>
            </div>
          </form>
        )}

        {/* QR Mode UI */}
        {mode === 'qr' && (
          <div className="qr-scanner-container" style={{ width: '100%', textAlign: 'center' }}>
            {cameraError && (
              <div className="alert alert-error" style={{ textAlign: 'left', marginBottom: 16 }}>
                {cameraError}
              </div>
            )}

            {!isScanning ? (
              <div style={{ padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
                  <Camera size={32} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>Ready to Scan Student QR Code</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                    Point your camera at the digital order QR code displayed on the student screen
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={startScanner}
                  disabled={loading}
                  style={{ width: '100%', maxWidth: 300, minHeight: 48, fontSize: '1rem', fontWeight: 600 }}
                >
                  <Camera size={18} />
                  <span>Scan QR</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div id="qr-reader-viewport" style={{ width: '100%', maxWidth: 340, borderRadius: 'var(--radius)', overflow: 'hidden', border: '2px solid var(--red)' }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)' }}>
                  Position the QR code within the frame to scan automatically...
                </p>
                {loading && <div className="spinner" style={{ margin: '8px 0' }} />}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={stopScanner}
                  style={{ border: '1px solid var(--grey-border)', marginTop: 4 }}
                >
                  Stop Camera
                </button>
              </div>
            )}

            <div className="open-order-actions" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  stopScanner();
                  onClose();
                }}
                disabled={loading}
                style={{ width: '100%' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenOrderModal;
