import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Zap,
  QrCode,
  CreditCard,
  ChefHat,
  ShoppingBag,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* ── Navbar ─────────────────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-container flex-between">
          <Link to="/" className="landing-logo">
            <UtensilsCrossed className="logo-icon" size={28} />
            <span>QueueLess</span>
          </Link>

          <nav className="landing-nav-links desktop-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#roles">Roles</a>
          </nav>

          <div className="landing-auth-btns">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────── */}
      <section className="landing-hero-section">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Smart Canteen System</span>
            </div>
            <h1 className="hero-title">
              QueueLess
              <span className="hero-subtitle">Skip the Queue. Order Smarter.</span>
            </h1>
            <p className="hero-description">
              QueueLess is a smart college canteen management system that enables students to browse menus, place orders online, make digital or cash payments, and collect food quickly using QR codes or order tokens.
            </p>

            <div className="hero-cta-buttons">
              <Link to="/login" className="btn btn-primary btn-lg">
                <span>Login</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          </div>

          <div className="landing-hero-illustration">
            <svg
              viewBox="0 0 500 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hero-svg"
              aria-label="Canteen food ordering illustration"
            >
              {/* Background Glow */}
              <circle cx="250" cy="200" r="180" fill="var(--red-light)" opacity="0.6" />
              <rect x="70" y="80" width="360" height="240" rx="16" fill="#ffffff" stroke="var(--grey-border)" strokeWidth="3" shadow="var(--shadow)" />
              
              {/* Header Bar */}
              <rect x="90" y="100" width="320" height="40" rx="8" fill="#F8FAFC" />
              <circle cx="115" cy="120" r="8" fill="var(--red)" />
              <rect x="135" y="115" width="120" height="10" rx="5" fill="#CBD5E1" />
              
              {/* Food Item Cards */}
              <rect x="90" y="155" width="150" height="70" rx="8" fill="#FFF5F5" stroke="#FECACA" strokeWidth="1.5" />
              <circle cx="120" cy="190" r="16" fill="#FCA5A5" />
              <rect x="145" y="175" width="75" height="10" rx="5" fill="var(--red)" />
              <rect x="145" y="193" width="45" height="8" rx="4" fill="#64748B" />

              <rect x="260" y="155" width="150" height="70" rx="8" fill="#F8FAFC" stroke="var(--grey-border)" strokeWidth="1.5" />
              <circle cx="290" cy="190" r="16" fill="#E2E8F0" />
              <rect x="315" y="175" width="75" height="10" rx="5" fill="#334155" />
              <rect x="315" y="193" width="45" height="8" rx="4" fill="#94A3B8" />

              {/* Token / QR Badge */}
              <rect x="90" y="240" width="320" height="60" rx="8" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
              <rect x="110" y="252" width="36" height="36" rx="6" fill="#16A34A" />
              <path d="M120 270L125 275L136 264" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="160" y="258" width="140" height="10" rx="5" fill="#15803D" />
              <rect x="160" y="274" width="90" height="8" rx="4" fill="#166534" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section id="features" className="landing-section bg-light">
        <div className="landing-container">
          <div className="section-header">
            <h2 className="section-title">Why QueueLess?</h2>
            <p className="section-subtitle">
              Designed specifically for college canteens to eliminate long waiting lines.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Zap size={24} />
              </div>
              <h3>Fast Ordering</h3>
              <p>Skip long queues by placing your order online directly from your phone.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <QrCode size={24} />
              </div>
              <h3>QR Pickup</h3>
              <p>Collect your food order hassle-free using your digital QR code or token number.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <CreditCard size={24} />
              </div>
              <h3>Multiple Payment Options</h3>
              <p>Seamless support for both Canteen QR payments and Cash payments.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ChefHat size={24} />
              </div>
              <h3>Live Order Tracking</h3>
              <p>Track your order status in real time from placement until kitchen completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ─────────────────────────── */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your food in 4 easy steps</p>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <UtensilsCrossed size={22} />
              </div>
              <h4>Browse Menu</h4>
              <p>Explore daily canteen items, prices, and live availability.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <ShoppingBag size={22} />
              </div>
              <h4>Place Order</h4>
              <p>Add food items to your cart and customize your quantities.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <CreditCard size={22} />
              </div>
              <h4>Pay</h4>
              <p>Choose your preferred payment method (Online QR or Cash).</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <CheckCircle2 size={22} />
              </div>
              <h4>Collect using QR</h4>
              <p>Show your generated order QR code or token to staff & pick up!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Section ────────────────────────────────── */}
      <section id="roles" className="landing-section bg-light">
        <div className="landing-container">
          <div className="section-header">
            <h2 className="section-title">Built for Everyone</h2>
            <p className="section-subtitle">Tailored experience for every role in the canteen ecosystem</p>
          </div>

          <div className="roles-grid">
            <div className="role-card">
              <div className="role-badge">
                <UserCheck size={20} />
                <span>Student</span>
              </div>
              <ul className="role-list">
                <li><CheckCircle2 size={16} /> Browse Menu</li>
                <li><CheckCircle2 size={16} /> Place Orders</li>
                <li><CheckCircle2 size={16} /> Track Orders</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-badge">
                <ChefHat size={20} />
                <span>Staff</span>
              </div>
              <ul className="role-list">
                <li><CheckCircle2 size={16} /> Manage Orders</li>
                <li><CheckCircle2 size={16} /> Scan QR</li>
                <li><CheckCircle2 size={16} /> Update Order Status</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-badge">
                <ShieldCheck size={20} />
                <span>Admin</span>
              </div>
              <ul className="role-list">
                <li><CheckCircle2 size={16} /> Manage Menu</li>
                <li><CheckCircle2 size={16} /> Manage Users</li>
                <li><CheckCircle2 size={16} /> Monitor Operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action Section ─────────────────────── */}
      <section className="landing-cta-section">
        <div className="landing-container text-center">
          <h2>Ready to skip the queue?</h2>
          <p>Join QueueLess today and experience hassle-free canteen dining.</p>
          <Link to="/login" className="btn btn-primary btn-lg style-cta-btn">
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container flex-between footer-wrap">
          <div className="footer-brand">
            <div className="landing-logo">
              <UtensilsCrossed className="logo-icon" size={24} />
              <span>QueueLess</span>
            </div>
            <p>Smart Canteen Management System</p>
          </div>
          <div className="footer-info">
            <p>© {new Date().getFullYear()} QueueLess. Developed as a College Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
