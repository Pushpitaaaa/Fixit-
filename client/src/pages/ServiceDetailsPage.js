import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, createBooking, getServiceReviews, addServiceReview } from '../services/api';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Booking form state
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookingStatus, setBookingStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

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

  const handleBook = async () => {
    if (!date || !timeSlot) {
      setErrorMsg('Please select both date and time slot.');
      return;
    }

    setBookingStatus('loading');
    setErrorMsg('');

    try {
      await createBooking({
        serviceId: service._id,
        date,
        timeSlot,
        customerName: 'Demo Customer', // Hardcoded for demo purposes
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to book service.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    setReviewSubmitting(true);
    try {
      const newReview = await addServiceReview(id, {
        customerName: 'Demo Customer',
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews([...reviews, newReview]);
      setReviewComment('');
      setReviewRating(5);
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
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

        <div className="add-review-section">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmitReview} className="add-review-form">
            <div className="review-form-group">
              <label>Rating</label>
              <select 
                value={reviewRating} 
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="review-input"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
                <option value="2">⭐⭐ (2/5)</option>
                <option value="1">⭐ (1/5)</option>
              </select>
            </div>
            
            <div className="review-form-group">
              <label>Comment</label>
              <textarea 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                required
                className="review-textarea"
                rows="4"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary btn-submit-review"
              disabled={reviewSubmitting || !reviewComment.trim()}
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
