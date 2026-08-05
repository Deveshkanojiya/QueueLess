import api from './axios';

// Stats
export const fetchAdminStats = () => api.get('/admin/stats');

// Users
export const fetchUsers = (params) => api.get('/admin/users', { params });
export const createUser = (data) => api.post('/admin/users', data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Orders
export const fetchAdminOrders = (params) => api.get('/admin/orders', { params });

// Menu
export const fetchAdminMenu = () => api.get('/admin/menu');
export const createMenuItem = (data) => api.post('/admin/menu', data);
export const updateMenuItem = (id, data) => api.put(`/admin/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/admin/menu/${id}`);
