import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, createBooking, getServiceReviews } from '../services/api';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  // Booking form state
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookingStatus, setBookingStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const platformFeePercentage = 10; // 10%
  const taxPercentage = 5; // 5%

  // Generate time slots from 08:00 to 20:00
  const timeSlots = [];
  for (let i = 8; i <= 20; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
  }

  useEffect(() => {
    const fetchServiceAndReviews = async () => {
      try {
        const [serviceData, reviewsData] = await Promise.all([
          getServiceById(id),
          getServiceReviews(id)
        ]);
        setService(serviceData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to fetch service details or reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndReviews();
  }, [id]);

  if (loading) return <div className="page-container loading-text">Loading service details...</div>;
  if (!service) return <div className="page-container empty-state">Service not found.</div>;

  const serviceFee = service.price;
  const platformFee = (serviceFee * platformFeePercentage) / 100;
  const tax = (serviceFee * taxPercentage) / 100;
  const totalCost = serviceFee + platformFee + tax;
  const includedItems = service.includedItems || [];

  const handleBook = async () => {
    if (!date || !timeSlot) {
      setErrorMsg('Please select both date and time slot.');
      return;
    }

    setBookingStatus('loading');
    setErrorMsg('');

    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      await createBooking({
        serviceId: service._id,
        date,
        timeSlot,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to book service.');
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute of the date picker
  const today = new Date().toISOString().split('T')[0];

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

        {includedItems.length > 0 && (
          <div className="included-section">
            <h3 className="section-title">What Is Included</h3>
            <ul className="included-list">
              {includedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

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

          {bookingStatus === 'success' ? (
            <div className="booking-success-banner">
              <h4>✅ Booking Confirmed!</h4>
              <p>Your appointment has been successfully scheduled.</p>
              <Link to="/my-bookings" className="btn-secondary" style={{ marginTop: '10px', display: 'inline-block' }}>
                View My Bookings
              </Link>
            </div>
          ) : (
            <div className="booking-form-section">
              <h4 className="booking-form-title">Select Appointment Time</h4>
              
              {errorMsg && <div className="booking-error-msg">{errorMsg}</div>}
              
              <div className="booking-inputs">
                <div className="input-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="booking-input" 
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <select 
                    className="booking-input"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                className="btn-primary btn-book" 
                onClick={handleBook}
                disabled={bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-container">
        <h3 className="section-title">Customer Reviews</h3>
        
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="review-author">{review.customerName}</div>
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}{' '}
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                
                {review.reply && (
                  <div className="review-reply">
                    <span className="reply-label">Provider Reply:</span>
                    <p>{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
