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
};
