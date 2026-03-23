import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getDashboard = async () => {
  const { data } = await api.get('/provider/dashboard');
  return data;
};

export const toggleOpen = async () => {
  const { data } = await api.put('/provider/toggle-open');
  return data;
};

export const addService = async (data) => {
  const response = await api.post('/provider/services', data);
  return response.data;
};

export const editService = async (id, data) => {
  const response = await api.put(`/provider/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/provider/services/${id}`);
  return response.data;
};

export const getPendingRequests = async () => {
  const { data } = await api.get('/provider/pending');
  return data;
};

export const respondToBooking = async (id, action) => {
  const { data } = await api.put(`/provider/bookings/${id}/respond`, { action });
  return data;
};

export const getEarnings = async (period) => {
  const { data } = await api.get(`/provider/earnings?period=${period}`);
  return data;
};

export const uploadPortfolioPhoto = async (formData) => {
  const { data } = await api.post('/provider/portfolio', formData);
  return data;
};

export default api;
