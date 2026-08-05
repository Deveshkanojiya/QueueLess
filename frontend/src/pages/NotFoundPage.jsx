import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: 'var(--grey-bg)' }}>
    <div style={{ background: 'var(--red-light)', padding: 20, borderRadius: '50%', marginBottom: 16 }}>
      <UtensilsCrossed size={48} style={{ color: 'var(--red)' }} />
    </div>
    <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--red)', lineHeight: 1, letterSpacing: '-0.03em' }}>404</h1>
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '12px 0 6px', color: 'var(--text)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--grey-text)', marginBottom: 28, maxWidth: 360, fontSize: '0.9rem' }}>
      The page you are looking for might have been moved or does not exist.
    </p>
    <Link to="/">
      <button className="btn btn-primary">
        <ArrowLeft size={16} />
        Back to Home
      </button>
    </Link>
  </div>
);

export default NotFoundPage;
