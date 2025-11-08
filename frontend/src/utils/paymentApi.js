import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from zustand store (persisted in localStorage)
const getAuthToken = () => {
  try {
    // Zustand persist stores in localStorage with the key 'auth-storage'
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      const token = state?.token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    
    // Fallback: check for direct token
    const directToken = localStorage.getItem('token');
    return directToken ? { Authorization: `Bearer ${directToken}` } : {};
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {};
  }
};

// Payment Methods API
export const paymentMethodAPI = {
  // Get all payment methods
  getAll: async () => {
    const response = await axios.get(`${API_URL}/payment-methods`, {
      headers: getAuthToken()
    });
    return response.data;
  },

  // Add new payment method
  add: async (data) => {
    const response = await axios.post(`${API_URL}/payment-methods`, data, {
      headers: getAuthToken()
    });
    return response.data;
  },

  // Update payment method
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/payment-methods/${id}`, data, {
      headers: getAuthToken()
    });
    return response.data;
  },

  // Delete payment method
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/payment-methods/${id}`, {
      headers: getAuthToken()
    });
    return response.data;
  },

  // Set as default
  setDefault: async (id) => {
    const response = await axios.put(
      `${API_URL}/payment-methods/${id}/default`,
      {},
      { headers: getAuthToken() }
    );
    return response.data;
  }
};

// Booking API - Check-in/Check-out
export const bookingAPI = {
  // Get active booking
  getActiveBooking: async () => {
    const response = await axios.get(
      `${API_URL}/bookings/active`,
      { headers: getAuthToken() }
    );
    return response.data;
  },

  // Check-in
  checkIn: async (bookingId) => {
    const response = await axios.put(
      `${API_URL}/bookings/${bookingId}/checkin`,
      {},
      { headers: getAuthToken() }
    );
    return response.data;
  },

  // Check-out
  checkOut: async (bookingId) => {
    const response = await axios.put(
      `${API_URL}/bookings/${bookingId}/checkout`,
      {},
      { headers: getAuthToken() }
    );
    return response.data;
  }
};
