import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

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

// Protect any route — must be logged in
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Protect route by role — if not logged in go to login; if role mismatch redirect to the user's dashboard
const RoleRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token) return <Navigate to="/login" replace />;
  // If role not allowed, redirect them back to their correct dashboard instead of letting them access
  if (!roles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Smart redirect: send user to their correct dashboard on login
const SmartRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'staff') return <Navigate to="/staff" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student routes (only students allowed) */}
          <Route path="/dashboard" element={<RoleRoute roles={['student']}><DashboardPage /></RoleRoute>} />
          <Route path="/menu" element={<RoleRoute roles={['student']}><MenuPage /></RoleRoute>} />
          <Route path="/checkout" element={<RoleRoute roles={['student']}><CheckoutPage /></RoleRoute>} />
          <Route path="/order-success" element={<RoleRoute roles={['student']}><OrderSuccessPage /></RoleRoute>} />
          <Route path="/orders" element={<RoleRoute roles={['student']}><OrderHistoryPage /></RoleRoute>} />

          {/* Staff routes (staff only) */}
          <Route path="/staff" element={<RoleRoute roles={['staff']}><StaffDashboard /></RoleRoute>} />
          <Route path="/staff/orders" element={<RoleRoute roles={['staff']}><StaffDashboard /></RoleRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/menu" element={<RoleRoute roles={['admin']}><AdminMenuPage /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute roles={['admin']}><AdminUsersPage /></RoleRoute>} />
          <Route path="/admin/orders" element={<RoleRoute roles={['admin']}><AdminOrdersPage /></RoleRoute>} />

          {/* Smart root redirect */}
          <Route path="/" element={<SmartRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
