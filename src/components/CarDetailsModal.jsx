import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Star, Calendar, MessageSquare, ShieldCheck, PenTool } from 'lucide-react';
import './CarDetailsModal.css';

export default function CarDetailsModal({ carId, onClose, onBook }) {
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form States
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getCarDetails(carId);
      setCar(data);
      setReviews(data.reviews || []);
    } catch (err) {
      setError("Failed to fetch car details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !comment) return;

    setSubmittingReview(true);
    try {
      const newReview = await api.submitReview(carId, {
        user_name: userName,
        rating,
        comment
      });
      setReviews([newReview, ...reviews]);
      setUserName('');
      setRating(5);
      setComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content loading-modal">
          <div className="loading-spinner"></div>
          <p>Loading vehicle blueprints...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content error-modal">
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          <p>{error || "Car not found"}</p>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content car-details-modal animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        
        <div className="details-grid">
          {/* Left: Car Media */}
          <div className="details-media">
            <img 
              src={car.image} 
              alt={`${car.brand} ${car.model}`} 
              className="details-car-img" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="details-quick-specs">
              <div className="quick-spec-badge">
                <span className="q-label">Mileage</span>
                <span className="q-val">{car.mileage}</span>
              </div>
              <div className="quick-spec-badge">
                <span className="q-label">Transmission</span>
                <span className="q-val">{car.transmission}</span>
              </div>
              <div className="quick-spec-badge">
                <span className="q-label">Fuel</span>
                <span className="q-val">{car.fuel}</span>
              </div>
              <div className="quick-spec-badge">
                <span className="q-label">Seating</span>
                <span className="q-val">{car.seating} Seater</span>
              </div>
            </div>

            <div className="rental-policy-card glass-panel">
              <h4>BharatDrive Rental Policies</h4>
              <ul>
                <li><ShieldCheck size={14} className="policy-icon" /> Renter must be at least 21 years old with a valid Driving License.</li>
                <li><ShieldCheck size={14} className="policy-icon" /> Fastag is installed on the car; toll charges will be deducted from security deposit.</li>
                <li><ShieldCheck size={14} className="policy-icon" /> 120 km/day included limit. Excess km charged at ₹12/km.</li>
              </ul>
            </div>
          </div>

          {/* Right: Info and Renting Details */}
          <div className="details-info">
            <span className="details-category">{car.category}</span>
            <h2 className="details-title">{car.brand} {car.model}</h2>

            <div className="rating-summary">
              <Star size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span className="avg-rating">{averageRating}</span>
              <span className="reviews-count">({reviews.length} Customer Reviews)</span>
            </div>

            <div className="price-tag-large">
              <div className="price-tag-label">Standard Fare</div>
              <div className="price-tag-amount">
                ₹{car.pricePerDay.toLocaleString('en-IN')} <span className="p-unit">/ day</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3>
                <MessageSquare size={16} className="gold-text" /> 
                Customer Reviews
              </h3>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="add-review-form glass-panel">
                <h4>Write a Review</h4>
                {reviewSuccess && <div className="review-success-msg">Review submitted successfully!</div>}
                
                <div className="form-row-two">
                  <div className="input-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      className="input-field" 
                    />
                  </div>

                  <div className="input-group">
                    <label>Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="input-field"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Review Comment</label>
                  <textarea 
                    required 
                    rows="2"
                    placeholder="Share your driving experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field comment-textarea"
                  ></textarea>
                </div>

                <button type="submit" disabled={submittingReview} className="btn btn-outline btn-submit-review">
                  <PenTool size={14} /> {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to rent and write a review!</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{r.user_name}</span>
                        <span className="review-date">{r.date}</span>
                      </div>
                      <div className="review-rating">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={12} fill="var(--accent-gold)" color="var(--accent-gold)" />
                        ))}
                      </div>
                      <p className="review-comment">"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rent Button */}
            <div className="details-action-sticky">
              <button 
                className="btn btn-primary btn-details-book"
                onClick={() => {
                  onClose();
                  onBook(car);
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
