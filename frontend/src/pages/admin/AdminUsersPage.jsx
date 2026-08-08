import { useEffect, useState } from 'react';
import { Pencil, Trash2, Search, UserPlus, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ADMIN_LINKS } from './AdminDashboard';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/admin';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'staff' };

const UserForm = ({ initial, onSave, onCancel }) => {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(isEdit ? { name: initial.name, email: initial.email, role: initial.role, password: '' } : EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box" style={{ maxWidth: 440 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>
          {isEdit ? 'Edit User Details' : 'Add Staff or Admin'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="user@queueless.com" value={form.email} onChange={handleChange} required />
          </div>
          {!isEdit && (
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--grey-text)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--grey-text)'; }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Role Assignment</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              {isEdit && <option value="student">Student</option>}
            </select>
          </div>
          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    const params = {};
    if (roleFilter) params.role = roleFilter;
    if (search) params.search = search;
    fetchUsers(params).then((r) => setUsers(r.data.users)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [roleFilter, search]);

  const handleSave = async (data) => {
    if (editing?._id) {
      await updateUser(editing._id, { name: data.name, email: data.email, role: data.role });
    } else {
      await createUser(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    await deleteUser(confirmDelete);
    setConfirmDelete(null);
    load();
  };

  const roleColor = { student: 'status-Preparing', staff: 'status-Completed', admin: 'status-Pending' };

  return (
    <>
      <Navbar />
      {(showForm || editing) && (
        <UserForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
      {confirmDelete && (
        <ConfirmDialog message="Are you sure you want to remove this user account?" onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
      )}
      <div className="dashboard-layout">
        <Sidebar links={ADMIN_LINKS} />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Staff & User Management</h1>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setShowForm(true); }}>
              <UserPlus size={16} /> Add User
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {['', 'student', 'staff', 'admin'].map((r) => (
                <button
                  key={r}
                  className={`filter-tab ${roleFilter === r ? 'active' : ''}`}
                  onClick={() => setRoleFilter(r)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {r || 'All Roles'}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-text)' }} />
              <input
                className="search-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search name or email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-box"><div className="spinner" /></div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>👥</p>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No users found</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                Try adjusting your search query or role filter.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ color: 'var(--text-light)' }}>{u.email}</td>
                      <td><span className={`status-badge ${roleColor[u.role]}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--grey-text)' }}>{new Date(u.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(u); setShowForm(true); }} aria-label="Edit User">
                            <Pencil size={15} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(u._id)} aria-label="Delete User">
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

export default AdminUsersPage;
