const db = require('../db');

const PROVIDER_ID = 'provider-1';

const mapServiceRow = (service) => ({
  _id: service.id,
  title: service.title,
  description: service.description,
  price: Number(service.price),
  category: service.category,
});

const mapReviewRow = (review) => ({
  _id: review.id,
  serviceId: review.serviceId,
  customerName: review.customerName,
  rating: Number(review.rating),
  comment: review.comment,
  reply: review.reply || '',
  date: review.date,
  ...(review.serviceTitle ? { serviceTitle: review.serviceTitle } : {}),
});

const mapBookingRow = (booking) => ({
  _id: booking.id,
  provider: booking.providerId,
  service: {
    _id: booking.serviceId,
    title: booking.serviceTitle || 'Service booking',
  },
  date: booking.date,
  timeSlot: booking.timeSlot,
  totalAmount: Number(booking.totalAmount),
  status: booking.status,
  customer: {
    name: booking.customerName || 'Customer',
    email: booking.customerEmail || 'customer@fixit.com',
    profilePic: '',
  },
});

const getBookingById = (bookingId) =>
  db
    .prepare(
      `SELECT b.*, s.title as serviceTitle
       FROM bookings b
       LEFT JOIN services s ON s.id = b.serviceId
       WHERE b.id = ?`
    )
    .get(bookingId);

const getBookings = (whereClause = '', params = []) =>
  db
    .prepare(
      `SELECT b.*, s.title as serviceTitle
       FROM bookings b
       LEFT JOIN services s ON s.id = b.serviceId
       ${whereClause}`
    )
    .all(...params);

