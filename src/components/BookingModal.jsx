import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Calendar, User, Mail, FileText, CheckCircle, Smartphone, CreditCard, ChevronRight, Shield } from 'lucide-react';
import './BookingModal.css';

export default function BookingModal({ car, searchParams, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1); // 1: Trip Info, 2: Verification, 3: Payment, 4: Success

  // Booking Form States
  const [city, setCity] = useState(searchParams?.city || 'Delhi NCR');
  const [pickupDate, setPickupDate] = useState(searchParams?.pickupDate || new Date().toISOString().split('T')[0]);
  const [dropDate, setDropDate] = useState(searchParams?.dropDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]); // default 2 days out
  const [chauffeur, setChauffeur] = useState(searchParams?.driverMode === 'chauffeur');
  const [userName, setUserName] = useState('Anand Sharma');
  const [userEmail, setUserEmail] = useState('anand@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const [loading, setLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Pune', 'Hyderabad', 'Chennai'];

  // Calculate pricing breakdown
  const calculateDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(dropDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const baseRent = car.pricePerDay * days;
  const chauffeurRate = 1500;
  const driverRent = chauffeur ? chauffeurRate * days : 0;
  const subtotal = baseRent + driverRent;
  const gst = Math.round(subtotal * 0.18); // 18% standard GST in India
  
  // Security deposit varies by category
  const getSecurityDeposit = () => {
    switch (car.category.toLowerCase()) {
      case 'hatchback': return 4000;
      case 'sedan': return 6000;
      case 'suv': return 8000;
      case 'ev': return 7000;
      case 'luxury suv': return 12000;
      default: return 5000;
    }
  };
  const securityDeposit = getSecurityDeposit();
  const grandTotal = subtotal + gst + securityDeposit;

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        car_id: car.id,
        user_name: userName,
        user_email: userEmail,
        city,
        pickup_date: pickupDate,
        drop_date: dropDate,
        chauffeur,
        total_price: grandTotal
      };
      
      const res = await api.createBooking(bookingData);
      setCreatedBooking(res);
      setStep(4);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content booking-modal animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="booking-progress-wrapper">
            <div className="progress-steps">
              <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
              <div className="progress-line"></div>
              <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
              <div className="progress-line"></div>
              <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
            </div>
            <div className="progress-labels">
              <span>Trip Info</span>
              <span>Verification</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        <div className="booking-layout">
          {/* Main Form Left Area */}
          <div className="booking-form-area">
            
            {/* STEP 1: Trip & User details */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="booking-step-form">
                <h3>Trip & Driver Details</h3>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label>Pick-up City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="input-field">
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Chauffeur Service</label>
                    <select 
                      value={chauffeur ? 'yes' : 'no'} 
                      onChange={(e) => setChauffeur(e.target.value === 'yes')} 
                      className="input-field"
                    >
                      <option value="no">🚗 Self-Drive (Standard)</option>
                      <option value="yes">👔 With Chauffeur (+ ₹1,500/day)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Pickup Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={pickupDate} 
                      onChange={(e) => setPickupDate(e.target.value)} 
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label>Drop Date</label>
                    <input 
                      type="date" 
                      required
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      value={dropDate} 
                      onChange={(e) => setDropDate(e.target.value)} 
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="contact-details-section">
                  <h4>Contact Information</h4>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        className="input-field" 
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        className="input-field" 
                      />
                    </div>

                    <div className="input-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        required 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="input-field" 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-next-step">
                  Continue to Verification <ChevronRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2: Driving License Info */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="booking-step-form">
                <h3>Document Verification</h3>
                <p className="step-description">
                  To rent a vehicle in India, we require driving license registration details.
                </p>

                <div className="input-group">
                  <label>Driving License Number (Required)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. DL-1420230045689"
                    value={licenseNumber} 
                    onChange={(e) => setLicenseNumber(e.target.value)} 
                    className="input-field" 
                  />
                  <small className="help-text">Must be a valid Indian Driving License format.</small>
                </div>

                <div className="document-upload-mock glass-panel">
                  <FileText className="upload-icon" size={24} />
                  <div className="upload-text">
                    <strong>Upload Driving License Scan (MOCK)</strong>
                    <span>PDF, JPEG or PNG up to 5MB</span>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => alert("Mock upload successful!")}>
                    Choose File
                  </button>
                </div>

                <div className="security-notice-card">
                  <Shield size={16} className="gold-text" />
                  <span>Your information is encrypted securely and processed in compliance with KYC regulations.</span>
                </div>

                <div className="button-row">
                  <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Proceed to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Payment Section */}
            {step === 3 && (
              <div className="booking-step-form">
                <h3>Choose Payment Method</h3>
                
                <div className="payment-options">
                  <button 
                    className={`payment-opt-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Smartphone size={18} />
                    <span>UPI (Instant QR)</span>
                  </button>
                  <button 
                    className={`payment-opt-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="upi-payment-section glass-panel">
                    <div className="qr-code-mock">
                      {/* Generates a stylized QR Code drawing */}
                      <svg viewBox="0 0 100 100" width="120" height="120" className="qr-svg">
                        <rect x="0" y="0" width="100" height="100" fill="none" />
                        <rect x="10" y="10" width="20" height="20" fill="var(--color-text-primary)" />
                        <rect x="15" y="15" width="10" height="10" fill="var(--bg-surface)" />
                        <rect x="70" y="10" width="20" height="20" fill="var(--color-text-primary)" />
                        <rect x="75" y="15" width="10" height="10" fill="var(--bg-surface)" />
                        <rect x="10" y="70" width="20" height="20" fill="var(--color-text-primary)" />
                        <rect x="15" y="75" width="10" height="10" fill="var(--bg-surface)" />
                        <rect x="40" y="40" width="20" height="20" fill="var(--accent-gold)" />
                        {/* Mock pixel blocks */}
                        <rect x="40" y="15" width="5" height="15" fill="var(--color-text-primary)" />
                        <rect x="55" y="20" width="10" height="5" fill="var(--color-text-primary)" />
                        <rect x="75" y="45" width="15" height="5" fill="var(--color-text-primary)" />
                        <rect x="70" y="55" width="5" height="15" fill="var(--color-text-primary)" />
                        <rect x="15" y="45" width="15" height="5" fill="var(--color-text-primary)" />
                        <rect x="25" y="55" width="5" height="10" fill="var(--color-text-primary)" />
                        <rect x="45" y="75" width="15" height="10" fill="var(--color-text-primary)" />
                      </svg>
                    </div>
                    <div className="upi-instructions">
                      <p>Scan this QR code using BHIM, GPay, PhonePe or Paytm to pay</p>
                      <strong className="upi-id-label">UPI ID: bharatdrive@ybl</strong>
                      <span className="pay-amount-badge">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <form className="card-payment-form">
                    <div className="input-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="4532 9845 2311 0098"
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-row-two">
                      <div className="input-group">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                      <div className="input-group">
                        <label>CVV</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="***"
                          maxLength="3"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                    </div>
                  </form>
                )}

                <div className="button-row">
                  <button type="button" className="btn btn-secondary" onClick={handlePrevStep} disabled={loading}>
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-pay-now"
                    onClick={handleConfirmBooking}
                    disabled={loading}
                  >
                    {loading ? 'Processing Transaction...' : `Confirm & Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success confirmation screen */}
            {step === 4 && (
              <div className="booking-success-view">
                <div className="success-icon-wrapper animate-bounce">
                  <CheckCircle className="success-icon" size={60} />
                </div>
                <h3>Ride Confirmed!</h3>
                <p>
                  Your booking for the <strong className="gold-text">{car.brand} {car.model}</strong> has been successfully placed.
                </p>

                {createdBooking && (
                  <div className="booking-summary-receipt glass-panel">
                    <div className="receipt-row">
                      <span>Booking ID</span>
                      <strong>#BD-00{createdBooking.id}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>City Hub</span>
                      <strong>{createdBooking.city}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Trip Dates</span>
                      <strong>{createdBooking.pickup_date} to {createdBooking.drop_date}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Paid Amount</span>
                      <strong className="green-text">₹{createdBooking.total_price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Verification Status</span>
                      <span className="badge badge-pending">PENDING APPROVAL</span>
                    </div>
                  </div>
                )}

                <p className="success-small-text">
                  Our admin agent will review your driving credentials and verify the booking within 15 minutes. Check status in your dashboard.
                </p>

                <button className="btn btn-primary btn-done" onClick={onClose}>
                  Done
                </button>
              </div>
            )}

          </div>

          {/* Pricing & Vehicle Summary Right Panel */}
          {step < 4 && (
            <div className="booking-summary-panel glass-panel">
              <div className="summary-car-details">
                <img src={car.image} alt={car.model} className="summary-car-img" />
                <div>
                  <span className="summary-car-brand">{car.brand}</span>
                  <h4>{car.model}</h4>
                  <span className="summary-car-cat">{car.category}</span>
                </div>
              </div>

              <div className="pricing-breakdown">
                <h4>Invoice Breakdown</h4>
                
                <div className="price-row">
                  <span>Base Rate (₹{car.pricePerDay}/day)</span>
                  <span>₹{baseRent.toLocaleString('en-IN')}</span>
                </div>

                {chauffeur && (
                  <div className="price-row">
                    <span>Chauffeur Service (₹1,500/day)</span>
                    <span>₹{driverRent.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Trip Duration</span>
                  <span className="gold-text">{days} {days === 1 ? 'Day' : 'Days'}</span>
                </div>

                <div className="price-row">
                  <span>GST Taxes (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>

                <div className="price-row">
                  <span>Refundable Security Deposit</span>
                  <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="divider-line"></div>

                <div className="price-row total-row">
                  <span>Grand Total</span>
                  <span className="grand-total-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="refund-deposit-note">
                ℹ️ The security deposit of ₹{securityDeposit.toLocaleString('en-IN')} is 100% refundable upon safe return of the vehicle within 24 hours of drop-off.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
