const API_BASE = '/api';

export const api = {
  // Fetch cars with optional filters
  async getCars(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.fuel && filters.fuel !== 'All') params.append('fuel', filters.fuel);
    if (filters.transmission && filters.transmission !== 'All') params.append('transmission', filters.transmission);
    if (filters.search) params.append('search', filters.search);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const res = await fetch(`${API_BASE}/cars?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch cars");
    return await res.json();
  },

  // Fetch detailed car and reviews
  async getCarDetails(id) {
    const res = await fetch(`${API_BASE}/cars/${id}`);
    if (!res.ok) throw new Error("Failed to fetch car details");
    return await res.json();
  },

  // Create a booking
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create booking");
    }
    return await res.json();
  },

  // Get bookings for a specific user (by email) or all bookings (for admin)
  async getBookings(email = '') {
    const url = email ? `${API_BASE}/bookings?email=${encodeURIComponent(email)}` : `${API_BASE}/bookings`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  },

  // Update booking status
  async updateBookingStatus(id, status) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update booking status");
    return await res.json();
  },

  // Post a review
  async submitReview(carId, reviewData) {
    const res = await fetch(`${API_BASE}/cars/${carId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return await res.json();
  },

  // Get Admin stats
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return await res.json();
  },

  // Admin add new car
  async addCar(carData) {
    const res = await fetch(`${API_BASE}/admin/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error("Failed to add car");
    return await res.json();
  },

  // Admin edit car
  async updateCar(id, carData) {
    const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error("Failed to update car");
    return await res.json();
  }
};
