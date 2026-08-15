import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Landing Page
import LandingPage from './pages/LandingPage';

// Student pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Misc
import NotFoundPage from './pages/NotFoundPage';

// Helper to safely parse user from localStorage
const getStoredUser = () => {
  try {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Redirect logged in users away from public auth routes
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Protect route by role — if not logged in go to login; if role mismatch redirect to user's dashboard
const RoleRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token) return <Navigate to="/login" replace />;

  if (!roles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Root route handler: if authenticated, redirect to role dashboard; otherwise render Landing Page
const RootRoute = () => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page at Root Route */}
          <Route path="/" element={<RootRoute />} />

          {/* Public / Auth routes (redirects if already logged in) */}
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

          {/* Student routes (only students allowed) */}
          <Route path="/dashboard" element={<RoleRoute roles={['student']}><DashboardPage /></RoleRoute>} />
          <Route path="/menu" element={<RoleRoute roles={['student']}><MenuPage /></RoleRoute>} />
          <Route path="/checkout" element={<RoleRoute roles={['student']}><CheckoutPage /></RoleRoute>} />
          <Route path="/order-success" element={<RoleRoute roles={['student']}><OrderSuccessPage /></RoleRoute>} />
          <Route path="/orders" element={<RoleRoute roles={['student']}><OrderHistoryPage /></RoleRoute>} />

          {/* Staff routes (staff only) */}
          <Route path="/staff" element={<RoleRoute roles={['staff']}><StaffDashboard /></RoleRoute>} />
          <Route path="/staff/orders" element={<RoleRoute roles={['staff']}><StaffDashboard /></RoleRoute>} />

          {/* Admin routes (admin only) */}
          <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/menu" element={<RoleRoute roles={['admin']}><AdminMenuPage /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute roles={['admin']}><AdminUsersPage /></RoleRoute>} />
          <Route path="/admin/orders" element={<RoleRoute roles={['admin']}><AdminOrdersPage /></RoleRoute>} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
