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
      icon: '📺',
      includedItems: [
        'Basic diagnosis',
        'Filter cleaning',
        'Cooling check',
      ],
    },
    {
      _id: 'svc-2',
      title: 'Deep Cleaning',
      description: 'Home deep cleaning with professional tools',
      price: 800,
      category: 'Cleaning',
      icon: '🧹',
      includedItems: [
        'Floor and surface cleaning',
        'Kitchen grease removal',
        'Bathroom sanitization',
      ],
    },
    {
      _id: 'svc-3',
      title: 'Electrical Wiring',
      description: 'Safe electrical wiring and socket setup',
      price: 950,
      category: 'Electrical',
      icon: '⚡',
      includedItems: [
        'Wiring safety inspection',
        'Socket and switch testing',
        'Minor connection repair',
      ],
    },
    {
      _id: 'svc-4',
      title: 'Pipe Leakage Fix',
      description: 'Plumbing services for pipe leakage and water issues',
      price: 600,
      category: 'Plumbing',
      icon: '🚰',
      includedItems: [
        'Leak source detection',
        'Pipe joint tightening',
        'Water flow check',
      ],
    },
    {
      _id: 'svc-5',
      title: 'General Home Repair',
      description: 'Handyman services for general home maintenance tasks',
      price: 1000,
      category: 'Home Maintenance',
      icon: '🛠️',
      includedItems: [
        'Basic damage inspection',
        'Small fixture repair',
        'Tool and labor support',
      ],
    },
    {
      _id: 'svc-6',
      title: 'Math Tutoring',
      description: 'Expert tutoring for high school and college math',
      price: 1500,
      category: 'Tutoring',
      icon: '📚',
      includedItems: [
        'Concept review',
        'Practice problem solving',
        'Homework guidance',
      ],
    },
    {
      _id: 'svc-7',
      title: 'PC & Network Setup',
      description: 'Tech support for home and office networks and PCs',
      price: 1200,
      category: 'Tech Support',
      icon: '💻',
      includedItems: [
        'Device setup check',
        'Wi-Fi configuration',
        'Basic software troubleshooting',
      ],
    },
    {
      _id: 'svc-8',
      title: 'Bed Bug Extermination',
      description: 'Professional pest control and extermination',
      price: 2000,
      category: 'Pest Control',
      icon: '🐛',
      includedItems: [
        'Infestation inspection',
        'Targeted spray treatment',
        'Prevention advice',
      ],
    },
    {
      _id: 'svc-9',
      title: 'Home Shifting Services',
      description: 'Reliable moving and shifting services with transport',
      price: 3500,
      category: 'Shifting',
      icon: '🚚',
      includedItems: [
        'Item loading support',
        'Transport arrangement',
        'Basic unloading help',
      ],
    },
  ],
  isOpen: true,
  isVerified: true,
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
  {
    _id: 'abk-4',
    provider: 'provider-1',
    service: { title: 'Pipe Leakage Fix', _id: 'svc-4' },
    date: '2026-04-28',
    timeSlot: '11:00',
    totalAmount: 690,
    status: 'completed',
    customer: {
      name: 'Ayesha Rahman',
      email: 'ayesha@test.com',
      profilePic: '',
    },
  },
  {
    _id: 'abk-5',
    provider: 'provider-1',
    service: { title: 'Deep Cleaning', _id: 'svc-2' },
    date: '2026-05-02',
    timeSlot: '16:00',
    totalAmount: 920,
    status: 'completed',
    customer: {
      name: 'Demo Customer',
      email: 'customer@fixit.com',
      profilePic: '',
    },
  },
  {
    _id: 'abk-6',
    provider: 'provider-1',
    service: { title: 'PC & Network Setup', _id: 'svc-7' },
    date: '2026-05-08',
    timeSlot: '18:00',
    totalAmount: 1380,
    status: 'in_progress',
    customer: {
      name: 'Demo Customer',
      email: 'customer@fixit.com',
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
<<<<<<< HEAD
    providerData.isOpen = !providerData.isOpen;
    return res.json({ isOpen: providerData.isOpen });
=======
    const provider = db.prepare('SELECT isOpen FROM providers WHERE id = ?').get(PROVIDER_ID);
    const next = provider ? (provider.isOpen ? 0 : 1) : 1;
    db.prepare('UPDATE providers SET isOpen = ? WHERE id = ?').run(next, PROVIDER_ID);
    return res.json({ isOpen: Boolean(next) });
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
<<<<<<< HEAD
    const includedItems = Array.isArray(req.body.includedItems)
      ? req.body.includedItems
      : String(req.body.includedItems || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);

    const service = {
      _id: `svc-${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      includedItems,
    };
    providerData.services.push(service);
    return res.json(providerData.services);
=======
    const id = `svc-${Date.now()}`;
    const stmt = db.prepare('INSERT INTO services (id, providerId, title, description, price, category) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, PROVIDER_ID, req.body.title, req.body.description, Number(req.body.price), req.body.category);
    const services = db.prepare('SELECT * FROM services WHERE providerId = ?').all(PROVIDER_ID);
    return res.json(services.map(mapServiceRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editService = async (req, res) => {
  try {
<<<<<<< HEAD
    const service = providerData.services.find((item) => item._id === req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = req.body.title;
    service.description = req.body.description;
    service.price = Number(req.body.price);
    service.category = req.body.category;
    service.includedItems = Array.isArray(req.body.includedItems)
      ? req.body.includedItems
      : String(req.body.includedItems || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);

    return res.json(providerData.services);
=======
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    db.prepare('UPDATE services SET title = ?, description = ?, price = ?, category = ? WHERE id = ?')
      .run(req.body.title, req.body.description, Number(req.body.price), req.body.category, req.params.serviceId);
    const services = db.prepare('SELECT * FROM services WHERE providerId = ?').all(PROVIDER_ID);
    return res.json(services.map(mapServiceRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
<<<<<<< HEAD
    providerData.services = providerData.services.filter(
      (service) => service._id !== req.params.serviceId
    );

=======
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.serviceId);
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
<<<<<<< HEAD
    return res.json(pendingBookings);
=======
    const pending = getBookings('WHERE b.status = ?', ['pending']);
    return res.json(pending.map(mapBookingRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const respondToBooking = async (req, res) => {
  try {
<<<<<<< HEAD
    const booking = pendingBookings.find((item) => item._id === req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.action === 'accept' ? 'accepted' : 'declined';
    pendingBookings = pendingBookings.filter((item) => item._id !== booking._id);
    return res.json(booking);
=======
    const booking = getBookingById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const nextStatus = req.body.action === 'accept' ? 'accepted' : 'declined';
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(nextStatus, req.params.bookingId);
    const updated = getBookingById(req.params.bookingId);
    return res.json(mapBookingRow(updated));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Status pipeline — the 5 stages in order
const STATUS_PIPELINE = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed'];

const updateBookingStatus = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getActiveBookings = async (req, res) => {
  try {
<<<<<<< HEAD
    const bookingsWithReviews = activeBookings.map((booking) => ({
      ...booking,
      customerReview: reviews.find((review) => review.bookingId === booking._id) || null,
    }));

    return res.json(bookingsWithReviews);
=======
    const bookings = getBookings();
    return res.json(bookings.map(mapBookingRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const period = req.query.period === 'daily' ? 'daily' : 'monthly';
<<<<<<< HEAD
    return res.json(period === 'daily' ? dailyEarnings : monthlyEarnings);
=======
    // Aggregate bookings by month or day
    const rows = db.prepare('SELECT date, totalAmount FROM bookings WHERE status = ?').all('completed');
    const map = {};
    rows.forEach(r => {
      const key = period === 'daily' ? r.date : r.date.slice(0,7);
      map[key] = (map[key] || 0) + r.totalAmount;
    });
    const result = Object.keys(map).sort().map(k => ({ label: k, amount: map[k] }));
    return res.json(result);
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadPortfolioPhoto = async (req, res) => {
  try {
<<<<<<< HEAD
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;
    providerData.portfolio.push(url);

    return res.json({ url, portfolio: providerData.portfolio });
=======
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const id = `up-${Date.now()}`;
    db.prepare('INSERT INTO uploads (id, providerId, url) VALUES (?, ?, ?)').run(id, PROVIDER_ID, url);
    const uploads = db.prepare('SELECT url FROM uploads WHERE providerId = ?').all(PROVIDER_ID);
    return res.json({ url, portfolio: uploads.map(u => u.url) });
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CUSTOMER FEATURES

const getAllServices = async (req, res) => {
  try {
<<<<<<< HEAD
    return res.json(providerData.services);
=======
    const services = db.prepare('SELECT * FROM services').all();
    return res.json(services.map(mapServiceRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
<<<<<<< HEAD
    const category = req.params.category.toLowerCase();

    const filtered = providerData.services.filter(
      (s) => s.category.toLowerCase() === category
    );

    return res.json(filtered);
=======
    const category = req.params.category;
    const filtered = db.prepare('SELECT * FROM services WHERE LOWER(category) = LOWER(?)').all(category);
    return res.json(filtered.map(mapServiceRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchServices = async (req, res) => {
  try {
<<<<<<< HEAD
    const keyword = req.params.keyword.toLowerCase();

    const results = providerData.services.filter(
      (s) =>
        s.title.toLowerCase().includes(keyword) ||
        s.category.toLowerCase().includes(keyword) ||
        s.description.toLowerCase().includes(keyword)
    );

    return res.json(results);
=======
    const keyword = `%${req.params.keyword}%`;
    const results = db.prepare('SELECT * FROM services WHERE LOWER(title) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)').all(keyword, keyword, keyword);
    return res.json(results.map(mapServiceRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
<<<<<<< HEAD
    const service = providerData.services.find((s) => s._id === req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json(service);
=======
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json(mapServiceRow(service));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopProviders = async (req, res) => {
  try {
<<<<<<< HEAD
    return res.json([providerData]);
=======
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
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Create ────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, customerName } = req.body;
<<<<<<< HEAD

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
=======
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
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── BOOKING: Cancel (blocked if ≤ 2 hours before appointment) ─────────────
const cancelBooking = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const booking = getBookingById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const now = new Date();
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);
    if (diffHours <= 2) {
      return res.status(403).json({ message: `Cannot cancel — your appointment is in ${diffHours <= 0 ? 'less than 0' : diffHours.toFixed(1)} hours. Cancellations must be made at least 2 hours before the appointment.` });
    }
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.bookingId);
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
    return res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── REVIEWS & RATINGS ──────────────────────────────────────────────────────

const getServiceReviews = async (req, res) => {
  try {
<<<<<<< HEAD
    const serviceReviews = reviews.filter((r) => r.serviceId === req.params.id);
    return res.json(serviceReviews);
=======
    const serviceReviews = db.prepare('SELECT * FROM reviews WHERE serviceId = ?').all(req.params.id);
    return res.json(serviceReviews.map(mapReviewRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
<<<<<<< HEAD
    const { bookingId, customerName, rating, comment } = req.body;
    const serviceId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating between 1 and 5 is required.' });
    }
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required.' });
    }

    if (bookingId) {
      const booking = activeBookings.find((item) => item._id === bookingId);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }

      if (booking.status !== 'completed') {
        return res.status(400).json({ message: 'Only completed orders can be reviewed.' });
      }

      if (booking.service?._id !== serviceId) {
        return res.status(400).json({ message: 'Review service does not match this booking.' });
      }

      if (reviews.some((review) => review.bookingId === bookingId)) {
        return res.status(400).json({ message: 'This order has already been reviewed.' });
      }
    }

    const newReview = {
      _id: `rev-${Date.now()}`,
      serviceId,
      bookingId: bookingId || null,
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
=======
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
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
<<<<<<< HEAD
    // In this mock, all reviews belong to this single provider's services
    // To provide context in the dashboard, we'll attach the service title
    const enrichedReviews = reviews.map(r => {
      const service = providerData.services.find(s => s._id === r.serviceId);
      return { ...r, serviceTitle: service ? service.title : 'Unknown Service' };
    });
    
    return res.json(enrichedReviews);
=======
    const rows = db.prepare('SELECT r.*, s.title as serviceTitle FROM reviews r LEFT JOIN services s ON r.serviceId = s.id').all();
    return res.json(rows.map(mapReviewRow));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
<<<<<<< HEAD
    const review = reviews.find((r) => r._id === req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (!req.body.reply) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    review.reply = req.body.reply;
    return res.json(review);
=======
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (!req.body.reply) return res.status(400).json({ message: 'Reply text is required.' });
    db.prepare('UPDATE reviews SET reply = ? WHERE id = ?').run(req.body.reply, req.params.reviewId);
    const updated = db.prepare('SELECT r.*, s.title as serviceTitle FROM reviews r LEFT JOIN services s ON r.serviceId = s.id WHERE r.id = ?').get(req.params.reviewId);
    return res.json(mapReviewRow(updated));
>>>>>>> 6ee2646d78abcef02e56421ba6e98a2d854f03ef
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
