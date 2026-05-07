const providerData = {
  _id: 'provider-1',
  user: {
    id: 'provider-user-1',
    name: 'Mahadi Provider',
    email: 'mahadi@test.com',
    profilePic: '',
  },
  services: [
    {
      _id: 'svc-1',
      title: 'AC Repair',
      description: 'AC installation and repair service',
      price: 1200,
      category: 'Appliance',
    },
    {
      _id: 'svc-2',
      title: 'Deep Cleaning',
      description: 'Home deep cleaning with professional tools',
      price: 800,
      category: 'Cleaning',
    },
    {
      _id: 'svc-3',
      title: 'Electrical Wiring',
      description: 'Safe electrical wiring and socket setup',
      price: 950,
      category: 'Electrical',
    },
  ],
  isOpen: true,
  portfolio: [],
  averageRating: 4.5,
  totalJobs: 23,
};

let pendingBookings = [
  {
    _id: 'bk-1',
    provider: 'provider-1',
    service: { title: 'AC Repair' },
    date: '2026-04-15',
    timeSlot: '10:00',
    totalAmount: 920,
    status: 'pending',
    customer: {
      name: 'Test Customer',
      email: 'customer@test.com',
      profilePic: '',
    },
  },
  {
    _id: 'bk-2',
    provider: 'provider-1',
    service: { title: 'Deep Cleaning' },
    date: '2026-04-16',
    timeSlot: '14:00',
    totalAmount: 1100,
    status: 'pending',
    customer: {
      name: 'Test Customer 2',
      email: 'customer2@test.com',
      profilePic: '',
    },
  },
  {
    _id: 'bk-3',
    provider: 'provider-1',
    service: { title: 'Electrical Wiring' },
    date: '2026-04-17',
    timeSlot: '17:00',
    totalAmount: 1300,
    status: 'pending',
    customer: {
      name: 'Test Customer 3',
      email: 'customer3@test.com',
      profilePic: '',
    },
  },
];

// All bookings (including active ones with progress statuses)
let activeBookings = [
  {
    _id: 'abk-1',
    provider: 'provider-1',
    service: { title: 'AC Repair', _id: 'svc-1' },
    date: '2026-05-08',
    timeSlot: '10:00',
    totalAmount: 1380,
    status: 'pending',
    customer: {
      name: 'Rahim Uddin',
      email: 'rahim@test.com',
      profilePic: '',
    },
  },
  {
    _id: 'abk-2',
    provider: 'provider-1',
    service: { title: 'Deep Cleaning', _id: 'svc-2' },
    date: '2026-05-09',
    timeSlot: '14:00',
    totalAmount: 920,
    status: 'accepted',
    customer: {
      name: 'Karim Hossain',
      email: 'karim@test.com',
      profilePic: '',
    },
  },
  {
    _id: 'abk-3',
    provider: 'provider-1',
    service: { title: 'Electrical Wiring', _id: 'svc-3' },
    date: '2026-05-10',
    timeSlot: '09:00',
    totalAmount: 1092,
    status: 'on_the_way',
    customer: {
      name: 'Nasrin Akter',
      email: 'nasrin@test.com',
      profilePic: '',
    },
  },
];

// Reviews and Ratings
let reviews = [
  {
    _id: 'rev-1',
    serviceId: 'svc-1',
    customerName: 'Alice Smith',
    rating: 5,
    comment: 'Excellent AC repair! The technician was very polite and fixed the issue quickly.',
    reply: 'Thank you Alice! We are glad you liked our service.',
    date: '2026-05-01',
  },
  {
    _id: 'rev-2',
    serviceId: 'svc-1',
    customerName: 'Bob Johnson',
    rating: 4,
    comment: 'Good service, but arrived 10 minutes late.',
    reply: '',
    date: '2026-05-03',
  }
];

const monthlyEarnings = [
  { label: '2026-01', amount: 2000 },
  { label: '2026-02', amount: 1400 },
  { label: '2026-03', amount: 1500 },
];

const dailyEarnings = [
  { label: '2026-03-01', amount: 500 },
  { label: '2026-03-04', amount: 700 },
  { label: '2026-03-12', amount: 300 },
];

