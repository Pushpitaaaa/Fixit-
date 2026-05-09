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

// Only redirect to login on protected routes if 401 is returned
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if the request was to a protected endpoint (contains auth-required keywords)
      const protectedEndpoints = ['/dashboard', '/pending', '/earnings', '/reviews'];
      const isProtected = protectedEndpoints.some((endpoint) => 
        error.config?.url?.includes(endpoint)
      );
      
      if (isProtected) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
// 🔹 CUSTOMER FEATURES

export const getAllServices = async () => {
  const { data } = await api.get('/provider/public/services');
  return data;
};

export const getServicesByCategory = async (category) => {
  const { data } = await api.get(`/provider/public/services/category/${category}`);
  return data;
};

export const searchServices = async (keyword) => {
  const { data } = await api.get(`/provider/public/services/search/${keyword}`);
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await api.get(`/provider/public/services/${id}`);
  return data;
};

export const getTopProviders = async () => {
  const { data } = await api.get('/provider/public/top-providers');
  return data;
};

export const getProviderById = async (id) => {
  const { data } = await api.get(`/provider/public/providers/${id}`);
  return data;
};

// 📦 ORDER TRACKING
export const getCustomerBookings = async () => {
  const { data } = await api.get('/provider/public/bookings');
  return data;
};

export const updateBookingStatus = async (bookingId) => {
  const { data } = await api.put(`/provider/bookings/${bookingId}/status`);
  return data;
};

export const createBooking = async (bookingData) => {
  const { data } = await api.post('/provider/public/bookings', bookingData);
  return data;
};

export const cancelBooking = async (bookingId) => {
  const { data } = await api.delete(`/provider/public/bookings/${bookingId}`);
  return data;
};

// ⭐ REVIEWS & RATINGS
export const getServiceReviews = async (serviceId) => {
  const { data } = await api.get(`/provider/public/services/${serviceId}/reviews`);
  return data;
};

export const addServiceReview = async (serviceId, reviewData) => {
  const { data } = await api.post(`/provider/public/services/${serviceId}/reviews`, reviewData);
  return data;
};

export const getProviderReviews = async () => {
  const { data } = await api.get('/provider/reviews');
  return data;
};

export const replyToReview = async (reviewId, replyData) => {
  const { data } = await api.post(`/provider/reviews/${reviewId}/reply`, replyData);
  return data;
};

export default api;
