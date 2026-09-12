import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, Users, DollarSign, Car, Plus, ShieldCheck, ShieldAlert, Check, X, RefreshCw, Layers } from 'lucide-react';
import './AdminPanel.css';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Car Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('SUV');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuel, setFuel] = useState('Petrol');
  const [pricePerDay, setPricePerDay] = useState('');
  const [seating, setSeating] = useState('5');
  const [mileage, setMileage] = useState('');
  const [image, setImage] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await api.getAdminStats();
      const bookingsData = await api.getBookings();
      const carsData = await api.getCars();

      setStats(statsData);
      setBookings(bookingsData);
      setCars(carsData);
    } catch (err) {
      setError("Failed to fetch admin controls. Verify Express server connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      // Reload stats and bookings
      fetchAdminData();
    } catch (err) {
      alert("Failed to update booking status.");
      console.error(err);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!brand || !model || !pricePerDay || !mileage) return;

    try {
      await api.addCar({
        brand,
        model,
        category,
        transmission,
        fuel,
        pricePerDay: parseInt(pricePerDay),
        seating: parseInt(seating),
        mileage,
        image
      });
      // Reset form
      setBrand('');
      setModel('');
      setPricePerDay('');
      setMileage('');
      setImage('');
      setShowAddForm(false);
      // Refresh inventory
      fetchAdminData();
    } catch (err) {
      alert("Failed to add new vehicle to inventory.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-section container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Authenticating admin controls...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-section container">
        <div className="error-state glass-panel">
          <ShieldAlert className="error-icon" size={40} />
          <p className="error-text">{error || "Could not load stats"}</p>
          <button className="btn btn-primary" onClick={fetchAdminData}>Try Again</button>
        </div>
      </div>
    );
  }

  // Find max category value for chart scaling
  const maxVal = stats.categoriesData.length > 0 
    ? Math.max(...stats.categoriesData.map(c => c.value)) 
    : 1;

  return (
    <div className="admin-section container animate-fade-in-up">
      <div className="admin-header">
        <div>
          <h2>Admin Control Center</h2>
          <p>Monitor earnings, manage rental approvals, and supervise your vehicle fleet.</p>
        </div>
        <button className="btn btn-secondary btn-sync" onClick={fetchAdminData}>
          <RefreshCw size={16} /> Refresh Panel
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="analytics-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper gold-bg">
            <DollarSign size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Earnings</span>
            <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper blue-bg">
            <BarChart3 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Bookings Placed</span>
            <h3>{stats.totalBookings}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper green-bg">
            <Car size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Fleet Count</span>
            <h3>{stats.totalCars} Cars</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper purple-bg">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Rentals</span>
            <h3>{stats.activeRentals}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="charts-layout">
        <div className="chart-container glass-panel">
          <h4>Rentals by Vehicle Class</h4>
          {stats.categoriesData.length === 0 ? (
            <p className="no-data">No booking metrics logged yet.</p>
          ) : (
            <div className="bar-chart-visual">
              {stats.categoriesData.map(item => {
                const heightPercent = (item.value / maxVal) * 80; // scale to max 80% height
                return (
                  <div key={item.name} className="chart-bar-item">
                    <div className="bar-value-label">{item.value}</div>
                    <div 
                      className="bar-column" 
                      style={{ height: `${Math.max(15, heightPercent)}%` }}
                    ></div>
                    <span className="bar-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fleet-quick-summary glass-panel">
          <h4>Active Fleet Overview</h4>
          <div className="fleet-list-summary">
            {cars.slice(0, 4).map(car => (
              <div key={car.id} className="fleet-summary-row">
                <div className="fleet-name-wrapper">
                  <span className={`fleet-dot ${car.available ? 'dot-active' : 'dot-busy'}`}></span>
                  <strong>{car.brand} {car.model}</strong>
                </div>
                <span>₹{car.pricePerDay}/day</span>
              </div>
            ))}
            {cars.length > 4 && <div className="more-fleet-text">+ {cars.length - 4} other vehicles in directory</div>}
          </div>
        </div>
      </div>

      {/* Bookings Approvals Table */}
      <div className="admin-table-panel glass-panel">
        <div className="panel-title-row">
          <h3>Customer Rental Registrations</h3>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle Info</th>
                <th>Client Details</th>
                <th>City & Dates</th>
                <th>Paid Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-records">No bookings found.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id}>
                    <td><strong>#BD-00{b.id}</strong></td>
                    <td>
                      <div className="tbl-car-cell">
                        <strong>{b.car?.brand} {b.car?.model}</strong>
                        <span>{b.car?.category} ({b.car?.transmission})</span>
                      </div>
                    </td>
                    <td>
                      <div className="tbl-client-cell">
                        <strong>{b.user_name}</strong>
                        <span>{b.user_email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tbl-dates-cell">
                        <strong>{b.city}</strong>
                        <span>{b.pickup_date} to {b.drop_date}</span>
                      </div>
                    </td>
                    <td><strong>₹{b.total_price.toLocaleString('en-IN')}</strong></td>
                    <td>
                      {b.status === 'Pending' && <span className="badge badge-pending">Pending Review</span>}
                      {b.status === 'Approved' && <span className="badge badge-approved">Approved</span>}
                      {b.status === 'Cancelled' && <span className="badge badge-cancelled">Cancelled</span>}
                      {b.status === 'Rejected' && <span className="badge badge-rejected">Rejected</span>}
                    </td>
                    <td>
                      {b.status === 'Pending' ? (
                        <div className="table-row-actions">
                          <button 
                            className="btn-action-circle btn-approve"
                            onClick={() => handleUpdateStatus(b.id, 'Approved')}
                            title="Verify and Approve Booking"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            className="btn-action-circle btn-reject"
                            onClick={() => handleUpdateStatus(b.id, 'Rejected')}
                            title="Reject Booking"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-row">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Inventory Management */}
      <div className="admin-inventory-panel glass-panel">
        <div className="panel-title-row">
          <h3>Fleet Operations Directory</h3>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} /> {showAddForm ? 'Close Form' : 'Register Vehicle'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCar} className="add-car-form animate-fade-in-up">
            <h4>Add New Vehicle to Inventory</h4>
            
            <div className="form-grid-three">
              <div className="input-group">
                <label>Car Brand</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Tata"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="input-field" 
                />
              </div>

              <div className="input-group">
                <label>Car Model Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Safari"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input-field" 
                />
              </div>

              <div className="input-group">
                <label>Category Class</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="EV">EV</option>
                  <option value="Luxury SUV">Luxury SUV</option>
                </select>
              </div>
            </div>

            <div className="form-grid-three">
              <div className="input-group">
                <label>Transmission</label>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="input-field">
                  <option value="Manual">Manual Gearbox</option>
                  <option value="Automatic">Automatic Drive</option>
                </select>
              </div>

              <div className="input-group">
                <label>Fuel Standard</label>
                <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="input-field">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div className="input-group">
                <label>Seating capacity</label>
                <select value={seating} onChange={(e) => setSeating(e.target.value)} className="input-field">
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="8">8 Seater</option>
                </select>
              </div>
            </div>

            <div className="form-grid-three">
              <div className="input-group">
                <label>Rent Per Day (INR)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="e.g. 3500"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  className="input-field" 
                />
              </div>

              <div className="input-group">
                <label>Estimated Mileage</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 17.5 kmpl or 400km range"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="input-field" 
                />
              </div>

              <div className="input-group">
                <label>Image URL (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Paste Unsplash image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field" 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-add-submit">
              Register Car in Fleet
            </button>
          </form>
        )}

        <div className="inventory-list-table">
          <div className="inventory-grid">
            {cars.map(c => (
              <div key={c.id} className="inventory-item-card glass-panel">
                <img 
                  src={c.image} 
                  alt={c.model} 
                  className="inv-card-img" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="inv-card-content">
                  <div>
                    <span className="inv-brand">{c.brand}</span>
                    <h5>{c.model}</h5>
                  </div>
                  <div className="inv-badge-row">
                    <span className="inv-tag">{c.category}</span>
                    <span className="inv-tag">{c.transmission}</span>
                  </div>
                  <strong className="inv-price">₹{c.pricePerDay}/day</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
