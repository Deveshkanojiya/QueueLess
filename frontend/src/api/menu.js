import api from './axios';

export const fetchMenu = () => api.get('/menu');
