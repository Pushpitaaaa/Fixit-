import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProviderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const loadProvider = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/providers/${id}`);
      const data = await res.json();
      setProvider(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProvider();
  }, [id]);

  if (!provider) {
    return <p>Loading...</p>;
  }

  const totalCost =
    provider.serviceFee + provider.platformFee + provider.taxes;

  return (
    <div className="container">
      <h1 className="main-title">FIXIT</h1>
      <p className="tagline">All of your things in one place</p>

      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>

      <div className="details-card">
        <h2>{provider.name}</h2>
        <p><strong>Category:</strong> {provider.category}</p>
        <p><strong>Rating:</strong> {provider.rating}</p>

        <h3>What is included in this service:</h3>
        <ul>
          {provider.includes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Cost Breakdown</h3>
        <div className="cost-box">
          <p><strong>Service Fee:</strong> ৳{provider.serviceFee}</p>
          <p><strong>Platform Fee:</strong> ৳{provider.platformFee}</p>
          <p><strong>Taxes:</strong> ৳{provider.taxes}</p>
          <hr />
          <p><strong>Total Cost:</strong> ৳{totalCost}</p>
        </div>

        {!confirmed ? (
          <button
            className="confirm-btn"
            onClick={() => setConfirmed(true)}
          >
            Confirm Booking
          </button>
        ) : (
          <p className="success-text">Booking confirmed successfully.</p>
        )}
      </div>
    </div>
  );
}

export default ProviderDetailsPage;