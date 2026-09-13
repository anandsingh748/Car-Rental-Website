import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarCatalog from './components/CarCatalog';
import CarDetailsModal from './components/CarDetailsModal';
import BookingModal from './components/BookingModal';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import { ShieldCheck, Info, Heart } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('catalog'); // 'catalog', 'bookings', 'admin'
  const [userRole, setUserRole] = useState('customer'); // 'customer', 'admin'
  
  // Search parameters entered in the Hero section
  const [searchParams, setSearchParams] = useState(null);

  // Modals state
  const [selectedCarDetailsId, setSelectedCarDetailsId] = useState(null);
  const [selectedCarBooking, setSelectedCarBooking] = useState(null);

  const handleHeroSearch = (params) => {
    setSearchParams(params);
    // Smooth scroll to catalog grid
    const catalogElement = document.querySelector('.catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = () => {
    // Refresh dashboard if needed or redirect
    setTimeout(() => {
      setActiveView('bookings');
    }, 1500);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userRole={userRole} 
        setUserRole={setUserRole} 
      />

      <main className="main-content">
        {/* Main Content routing based on activeView state */}
        {activeView === 'catalog' && (
          <>
            <Hero onSearch={handleHeroSearch} />
            <CarCatalog 
              searchParams={searchParams}
              onViewDetails={(id) => setSelectedCarDetailsId(id)}
              onBook={(car) => setSelectedCarBooking(car)}
            />
          </>
        )}

        {activeView === 'bookings' && (
          <UserDashboard />
        )}

        {activeView === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Modals */}
      {selectedCarDetailsId && (
        <CarDetailsModal 
          carId={selectedCarDetailsId}
          onClose={() => setSelectedCarDetailsId(null)}
          onBook={(car) => setSelectedCarBooking(car)}
        />
      )}

      {selectedCarBooking && (
        <BookingModal 
          car={selectedCarBooking}
          searchParams={searchParams}
          onClose={() => setSelectedCarBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Premium Footer */}
      <footer className="glass-panel" style={{
        maxWidth: '1200px',
        width: 'calc(100% - 2rem)',
        margin: '2rem auto 1.5rem',
        padding: '2rem 1.5rem',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        border: '1px solid var(--border-card)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '350px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>Bharat<span style={{ color: 'var(--accent-gold)' }}>Drive</span></h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              India's premium self-drive vehicle renting portal. Over 500,000+ happy kilometers logged across 15+ metro hubs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>Popular Cities</h5>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Delhi NCR • Mumbai • Bengaluru • Goa</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>Operations Office</h5>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>BharatDrive HQ, Aerocity, New Delhi, India</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>support@bharatdrive.in | +91 11 4050 6070</span>
          </div>
        </div>

        <div style={{
          height: '1px',
          background: 'var(--border-subtle)'
        }}></div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}>
          <span>© {new Date().getFullYear()} BharatDrive Self-Drive Cars. All Rights Reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Made with</span>
            <Heart size={12} fill="var(--color-error)" color="var(--color-error)" />
            <span>in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}