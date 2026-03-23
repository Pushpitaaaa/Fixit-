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

module.exports = router;
