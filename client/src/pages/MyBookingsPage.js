import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerBookings, cancelBooking } from '../services/api';

// The 5 stages, in order — same as STATUS_PIPELINE on the server
const STAGES = [
  { key: 'pending',     label: 'Pending',      icon: '🕐' },
  { key: 'accepted',    label: 'Accepted',     icon: '✅' },
  { key: 'on_the_way',  label: 'On The Way',   icon: '🚗' },
  { key: 'in_progress', label: 'In Progress',  icon: '🔧' },
  { key: 'completed',   label: 'Completed',    icon: '🎉' },
];

// Returns how far along we are: 0 = pending, 4 = completed
function getStageIndex(status) {
  return STAGES.findIndex((s) => s.key === status);
}

// A single horizontal progress bar for one booking
function ProgressBar({ status }) {
  const activeIndex = getStageIndex(status);

  return (
    <div className="progress-track-wrap">
      {STAGES.map((stage, idx) => {
        const isDone    = idx < activeIndex;   // fully completed step
        const isActive  = idx === activeIndex; // current step (glowing)
        const isFuture  = idx > activeIndex;   // not yet reached

        return (
          <React.Fragment key={stage.key}>
            {/* Step circle */}
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

            {/* Connector line between steps (not after the last one) */}
            {idx < STAGES.length - 1 && (
              <div className={`progress-connector ${idx < activeIndex ? 'connector-done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cancelStatus, setCancelStatus] = useState({ id: null, status: 'idle', msg: '' });
  const navigate                  = useNavigate();

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

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelStatus({ id: bookingId, status: 'loading', msg: '' });
    
    try {
      await cancelBooking(bookingId);
      // Remove the cancelled booking from the list
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      setCancelStatus({ id: null, status: 'idle', msg: '' });
      alert('Booking cancelled successfully.');
    } catch (err) {
      setCancelStatus({ 
        id: bookingId, 
        status: 'error', 
        msg: err.response?.data?.message || 'Failed to cancel booking.' 
      });
    }
  };

  if (loading) return <div className="page-container loading-text">Loading your bookings...</div>;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '30px' }}>
        ← Back
      </button>

      <h1 className="page-title">📦 My Bookings</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px', marginTop: '-20px' }}>
        Track your service orders in real time
      </p>

      {bookings.length === 0 ? (
        <div className="empty-state">You have no bookings yet.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const stageIndex = getStageIndex(booking.status);
            const stageInfo  = STAGES[stageIndex];
            
            // Calculate if cancel is allowed (must be > 2 hours away, and not completed)
            const isCompleted = booking.status === 'completed';
            let isCancelable = false;
            
            if (!isCompleted && booking.date && booking.timeSlot) {
              const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
              const now = new Date();
              const diffHours = (appointmentTime - now) / (1000 * 60 * 60);
              isCancelable = diffHours > 2;
            }

            return (
              <div key={booking._id} className="booking-card">
                {/* Card header */}
                <div className="booking-card-header">
                  <div>
                    <h3 className="booking-service-title">{booking.service?.title}</h3>
                    <p className="booking-meta">
                      📅 {booking.date}  &nbsp;⏰ {booking.timeSlot}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="booking-amount">৳{booking.totalAmount?.toFixed(2)}</p>
                    <span className={`status-badge status-${booking.status}`}>
                      {stageInfo?.icon} {stageInfo?.label}
                    </span>
                  </div>
                </div>

                {/* The Uber-style progress bar */}
                <ProgressBar status={booking.status} />

                {/* Cancel Section */}
                <div className="booking-card-footer">
                  {cancelStatus.id === booking._id && cancelStatus.status === 'error' && (
                    <div className="cancel-error-msg">{cancelStatus.msg}</div>
                  )}
                  
                  {isCancelable ? (
                    <button 
                      className="btn-cancel" 
                      onClick={() => handleCancel(booking._id)}
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
                        ⚠️ Cannot cancel — appointment is within 2 hours or already completed.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
