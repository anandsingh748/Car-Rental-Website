import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, MapPin, Receipt, ShieldClose, RefreshCw, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const mockUserEmail = 'anand@gmail.com';

  const fetchUserBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBookings(mockUserEmail);
      setBookings(data);
    } catch (err) {
      setError("Unable to load bookings. Please make sure the backend is active.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.updateBookingStatus(id, 'Cancelled');
      // Update local state
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      alert("Failed to cancel booking. Try again.");
      console.error(err);
    }
  };

  // Status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-approved">Approved</span>;
      case 'Cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      case 'Rejected':
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge badge-pending">Pending Approval</span>;
    }
  };

  return (
    <div className="dashboard-section container animate-fade-in-up">
      <div className="dashboard-header">
        <div>
          <h2>My Bookings Dashboard</h2>
          <p>Manage your upcoming trips, check verification status, and view receipts.</p>
        </div>
        <button className="btn btn-secondary btn-sync" onClick={fetchUserBookings}>
          <RefreshCw size={16} /> Sync Bookings
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Syncing dashboard data...</p>
        </div>
      ) : error ? (
        <div className="error-state glass-panel">
          <AlertTriangle className="error-icon" size={40} />
          <p className="error-text">{error}</p>
          <button className="btn btn-primary" onClick={fetchUserBookings}>Try Again</button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-dashboard glass-panel">
          <h3>No Bookings Found</h3>
          <p>You haven't rented any vehicles yet. Choose a car and start exploring!</p>
        </div>
      ) : (
        <div className="dashboard-layout-grid">
          {/* Bookings List */}
          <div className="bookings-list-panel">
            {bookings.map(b => (
              <div key={b.id} className="booking-dashboard-card glass-panel">
                <div className="booking-card-media">
                  {b.car ? (
                    <img 
                      src={b.car.image} 
                      alt={b.car.model} 
                      className="b-car-img" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  ) : (
                    <div className="b-car-img-fallback">🚗</div>
                  )}
                </div>

                <div className="booking-card-details">
                  <div className="b-card-header">
                    <div>
                      <span className="b-car-brand">{b.car?.brand || 'Car'}</span>
                      <h4 className="b-car-model">{b.car?.model || 'Vehicle'}</h4>
                    </div>
                    {renderStatusBadge(b.status)}
                  </div>

                  <div className="b-card-grid-info">
                    <div className="b-info-item">
                      <MapPin size={14} className="gold-text" />
                      <span>{b.city} Hub</span>
                    </div>
                    <div className="b-info-item">
                      <Calendar size={14} className="gold-text" />
                      <span>{b.pickup_date} to {b.drop_date}</span>
                    </div>
                    <div className="b-info-item">
                      <span className="gold-text">👔</span>
                      <span>{b.chauffeur ? 'Chauffeur Driven' : 'Self-Drive'}</span>
                    </div>
                    <div className="b-info-item">
                      <span className="gold-text">₹</span>
                      <strong>₹{b.total_price.toLocaleString('en-IN')} paid</strong>
                    </div>
                  </div>

                  <div className="b-card-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedInvoice(b)}
                    >
                      <Receipt size={14} /> View Invoice
                    </button>
                    {b.status === 'Pending' && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(b.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invoice viewer modal/sidebar */}
          {selectedInvoice && (
            <div className="invoice-preview-backdrop" onClick={() => setSelectedInvoice(null)}>
              <div className="invoice-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="invoice-header-row">
                  <h3>Invoice Receipt</h3>
                  <button className="close-inv-btn" onClick={() => setSelectedInvoice(null)}>×</button>
                </div>

                <div className="print-invoice-box" id="printable-invoice">
                  <div className="invoice-meta-head">
                    <div>
                      <h2>BharatDrive</h2>
                      <p>Self-Drive Cars India Ltd.</p>
                    </div>
                    <div className="inv-meta-right">
                      <strong>INVOICE</strong>
                      <span>Receipt ID: #BD-2026-{selectedInvoice.id}</span>
                      <span>Date: {new Date().toISOString().split('T')[0]}</span>
                    </div>
                  </div>

                  <div className="invoice-billing-details">
                    <div className="bill-col">
                      <h5>Billed To:</h5>
                      <strong>{selectedInvoice.user_name}</strong>
                      <span>Email: {selectedInvoice.user_email}</span>
                      <span>Verified Client</span>
                    </div>
                    <div className="bill-col">
                      <h5>Pickup Address:</h5>
                      <strong>{selectedInvoice.city} Airport Hub</strong>
                      <span>BharatDrive Parking Garage</span>
                      <span>India</span>
                    </div>
                  </div>

                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Rate</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{selectedInvoice.car?.brand} {selectedInvoice.car?.model}</strong>
                          <br />
                          Category: {selectedInvoice.car?.category} ({selectedInvoice.car?.transmission})
                        </td>
                        <td>₹{selectedInvoice.car?.pricePerDay}</td>
                        <td>
                          {Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))} days
                        </td>
                        <td>
                          ₹{(selectedInvoice.car?.pricePerDay * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      {selectedInvoice.chauffeur === 1 && (
                        <tr>
                          <td>👔 Chauffeur Service Add-on</td>
                          <td>₹1,500</td>
                          <td>
                            {Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))} days
                          </td>
                          <td>
                            ₹{(1500 * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      )}
                      <tr className="subtotal-row">
                        <td colSpan="3">GST Tax (18%)</td>
                        <td>
                          ₹{Math.round((
                            ((selectedInvoice.car?.pricePerDay * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))) +
                            (selectedInvoice.chauffeur ? 1500 * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24))) : 0)) * 0.18
                          )).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr className="subtotal-row">
                        <td colSpan="3">Refundable Security Deposit</td>
                        <td>
                          ₹{(selectedInvoice.total_price - Math.round((
                            ((selectedInvoice.car?.pricePerDay * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24)))) +
                            (selectedInvoice.chauffeur ? 1500 * Math.max(1, Math.round((new Date(selectedInvoice.drop_date) - new Date(selectedInvoice.pickup_date)) / (1000 * 60 * 60 * 24))) : 0)) * 1.18
                          ))).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr className="total-row-inv">
                        <td colSpan="3">Amount Paid</td>
                        <td>₹{selectedInvoice.total_price.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="invoice-footer-terms">
                    <p><strong>Terms:</strong> Security deposit is subject to refund upon zero-damage inspection. Toll tax, fuel refills are charged extra. Fastag auto-billing.</p>
                  </div>
                </div>

                <div className="invoice-actions">
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    Print Receipt
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
