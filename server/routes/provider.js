const express = require('express');
const {
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
} = require('../controllers/providerController');
const { protect, providerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/dashboard', protect, providerOnly, getDashboard);
router.put('/toggle-open', protect, providerOnly, toggleOpen);
router.post('/services', protect, providerOnly, addService);
router.put('/services/:serviceId', protect, providerOnly, editService);
router.delete('/services/:serviceId', protect, providerOnly, deleteService);
router.get('/pending', protect, providerOnly, getPendingRequests);
router.put('/bookings/:bookingId/respond', protect, providerOnly, respondToBooking);
router.get('/earnings', protect, providerOnly, getEarnings);
router.post('/portfolio', protect, providerOnly, upload.single('photo'), uploadPortfolioPhoto);
// Provider: advance a booking's status to the next stage
router.put('/bookings/:bookingId/status', protect, providerOnly, updateBookingStatus);

// public customer routes
router.get('/public/services', getAllServices);
router.get('/public/services/category/:category', getServicesByCategory);
router.get('/public/services/search/:keyword', searchServices);
router.get('/public/services/:id', getServiceById);
router.get('/public/top-providers', getTopProviders);
// Customer: read all bookings (for the tracking page)
router.get('/public/bookings', getActiveBookings);

module.exports = router;