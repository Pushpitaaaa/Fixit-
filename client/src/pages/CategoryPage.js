import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicesByCategory } from '../services/api';

export default function CategoryPage() {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServicesByCategory(category);
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [category]);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} className="btn-secondary" style={{ marginBottom: '30px' }}>
        &larr; Back Home
      </button>
      <h2 className="section-title">Category: {category}</h2>

      {loading ? (
        <div className="loading-text">Loading services...</div>
      ) : services.length > 0 ? (
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service._id} 
              onClick={() => navigate(`/service/${service._id}`)}
              className="service-card"
            >
              <h3>{service.title}</h3>
              <p className="price">৳{service.price}</p>
              <p>{service.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No services found in this category.</div>
      )}
    </div>
  );
}
