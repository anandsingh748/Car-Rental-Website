import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CarCard from './CarCard';
import { SlidersHorizontal, Search, RotateCcw, AlertCircle } from 'lucide-react';
import './CarCatalog.css';

export default function CarCatalog({ searchParams, onViewDetails, onBook }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [maxPrice, setMaxPrice] = useState(25000);

  // Sync search parameters from Hero search widget
  useEffect(() => {
    if (searchParams) {
      if (searchParams.city) {
        // City search filter - can display matching cars or general location details
      }
      if (searchParams.driverMode) {
        // driverMode can affect visual selections
      }
    }
  }, [searchParams]);

  // Load Cars from API
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCars({
        category,
        fuel,
        transmission,
        search,
        maxPrice
      });
      setCars(data);
    } catch (err) {
      setError("Unable to load the vehicle inventory. Please make sure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [category, fuel, transmission, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setFuel('All');
    setTransmission('All');
    setMaxPrice(25000);
  };

  const categories = ['All', 'Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury', 'EV'];
  const fuels = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['All', 'Manual', 'Automatic'];

  return (
    <section className="catalog-section container">
      <div className="catalog-header animate-fade-in-up">
        <h2>Rent India's Favourite Vehicles</h2>
        <p>Choose from our meticulously maintained fleet of high-quality Indian cars.</p>
        {searchParams && searchParams.city && (
          <div className="active-search-indicator">
            Showing cars available in <span className="city-accent">{searchParams.city}</span> for drive mode: <span className="city-accent">{searchParams.driverMode === 'chauffeur' ? 'With Chauffeur' : 'Self-Drive'}</span>
          </div>
        )}
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass-panel animate-fade-in-up">
          <div className="sidebar-title">
            <SlidersHorizontal size={18} className="gold-text" />
            <h3>Filter Inventory</h3>
            <button className="reset-btn" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={14} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="search-box">
            <input 
              type="text" 
              placeholder="Search make or model..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field search-input"
            />
            <button type="submit" className="search-btn-inner">
              <Search size={16} />
            </button>
          </form>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Vehicle Class</label>
            <div className="filter-options-grid">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Filter */}
          <div className="filter-group">
            <label className="filter-label">Fuel Type</label>
            <div className="filter-options-column">
              {fuels.map(f => (
                <label key={f} className="filter-checkbox-wrapper">
                  <input 
                    type="radio" 
                    name="fuel" 
                    checked={fuel === f}
                    onChange={() => setFuel(f)} 
                  />
                  <span className="checkbox-custom-label">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="filter-group">
            <label className="filter-label">Transmission</label>
            <div className="filter-options-column">
              {transmissions.map(t => (
                <label key={t} className="filter-checkbox-wrapper">
                  <input 
                    type="radio" 
                    name="transmission" 
                    checked={transmission === t}
                    onChange={() => setTransmission(t)} 
                  />
                  <span className="checkbox-custom-label">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="price-slider-header">
              <label className="filter-label">Max Price Per Day</label>
              <span className="slider-price-label">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range" 
              min="1500" 
              max="25000" 
              step="500"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="price-slider"
            />
            <div className="slider-limits">
              <span>₹1,500</span>
              <span>₹25,000</span>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <main className="catalog-grid-area">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Fetching best vehicles for your journey...</p>
            </div>
          ) : error ? (
            <div className="error-state glass-panel">
              <AlertCircle className="error-icon" size={40} />
              <p className="error-text">{error}</p>
              <button className="btn btn-primary" onClick={fetchCars}>Try Again</button>
            </div>
          ) : cars.length === 0 ? (
            <div className="empty-state glass-panel">
              <h3>No Vehicles Match Your Search</h3>
              <p>Try resetting some filters or searching for different vehicle types.</p>
              <button className="btn btn-outline" onClick={handleResetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="cars-grid">
              {cars.map(car => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  onViewDetails={onViewDetails} 
                  onBook={onBook} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
