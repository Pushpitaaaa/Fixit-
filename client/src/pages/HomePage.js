import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopProviders } from '../services/api';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [topProviders, setTopProviders] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { name: 'Appliance', icon: '📺' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'Home Maintenance', icon: '🛠️' },
    { name: 'Tutoring', icon: '📚' },
    { name: 'Tech Support', icon: '💻' },
    { name: 'Pest Control', icon: '🐛' },
    { name: 'Shifting', icon: '🚚' }
  ];
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getTopProviders();
        setTopProviders(data);
      } catch (err) {
        console.error('Failed to fetch top providers', err);
      }
    };
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>FixIt - Service Marketplace</h1>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-color)' }}>Hello, {user.name}</span>
              <button onClick={() => navigate('/my-bookings')} className="btn-secondary">View Orders</button>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 20px' }}>Login</button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <section className="search-container">
        <h2 className="section-title" style={{ alignSelf: 'flex-start' }}>Find a Professional</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title, category, description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 className="section-title">Service Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="category-card"
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{cat.icon}</div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Top Providers Section */}
      <section>
        <h2 className="section-title">Top Rated Providers</h2>
        {topProviders.length > 0 ? (
          <div className="services-grid">
            {topProviders.map((provider) => (
              <div key={provider._id} className="service-card">
                <h3>{provider.user.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <span style={{ color: '#FFD700', fontSize: '1.2rem' }}>⭐ {provider.averageRating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-light)' }}>({provider.totalJobs} jobs)</span>
                  {provider.isVerified && provider.totalJobs >= 20 && (
                    <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      ✅ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loading-text">Loading top providers...</div>
        )}
      </section>
    </div>
  );
}