const getDashboard = async (req, res) => {
  try {
    const provider = db.prepare('SELECT * FROM providers WHERE id = ?').get(PROVIDER_ID);
    const services = db.prepare('SELECT * FROM services WHERE providerId = ?').all(PROVIDER_ID);
    const uploads = db.prepare('SELECT url FROM uploads WHERE providerId = ?').all(PROVIDER_ID);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found. Please seed the database.' });
    }

    const enriched = {
      _id: provider.id,
      user: { id: 'provider-user-1', name: provider.name, email: provider.email, profilePic: provider.profilePic },
      services: services.map(mapServiceRow),
      isOpen: Boolean(provider.isOpen),
      portfolio: uploads.map(u => u.url),
      averageRating: Number(provider.averageRating || 0),
      totalJobs: Number(provider.totalJobs || 0),
    };

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleOpen = async (req, res) => {
  try {
    const provider = db.prepare('SELECT isOpen FROM providers WHERE id = ?').get(PROVIDER_ID);
    const next = provider ? (provider.isOpen ? 0 : 1) : 1;
    db.prepare('UPDATE providers SET isOpen = ? WHERE id = ?').run(next, PROVIDER_ID);
    return res.json({ isOpen: Boolean(next) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const id = `svc-${Date.now()}`;
    const stmt = db.prepare('INSERT INTO services (id, providerId, title, description, price, category) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, PROVIDER_ID, req.body.title, req.body.description, Number(req.body.price), req.body.category);
    const services = db.prepare('SELECT * FROM services WHERE providerId = ?').all(PROVIDER_ID);
    return res.json(services.map(mapServiceRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editService = async (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    db.prepare('UPDATE services SET title = ?, description = ?, price = ?, category = ? WHERE id = ?')
      .run(req.body.title, req.body.description, Number(req.body.price), req.body.category, req.params.serviceId);
    const services = db.prepare('SELECT * FROM services WHERE providerId = ?').all(PROVIDER_ID);
    return res.json(services.map(mapServiceRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.serviceId);
    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const pending = getBookings('WHERE b.status = ?', ['pending']);
    return res.json(pending.map(mapBookingRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const respondToBooking = async (req, res) => {
  try {
    const booking = getBookingById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const nextStatus = req.body.action === 'accept' ? 'accepted' : 'declined';
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(nextStatus, req.params.bookingId);
    const updated = getBookingById(req.params.bookingId);
    return res.json(mapBookingRow(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Status pipeline — the 5 stages in order
const STATUS_PIPELINE = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed'];

const updateBookingStatus = async (req, res) => {
  try {
    const booking = getBookingById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const currentIndex = STATUS_PIPELINE.indexOf(booking.status);
    if (currentIndex === -1 || currentIndex === STATUS_PIPELINE.length - 1) {
      return res.status(400).json({ message: 'Booking is already completed or has an invalid status.' });
    }
    const next = STATUS_PIPELINE[currentIndex + 1];
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(next, req.params.bookingId);
    const updated = getBookingById(req.params.bookingId);
    return res.json(mapBookingRow(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getActiveBookings = async (req, res) => {
  try {
    const bookings = getBookings();
    return res.json(bookings.map(mapBookingRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const period = req.query.period === 'daily' ? 'daily' : 'monthly';
    // Aggregate bookings by month or day
    const rows = db.prepare('SELECT date, totalAmount FROM bookings WHERE status = ?').all('completed');
    const map = {};
    rows.forEach(r => {
      const key = period === 'daily' ? r.date : r.date.slice(0,7);
      map[key] = (map[key] || 0) + r.totalAmount;
    });
    const result = Object.keys(map).sort().map(k => ({ label: k, amount: map[k] }));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadPortfolioPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const id = `up-${Date.now()}`;
    db.prepare('INSERT INTO uploads (id, providerId, url) VALUES (?, ?, ?)').run(id, PROVIDER_ID, url);
    const uploads = db.prepare('SELECT url FROM uploads WHERE providerId = ?').all(PROVIDER_ID);
    return res.json({ url, portfolio: uploads.map(u => u.url) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CUSTOMER FEATURES

const getAllServices = async (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    return res.json(services.map(mapServiceRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const filtered = db.prepare('SELECT * FROM services WHERE LOWER(category) = LOWER(?)').all(category);
    return res.json(filtered.map(mapServiceRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchServices = async (req, res) => {
  try {
    const keyword = `%${req.params.keyword}%`;
    const results = db.prepare('SELECT * FROM services WHERE LOWER(title) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)').all(keyword, keyword, keyword);
    return res.json(results.map(mapServiceRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json(mapServiceRow(service));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopProviders = async (req, res) => {
  try {
    const providers = db.prepare('SELECT * FROM providers ORDER BY averageRating DESC LIMIT 5').all();
    const mapped = providers.map((provider) => ({
      _id: provider.id,
      user: {
        id: 'provider-user-1',
        name: provider.name,
        email: provider.email,
        profilePic: provider.profilePic,
      },
      averageRating: Number(provider.averageRating || 0),
      totalJobs: Number(provider.totalJobs || 0),
      isOpen: Boolean(provider.isOpen),
    }));
    return res.json(mapped);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Create ────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, customerName } = req.body;
    if (!serviceId || !date || !timeSlot) return res.status(400).json({ message: 'serviceId, date, and timeSlot are required.' });
    const chosenDate = new Date(`${date}T${timeSlot}:00`);
    if (chosenDate <= new Date()) return res.status(400).json({ message: 'Cannot book a date/time in the past.' });
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    const platformFee = service.price * 0.10;
    const tax = service.price * 0.05;
    const totalAmount = parseFloat((service.price + platformFee + tax).toFixed(2));
    const id = `bk-${Date.now()}`;
    db.prepare('INSERT INTO bookings (id, providerId, serviceId, date, timeSlot, totalAmount, status, customerName, customerEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, PROVIDER_ID, service.id, date, timeSlot, totalAmount, 'pending', customerName || 'Customer', 'customer@fixit.com');
    const newBooking = getBookingById(id);
    return res.status(201).json(mapBookingRow(newBooking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Cancel (blocked if ≤ 2 hours before appointment) ─────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = getBookingById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const now = new Date();
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);
    if (diffHours <= 2) {
      return res.status(403).json({ message: `Cannot cancel — your appointment is in ${diffHours <= 0 ? 'less than 0' : diffHours.toFixed(1)} hours. Cancellations must be made at least 2 hours before the appointment.` });
    }
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.bookingId);
    return res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── REVIEWS & RATINGS ──────────────────────────────────────────────────────

const getServiceReviews = async (req, res) => {
  try {
    const serviceReviews = db.prepare('SELECT * FROM reviews WHERE serviceId = ?').all(req.params.id);
    return res.json(serviceReviews.map(mapReviewRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    const serviceId = req.params.id;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Valid rating between 1 and 5 is required.' });
    if (!comment) return res.status(400).json({ message: 'Comment is required.' });
    const id = `rev-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    db.prepare('INSERT INTO reviews (id, serviceId, customerName, rating, comment, reply, date) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, serviceId, customerName || 'Anonymous', Number(rating), comment, '', date);

    // update provider average
    const all = db.prepare('SELECT rating FROM reviews').all();
    const total = all.reduce((s, r) => s + r.rating, 0);
    const avg = total / all.length;
    db.prepare('UPDATE providers SET averageRating = ? WHERE id = ?').run(Number(avg.toFixed(1)), PROVIDER_ID);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    return res.status(201).json(mapReviewRow(newReview));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const rows = db.prepare('SELECT r.*, s.title as serviceTitle FROM reviews r LEFT JOIN services s ON r.serviceId = s.id').all();
    return res.json(rows.map(mapReviewRow));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (!req.body.reply) return res.status(400).json({ message: 'Reply text is required.' });
    db.prepare('UPDATE reviews SET reply = ? WHERE id = ?').run(req.body.reply, req.params.reviewId);
    const updated = db.prepare('SELECT r.*, s.title as serviceTitle FROM reviews r LEFT JOIN services s ON r.serviceId = s.id WHERE r.id = ?').get(req.params.reviewId);
    return res.json(mapReviewRow(updated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  toggleOpen,
  addService,
  editService,
  deleteService,
  getPendingRequests,
  respondToBooking,
  getEarnings,
  uploadPortfolioPhoto,
  getAllServices,
  getServicesByCategory,
  searchServices,
  getServiceById,
  getTopProviders,
  updateBookingStatus,
  getActiveBookings,
  createBooking,
  cancelBooking,
  getServiceReviews,
  addReview,
  getProviderReviews,
  replyToReview,
};
