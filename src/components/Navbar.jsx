import React from 'react';
import { User, ShieldAlert, Car } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeView, setActiveView, userRole, setUserRole }) {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setActiveView('catalog')}>
          <div className="logo-icon-wrapper">
            <Car className="logo-icon animate-pulse" />
          </div>
          <span className="logo-text">Bharat<span className="gold-text">Drive</span></span>
        </div>

        <ul className="navbar-links">
          <li 
            className={`navbar-item ${activeView === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveView('catalog')}
          >
            Explore Fleet
          </li>
          {userRole === 'customer' && (
            <li 
              className={`navbar-item ${activeView === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveView('bookings')}
            >
              My Bookings
            </li>
          )}
          {userRole === 'admin' && (
            <li 
              className={`navbar-item ${activeView === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveView('admin')}
            >
              Admin Control
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          <div className="role-selector-wrapper">
            <select 
              value={userRole} 
              onChange={(e) => {
                setUserRole(e.target.value);
                // Redirect on role switch
                if (e.target.value === 'admin') {
                  setActiveView('admin');
                } else {
                  setActiveView('catalog');
                }
              }}
              className="role-select"
            >
              <option value="customer">👤 Customer View</option>
              <option value="admin">🔒 Admin View</option>
            </select>
          </div>

          <div className="user-profile-badge">
            <div className="avatar">
              {userRole === 'admin' ? <ShieldAlert size={16} /> : <User size={16} />}
            </div>
            <div className="profile-info">
              <span className="profile-name">{userRole === 'admin' ? 'System Admin' : 'Anand Sharma'}</span>
              <span className="profile-role">{userRole === 'admin' ? 'Delhi HQ' : 'Premium Member'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
