import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { ADMIN_LINKS } from './AdminDashboard';
import { fetchAdminOrders } from '../../api/admin';
import { formatOrderDateTime } from '../../utils/date';

const OrdersTableSkeleton = () => (
  <div className="admin-table-wrap">
    <table className="admin-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Student Details</th>
          <th>Ordered Items</th>
          <th>Total Price</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <tr key={idx}>
            <td><div className="skeleton-line" style={{ width: '40%', height: 16 }} /></td>
            <td>
              <div className="skeleton-line" style={{ width: '60%', height: 16 }} />
              <div className="skeleton-line" style={{ width: '85%', height: 12, marginTop: 4 }} />
            </td>
            <td><div className="skeleton-line" style={{ width: '90%', height: 14 }} /></td>
            <td><div className="skeleton-line" style={{ width: '30%', height: 16 }} /></td>
            <td><div className="skeleton-line" style={{ width: '50%', height: 14 }} /></td>
            <td><div className="skeleton-line" style={{ width: '40%', height: 20, borderRadius: 'var(--radius-full)' }} /></td>
            <td><div className="skeleton-line" style={{ width: '60%', height: 12 }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    const params = { status: statusFilter, search };
    fetchAdminOrders(params)
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, search]);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar links={ADMIN_LINKS} />
        <main className="main-content">
          <h1 className="page-title">Order Management</h1>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {['All', 'Pending', 'Preparing', 'Completed'].map((s) => (
                <button
                  key={s}
                  className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-text)' }} />
              <input
                className="search-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search by token, ID, or student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <OrdersTableSkeleton />
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>📋</p>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No orders found</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                Try adjusting your search query or status filter.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Student Details</th>
                    <th>Ordered Items</th>
                    <th>Total Price</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td><strong>#{o.tokenNumber}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.student?.name}</div>
                        <small style={{ color: 'var(--grey-text)', fontSize: '0.75rem' }}>{o.student?.email}</small>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-light)', maxWidth: 220 }}>
                        {o.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--red)' }}>₹{o.totalPrice}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{o.paymentMethod}</td>
                      <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--grey-text)', whiteSpace: 'nowrap' }}>
                        {formatOrderDateTime(o.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminOrdersPage;
