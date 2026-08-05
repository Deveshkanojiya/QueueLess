import api from './axios';

export const fetchStaffStats = () => api.get('/staff/stats');
export const fetchAllOrders = (params) => api.get('/staff/orders', { params });
export const updateOrderStatus = (id, status) => api.patch(`/staff/orders/${id}/status`, { status });
export const verifyOrderPayment = (id) => api.patch(`/staff/orders/${id}/verify-payment`);
export const staffCancelOrder = (id, reason) => api.patch(`/staff/orders/${id}/cancel`, { reason });
