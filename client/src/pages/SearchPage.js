import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchServices } from '../services/api';

export default function SearchPage() {
  const { keyword } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const data = await searchServices(keyword);
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch search results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} className="btn-secondary" style={{ marginBottom: '30px' }}>
        &larr; Back Home
      </button>
      <h2 className="section-title">Search Results for "{keyword}"</h2>

      {loading ? (
        <div className="loading-text">Loading...</div>
      ) : services.length > 0 ? (
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service._id} 
              onClick={() => navigate(`/service/${service._id}`)}
              className="service-card"
            >
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {service.icon && <span>{service.icon}</span>}
                {service.title}
              </h3>
              <span className="category-tag">{service.category}</span>
              <p className="price">৳{service.price}</p>
              <p>{service.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No services matched your search.</div>
      )}
    </div>
  );
}
