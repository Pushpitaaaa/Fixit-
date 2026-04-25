import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../services/api';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const platformFeePercentage = 10; // 10%
  const taxPercentage = 5; // 5%

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        console.error('Failed to fetch service details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div className="page-container loading-text">Loading service details...</div>;
  if (!service) return <div className="page-container empty-state">Service not found.</div>;

  const serviceFee = service.price;
  const platformFee = (serviceFee * platformFeePercentage) / 100;
  const tax = (serviceFee * taxPercentage) / 100;
  const totalCost = serviceFee + platformFee + tax;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '30px' }}>
        &larr; Back
      </button>

      <div className="details-container">
        <div className="details-header">
          <h2 className="details-title">{service.title}</h2>
          <span className="category-tag">{service.category}</span>
        </div>

        <div className="details-description">
          <h3 className="section-title">Description</h3>
          <p>{service.description}</p>
        </div>

        <div className="summary-box">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Service Fee:</span>
            <span>৳{serviceFee.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee ({platformFeePercentage}%):</span>
            <span>৳{platformFee.toFixed(2)}</span>
          </div>
          <div className="summary-row" style={{ paddingBottom: '15px' }}>
            <span>Tax ({taxPercentage}%):</span>
            <span>৳{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Cost:</span>
            <span>৳{totalCost.toFixed(2)}</span>
          </div>

          <button className="btn-primary btn-book">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
