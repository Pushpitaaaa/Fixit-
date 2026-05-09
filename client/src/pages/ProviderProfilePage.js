import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProviderById } from '../services/api';

export default function ProviderProfilePage() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderById(id);
        setProvider(data);
      } catch (err) {
        console.error('Failed to fetch provider details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) return <div className="page-container loading-text">Loading provider profile...</div>;
  if (!provider) return <div className="page-container empty-state">Provider not found.</div>;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '30px' }}>
        &larr; Back
      </button>

      <div className="details-container" style={{ marginBottom: '40px' }}>
        <div className="details-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px', 
              height: '80px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {provider.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="details-title" style={{ marginBottom: '5px' }}>{provider.user.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-light)', flexWrap: 'wrap' }}>
                <span>✉️ {provider.user.email}</span>
                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>⭐ {provider.averageRating.toFixed(1)} Rating</span>
                <span>({provider.totalJobs} jobs completed)</span>
                {provider.isVerified && (
                  <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    ✅ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="section-title">Services Offered</h3>
      {provider.services && provider.services.length > 0 ? (
        <div className="services-grid">
          {provider.services.map((service) => (
            <Link key={service._id} to={`/service/${service._id}`} className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{service.title}</h3>
                <span className="category-tag">{service.category}</span>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '15px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {service.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                  ৳{service.price}
                </span>
                <span className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                  Book Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">This provider has not added any services yet.</div>
      )}
    </div>
  );
}
