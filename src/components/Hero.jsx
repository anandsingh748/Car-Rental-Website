import React, { useState } from 'react';
import { MapPin, Calendar, Compass, UserCheck } from 'lucide-react';
import './Hero.css';

export default function Hero({ onSearch }) {
  const [city, setCity] = useState('Delhi NCR');
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [driverMode, setDriverMode] = useState('self'); // 'self' or 'chauffeur'

  const cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Pune', 'Hyderabad', 'Chennai'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, pickupDate, dropDate, driverMode });
  };

  return (
    <div className="hero-section">
      <div className="hero-bg-overlay"></div>
      <div className="container hero-container animate-fade-in-up">
        <div className="hero-content">
          <div className="promo-badge">🇮🇳 INDIA'S HIGHEST RATED SELF-DRIVE PLATFORM</div>
          <h1 className="hero-title">
            Explore India in <br />
            <span className="gradient-text">Premium Style</span>
          </h1>
          <p className="hero-subtitle">
            Rent top-tier Indian hatchbacks, SUVs, and luxury sedans. Choose flexible self-drive or relax with professional, verified chauffeurs.
          </p>

          <div className="hero-features">
            <div className="hero-feat-item">
              <span className="feat-check">✓</span> <span>Zero Hidden Charges</span>
            </div>
            <div className="hero-feat-item">
              <span className="feat-check">✓</span> <span>GST Invoices Provided</span>
            </div>
            <div className="hero-feat-item">
              <span className="feat-check">✓</span> <span>24/7 Roadside Support</span>
            </div>
          </div>
        </div>

        {/* Search Widget Form */}
        <form onSubmit={handleSubmit} className="search-widget glass-panel">
          <div className="widget-row">
            <div className="widget-field select-field">
              <div className="field-icon-wrapper">
                <MapPin className="field-icon" />
              </div>
              <div className="field-inputs">
                <label>Pick-up City</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="widget-field">
              <div className="field-icon-wrapper">
                <Calendar className="field-icon" />
              </div>
              <div className="field-inputs">
                <label>Pickup Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={pickupDate} 
                  onChange={(e) => setPickupDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="widget-field">
              <div className="field-icon-wrapper">
                <Calendar className="field-icon" />
              </div>
              <div className="field-inputs">
                <label>Drop Date</label>
                <input 
                  type="date" 
                  required
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  value={dropDate} 
                  onChange={(e) => setDropDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="widget-field select-field">
              <div className="field-icon-wrapper">
                <UserCheck className="field-icon" />
              </div>
              <div className="field-inputs">
                <label>Service Mode</label>
                <select value={driverMode} onChange={(e) => setDriverMode(e.target.value)}>
                  <option value="self">🚗 Self-Drive</option>
                  <option value="chauffeur">👔 With Chauffeur</option>
                </select>
              </div>
            </div>
          </div>

          <div className="widget-action">
            <button type="submit" className="btn btn-primary btn-search-fleet">
              <Compass size={18} /> Search Available Cars
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