const getDashboard = async (req, res) => {
  try {
    return res.json(providerData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleOpen = async (req, res) => {
  try {
    providerData.isOpen = !providerData.isOpen;
    return res.json({ isOpen: providerData.isOpen });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const service = {
      _id: `svc-${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    };
    providerData.services.push(service);
    return res.json(providerData.services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editService = async (req, res) => {
  try {
    const service = providerData.services.find((item) => item._id === req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = req.body.title;
    service.description = req.body.description;
    service.price = Number(req.body.price);
    service.category = req.body.category;

    return res.json(providerData.services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    providerData.services = providerData.services.filter(
      (service) => service._id !== req.params.serviceId
    );

    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    return res.json(pendingBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const respondToBooking = async (req, res) => {
  try {
    const booking = pendingBookings.find((item) => item._id === req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.action === 'accept' ? 'accepted' : 'declined';
    pendingBookings = pendingBookings.filter((item) => item._id !== booking._id);
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Status pipeline — the 5 stages in order
const STATUS_PIPELINE = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed'];

const updateBookingStatus = async (req, res) => {
  try {
    const booking = activeBookings.find((item) => item._id === req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentIndex = STATUS_PIPELINE.indexOf(booking.status);

    if (currentIndex === -1 || currentIndex === STATUS_PIPELINE.length - 1) {
      return res.status(400).json({ message: 'Booking is already completed or has an invalid status.' });
    }

    booking.status = STATUS_PIPELINE[currentIndex + 1];
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getActiveBookings = async (req, res) => {
  try {
    return res.json(activeBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const period = req.query.period === 'daily' ? 'daily' : 'monthly';
    return res.json(period === 'daily' ? dailyEarnings : monthlyEarnings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadPortfolioPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;
    providerData.portfolio.push(url);

    return res.json({ url, portfolio: providerData.portfolio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CUSTOMER FEATURES

const getAllServices = async (req, res) => {
  try {
    return res.json(providerData.services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();

    const filtered = providerData.services.filter(
      (s) => s.category.toLowerCase() === category
    );

    return res.json(filtered);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchServices = async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();

    const results = providerData.services.filter(
      (s) =>
        s.title.toLowerCase().includes(keyword) ||
        s.category.toLowerCase().includes(keyword) ||
        s.description.toLowerCase().includes(keyword)
    );

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = providerData.services.find((s) => s._id === req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopProviders = async (req, res) => {
  try {
    return res.json([providerData]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Create ────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, customerName } = req.body;

    // Validate required fields
    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ message: 'serviceId, date, and timeSlot are required.' });
    }

    // Ensure date is not in the past
    const chosenDate = new Date(`${date}T${timeSlot}:00`);
    if (chosenDate <= new Date()) {
      return res.status(400).json({ message: 'Cannot book a date/time in the past.' });
    }

    // Find the service
    const service = providerData.services.find((s) => s._id === serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Calculate total (same formula as the frontend display)
    const platformFee = service.price * 0.10;
    const tax         = service.price * 0.05;
    const totalAmount = service.price + platformFee + tax;

    const newBooking = {
      _id:         `bk-${Date.now()}`,
      provider:    'provider-1',
      service:     { title: service.title, _id: service._id },
      date,
      timeSlot,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status:      'pending',
      customer: {
        name:       customerName || 'Customer',
        email:      'customer@fixit.com',
        profilePic: '',
      },
    };

    activeBookings.push(newBooking);
    return res.status(201).json(newBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Cancel (blocked if ≤ 2 hours before appointment) ─────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = activeBookings.find((b) => b._id === req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Build the appointment DateTime from stored date + timeSlot strings
    const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const now             = new Date();
    const diffMs          = appointmentTime - now;
    const diffHours       = diffMs / (1000 * 60 * 60);

    // BLOCK if within 2 hours
    if (diffHours <= 2) {
      return res.status(403).json({
        message: `Cannot cancel — your appointment is in ${diffHours <= 0 ? 'less than 0' : diffHours.toFixed(1)} hours. Cancellations must be made at least 2 hours before the appointment.`,
      });
    }

    // Remove the booking
    activeBookings = activeBookings.filter((b) => b._id !== req.params.bookingId);
    return res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── REVIEWS & RATINGS ──────────────────────────────────────────────────────

const getServiceReviews = async (req, res) => {
  try {
    const serviceReviews = reviews.filter((r) => r.serviceId === req.params.id);
    return res.json(serviceReviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    const serviceId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating between 1 and 5 is required.' });
    }
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required.' });
    }

    const newReview = {
      _id: `rev-${Date.now()}`,
      serviceId,
      customerName: customerName || 'Anonymous',
      rating: Number(rating),
      comment,
      reply: '',
      date: new Date().toISOString().split('T')[0],
    };

    reviews.push(newReview);

    // Recalculate average rating for the provider
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    providerData.averageRating = Number((totalRating / reviews.length).toFixed(1));

    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    // In this mock, all reviews belong to this single provider's services
    // To provide context in the dashboard, we'll attach the service title
    const enrichedReviews = reviews.map(r => {
      const service = providerData.services.find(s => s._id === r.serviceId);
      return { ...r, serviceTitle: service ? service.title : 'Unknown Service' };
    });
    
    return res.json(enrichedReviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const review = reviews.find((r) => r._id === req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (!req.body.reply) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    review.reply = req.body.reply;
    return res.json(review);
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