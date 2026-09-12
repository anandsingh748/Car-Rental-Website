import React from 'react';
import { Fuel, Users, Eye, Sparkles } from 'lucide-react';
import './CarCard.css';

export default function CarCard({ car, onViewDetails, onBook }) {
  const { brand, model, category, transmission, fuel, pricePerDay, seating, mileage, image } = car;

  // Custom transmission icons or abbreviations
  const transmissionBadge = transmission === 'Automatic' ? 'Auto' : 'Manual';
  
  return (
    <div className="car-card glass-panel animate-fade-in-up">
      <div className="card-image-wrapper">
        <img 
          src={image} 
          alt={`${brand} ${model}`} 
          className="car-image" 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <span className="category-tag">{category}</span>
        
        {pricePerDay > 4000 && (
          <span className="premium-badge">
            <Sparkles size={12} /> Premium
          </span>
        )}
      </div>

      <div className="card-info">
        <div className="card-header">
          <span className="car-brand">{brand}</span>
          <h3 className="car-model">{model}</h3>
        </div>

        <div className="card-specs">
          <div className="spec-item">
            <Fuel size={16} className="spec-icon" />
            <span>{fuel}</span>
          </div>
          <div className="spec-item">
            {/* Custom Gear Icon */}
            <svg className="spec-icon gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>{transmissionBadge}</span>
          </div>
          <div className="spec-item">
            <Users size={16} className="spec-icon" />
            <span>{seating} Seats</span>
          </div>
        </div>

        <div className="card-divider"></div>

        <div className="card-footer">
          <div className="price-container">
            <span className="price-value">₹{pricePerDay.toLocaleString('en-IN')}</span>
            <span className="price-unit">/day</span>
          </div>

          <div className="card-actions">
            <button 
              className="btn btn-secondary icon-btn-only" 
              onClick={() => onViewDetails(car.id)}
              title="View Specifications & Reviews"
            >
              <Eye size={18} />
            </button>
            <button 
              className="btn btn-primary btn-book-now" 
              onClick={() => onBook(car)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
