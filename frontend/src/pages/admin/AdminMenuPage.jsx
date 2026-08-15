import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Utensils } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ADMIN_LINKS } from './AdminDashboard';
import { fetchAdminMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/admin';

const EMPTY_FORM = { name: '', description: '', category: 'Breakfast', price: '', image: '', available: true };
const CATEGORIES = ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];

const MenuForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price) return setError('Item name and price are required');
    setLoading(true);
    try {
      await onSave({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box" style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>
          {initial?._id ? 'Edit Menu Item' : 'Add New Food Item'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input name="name" placeholder="e.g. Paneer Butter Masala" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input name="description" placeholder="Short description of ingredients" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input name="price" type="number" min="0" placeholder="e.g. 80" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input name="image" placeholder="https://images.unsplash.com/..." value={form.image} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0' }}>
            <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--red)' }} />
            <label htmlFor="available" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Available for ordering</label>
          </div>
          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : 'Save Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MenuTableSkeleton = () => (
  <div className="admin-table-wrap">
    <table className="admin-table">
      <thead>
        <tr>
          <th>Food Item</th>
          <th>Category</th>
          <th>Price</th>
          <th>Availability</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <tr key={idx}>
            <td>
              <div className="skeleton-line" style={{ width: '55%', height: 16 }} />
              <div className="skeleton-line" style={{ width: '75%', height: 12, marginTop: 4 }} />
            </td>
            <td><div className="skeleton-line" style={{ width: '40%', height: 20, borderRadius: 'var(--radius-full)' }} /></td>
            <td><div className="skeleton-line" style={{ width: '30%', height: 16 }} /></td>
            <td><div className="skeleton-line" style={{ width: '35%', height: 20, borderRadius: 'var(--radius-full)' }} /></td>
            <td><div className="skeleton-line" style={{ width: '25%', height: 24 }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    fetchAdminMenu().then((r) => setItems(r.data.items)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing?._id) {
      await updateMenuItem(editing._id, data);
    } else {
      await createMenuItem(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    await deleteMenuItem(confirmDelete);
    setConfirmDelete(null);
    load();
  };

  return (
    <>
      <Navbar />
      {(showForm || editing) && (
        <MenuForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Menu Item"
          message="Are you sure you want to delete this menu item? It will be removed from the student menu."
          confirmText="Delete Item"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div className="dashboard-layout">
        <Sidebar links={ADMIN_LINKS} />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="page-title" style={{ marginBottom: 4 }}>Menu Management</h1>
              <p style={{ color: 'var(--grey-text)', fontSize: '0.875rem' }}>Add, update, or disable food items from canteen menu</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus size={16} /> Add Food Item
            </button>
          </div>

          {loading ? (
            <MenuTableSkeleton />
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Utensils size={40} style={{ color: 'var(--grey-text)', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No menu items found</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong style={{ fontSize: '0.9375rem', color: 'var(--text)' }}>{item.name}</strong>
                        {item.description && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--grey-text)', marginTop: 2 }}>
                            {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="filter-tab" style={{ padding: '3px 10px', fontSize: '0.75rem', cursor: 'default' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--red)' }}>₹{item.price}</td>
                      <td>
                        <span className={`status-badge ${item.available ? 'status-Completed' : 'status-Pending'}`}>
                          {item.available ? 'Available' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(item); setShowForm(true); }} aria-label="Edit Item">
                            <Pencil size={15} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(item._id)} aria-label="Delete Item">
                            <Trash2 size={15} />
                          </button>
                        </div>
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

export default AdminMenuPage;
