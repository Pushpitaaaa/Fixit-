import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerBookings, cancelBooking, addServiceReview } from '../services/api';
import { jsPDF } from 'jspdf';

const STAGES = [
  { key: 'pending', label: 'Pending', icon: '🕐' },
  { key: 'accepted', label: 'Accepted', icon: '✅' },
  { key: 'on_the_way', label: 'On The Way', icon: '🚗' },
  { key: 'in_progress', label: 'In Progress', icon: '🔧' },
  { key: 'completed', label: 'Completed', icon: '🎉' },
];

function getStageIndex(status) {
  return Math.max(STAGES.findIndex((s) => s.key === status), 0);
}

function formatMoney(amount) {
  return `৳${Number(amount || 0).toFixed(2)}`;
}

function ProgressBar({ status }) {
  const activeIndex = getStageIndex(status);

  return (
    <div className="progress-track-wrap">
      {STAGES.map((stage, idx) => {
        const isDone = idx < activeIndex;
        const isActive = idx === activeIndex;
        const isFuture = idx > activeIndex;

        return (
          <React.Fragment key={stage.key}>
            <div className="progress-step">
              <div
                className={`progress-circle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isFuture ? 'future' : ''}`}
              >
                {isDone ? '✓' : stage.icon}
                {isActive && <span className="progress-pulse" />}
              </div>
              <span className={`progress-label ${isActive ? 'label-active' : ''} ${isDone ? 'label-done' : ''}`}>
                {stage.label}
              </span>
            </div>

            {idx < STAGES.length - 1 && (
              <div className={`progress-connector ${idx < activeIndex ? 'connector-done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function OrderInvoice({ booking, onDownload }) {
  const serviceFee = Number(booking.totalAmount || 0) / 1.15;
  const platformFee = serviceFee * 0.10;
  const tax = serviceFee * 0.05;

  return (
    <div className="invoice-preview">
      <div className="invoice-preview-header">
        <div>
          <span className="invoice-label">Invoice</span>
          <h4>#{booking._id}</h4>
        </div>
        <button className="btn-primary invoice-download-btn" onClick={() => onDownload(booking)}>
          Download PDF
        </button>
      </div>

      <div className="invoice-grid">
        <span>Customer</span>
        <strong>{booking.customer?.name || 'Demo Customer'}</strong>
        <span>Service</span>
        <strong>{booking.service?.title || 'Service booking'}</strong>
        <span>Appointment</span>
        <strong>{booking.date} at {booking.timeSlot}</strong>
        <span>Service fee</span>
        <strong>{formatMoney(serviceFee)}</strong>
        <span>Platform fee</span>
        <strong>{formatMoney(platformFee)}</strong>
        <span>Tax</span>
        <strong>{formatMoney(tax)}</strong>
      </div>

      <div className="invoice-total-row">
        <span>Total paid</span>
        <strong>{formatMoney(booking.totalAmount)}</strong>
      </div>
    </div>
  );
}

function OrderReviewForm({ booking, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const serviceId = booking.service?._id;
  const existingReview = booking.customerReview;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!serviceId || !comment.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const review = await addServiceReview(serviceId, {
        bookingId: booking._id,
        customerName: booking.customer?.name || 'Demo Customer',
        rating,
        comment: comment.trim(),
      });

      setStatus('success');
      setComment('');
      setRating(5);
      onReviewSubmitted(booking._id, review);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (existingReview) {
    return (
      <div className="order-review-box">
        <div className="order-review-header">
          <strong>Your Review</strong>
          <span className="review-rating">{'⭐'.repeat(existingReview.rating)}</span>
        </div>
        <p className="review-comment">{existingReview.comment}</p>
      </div>
    );
  }

  return (
    <div className="order-review-box">
      <h4>Leave a Review</h4>
      {!serviceId ? (
        <p className="cancel-warning-text">Review is unavailable for this order.</p>
      ) : (
        <form onSubmit={handleSubmit} className="add-review-form">
          <div className="review-form-group">
            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
              className="review-textarea"
              rows="3"
            />
          </div>

          {status === 'error' && <div className="cancel-error-msg">{message}</div>}

          <button
            type="submit"
            className="btn-primary btn-submit-review"
            disabled={status === 'loading' || !comment.trim()}
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}

function OrderCard({ booking, cancelStatus, onCancel, onDownloadInvoice, onReviewSubmitted }) {
  const stageIndex = getStageIndex(booking.status);
  const stageInfo = STAGES[stageIndex];
  const isCompleted = booking.status === 'completed';
  let isCancelable = false;

  if (!isCompleted && booking.date && booking.timeSlot) {
    const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const diffHours = (appointmentTime - new Date()) / (1000 * 60 * 60);
    isCancelable = diffHours > 2;
  }

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div>
          <p className="booking-customer-name">{booking.customer?.name || 'Demo Customer'}</p>
          <h3 className="booking-service-title">{booking.service?.title || 'Service booking'}</h3>
          <p className="booking-meta">
            📅 {booking.date} &nbsp;⏰ {booking.timeSlot}
          </p>
        </div>
        <div className="booking-header-right">
          <p className="booking-amount">{formatMoney(booking.totalAmount)}</p>
          <span className={`status-badge status-${booking.status}`}>
            {stageInfo?.icon} {stageInfo?.label}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <>
          <OrderInvoice booking={booking} onDownload={onDownloadInvoice} />
          <OrderReviewForm booking={booking} onReviewSubmitted={onReviewSubmitted} />
        </>
      ) : (
        <ProgressBar status={booking.status} />
      )}

      {!isCompleted && (
        <div className="booking-card-footer">
          {cancelStatus.id === booking._id && cancelStatus.status === 'error' && (
            <div className="cancel-error-msg">{cancelStatus.msg}</div>
          )}

          {isCancelable ? (
            <button
              className="btn-cancel"
              onClick={() => onCancel(booking._id)}
              disabled={cancelStatus.id === booking._id && cancelStatus.status === 'loading'}
            >
              {cancelStatus.id === booking._id && cancelStatus.status === 'loading'
                ? 'Cancelling...'
                : 'Cancel Booking'}
            </button>
          ) : (
            <div className="cancel-disabled-info">
              <button className="btn-cancel disabled" disabled>
                Cancel Booking
              </button>
              <span className="cancel-warning-text">
                ⚠️ Cannot cancel within 2 hours.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ongoing');
  const [cancelStatus, setCancelStatus] = useState({ id: null, status: 'idle', msg: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCustomerBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ongoingOrders = useMemo(
    () => bookings.filter((booking) => booking.status !== 'completed'),
    [bookings]
  );

  const previousOrders = useMemo(
    () => bookings.filter((booking) => booking.status === 'completed'),
    [bookings]
  );

  const visibleOrders = activeTab === 'ongoing' ? ongoingOrders : previousOrders;
  const totalSpent = previousOrders.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  const customerName = bookings.find((booking) => booking.customer?.name)?.customer?.name || 'Demo Customer';

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelStatus({ id: bookingId, status: 'loading', msg: '' });

    try {
      await cancelBooking(bookingId);
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      setCancelStatus({ id: null, status: 'idle', msg: '' });
      alert('Booking cancelled successfully.');
    } catch (err) {
      setCancelStatus({
        id: bookingId,
        status: 'error',
        msg: err.response?.data?.message || 'Failed to cancel booking.',
      });
    }
  };

  const handleDownloadInvoice = (booking) => {
    const serviceFee = Number(booking.totalAmount || 0) / 1.15;
    const platformFee = serviceFee * 0.10;
    const tax = serviceFee * 0.05;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('FixIt Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${booking._id}`, 20, 40);
    doc.text(`Customer: ${booking.customer?.name || 'Demo Customer'}`, 20, 50);
    doc.text(`Service: ${booking.service?.title || 'Service booking'}`, 20, 60);
    doc.text(`Appointment: ${booking.date} at ${booking.timeSlot}`, 20, 70);
    doc.text(`Status: ${booking.status}`, 20, 80);
    doc.line(20, 90, 190, 90);
    doc.text(`Service Fee: ${formatMoney(serviceFee)}`, 20, 105);
    doc.text(`Platform Fee: ${formatMoney(platformFee)}`, 20, 115);
    doc.text(`Tax: ${formatMoney(tax)}`, 20, 125);
    doc.setFontSize(14);
    doc.text(`Total Paid: ${formatMoney(booking.totalAmount)}`, 20, 145);

    doc.save(`FixIt_Invoice_${booking._id}.pdf`);
  };

  const handleReviewSubmitted = (bookingId, review) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === bookingId
          ? { ...booking, customerReview: review }
          : booking
      )
    );
    alert('Review submitted successfully!');
  };

  if (loading) return <div className="page-container loading-text">Loading your orders...</div>;

  return (
    <div className="page-container customer-orders-page">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '30px' }}>
        ← Back
      </button>

      <div className="customer-dashboard-header">
        <div>
          <span className="dashboard-eyebrow">Customer Dashboard</span>
          <h1>View Orders</h1>
          <p>{customerName}</p>
        </div>
        <div className="customer-order-stats">
          <div>
            <span>Ongoing</span>
            <strong>{ongoingOrders.length}</strong>
          </div>
          <div>
            <span>Previous</span>
            <strong>{previousOrders.length}</strong>
          </div>
          <div>
            <span>Total Paid</span>
            <strong>{formatMoney(totalSpent)}</strong>
          </div>
        </div>
      </div>

      <div className="order-tabs">
        <button
          className={activeTab === 'ongoing' ? 'order-tab active' : 'order-tab'}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing Orders ({ongoingOrders.length})
        </button>
        <button
          className={activeTab === 'previous' ? 'order-tab active' : 'order-tab'}
          onClick={() => setActiveTab('previous')}
        >
          Previous Orders ({previousOrders.length})
        </button>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="empty-state">
          {activeTab === 'ongoing'
            ? 'You have no ongoing orders right now.'
            : 'You have no previous orders yet.'}
        </div>
      ) : (
        <div className="bookings-list">
          {visibleOrders.map((booking) => (
            <OrderCard
              key={booking._id}
              booking={booking}
              cancelStatus={cancelStatus}
              onCancel={handleCancel}
              onDownloadInvoice={handleDownloadInvoice}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
