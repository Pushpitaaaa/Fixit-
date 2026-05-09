import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProviderById } from '../../services/api';

export default function ProviderProfile() {
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
        console.error('Failed to fetch provider', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) return <div className="page-container loading-text">Loading provider...</div>;
  if (!provider) return <div className="page-container empty-state">Provider not found.</div>;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '20px' }}>
        &larr; Back
      </button>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <h2>{provider.user.name}</h2>
          <div style={{ color: 'var(--text-light)', marginTop: '6px' }}>{provider.user.email}</div>
          {Number(provider.totalJobs || 0) > 23 && (
            <div style={{ marginTop: '10px', display: 'inline-block', backgroundColor: '#e6f4ea', color: '#137333', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
              ✅ Verified (more than 23 jobs)
            </div>
          )}
        </div>
      </div>

      <section style={{ marginTop: '30px' }}>
        <h3 className="section-title">Services</h3>
        {provider.services && provider.services.length > 0 ? (
          <div className="services-grid">
            {provider.services.map((service) => (
              <div key={service._id} className="service-card" onClick={() => navigate(`/service/${service._id}`)} style={{ cursor: 'pointer' }}>
                <h3>{service.title}</h3>
                <p className="price">৳{service.price}</p>
                <p>{service.description && service.description.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No services listed by this provider.</div>
        )}
      </section>
    </div>
  );
}
