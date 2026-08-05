import api from './axios';

export const placeOrder = (data) => api.post('/orders', data);
export const fetchMyOrders = () => api.get('/orders/my');
export const cancelOrder = (id) => api.delete(`/orders/${id}`);
export const confirmPayment = (id) => api.post(`/orders/${id}/confirm-payment`);
export const fetchCanteenQr = () => api.get('/menu/canteen-qr');
