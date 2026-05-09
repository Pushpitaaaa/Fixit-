const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Upload = require('../models/Upload');

const STATUS_PIPELINE = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed'];

function toId(value) {
  return value ? String(value) : '';
}

function formatUser(user) {
  if (!user) {
    return { id: '', name: '', email: '', profilePic: '' };
  }

  return {
    id: toId(user._id),
    name: user.name || '',
    email: user.email || '',
    profilePic: user.profilePic || '',
  };
}

function formatService(service) {
  return {
    _id: toId(service._id),
    provider: toId(service.provider?._id || service.provider),
    title: service.title || '',
    description: service.description || '',
    price: Number(service.price || 0),
    category: service.category || '',
    icon: service.icon || '',
    includedItems: service.includedItems || [],
  };
}

function formatProvider(provider, services = []) {
  return {
    _id: toId(provider._id),
    user: formatUser(provider.user),
    isOpen: Boolean(provider.isOpen),
    // provider is considered verified if already marked or has completed more than 23 jobs
    isVerified: Boolean(provider.isVerified) || (Number(provider.totalJobs || 0) > 23),
    portfolio: provider.portfolio || [],
    maxBookingsPerDay: provider.maxBookingsPerDay || 3,
    averageRating: Number(provider.averageRating || 0),
    totalJobs: Number(provider.totalJobs || 0),
    services: services.map(formatService),
  };
}

function formatBooking(booking, review = null) {
  const service = booking.service || {};
  const customer = booking.customer || {};

  return {
    _id: toId(booking._id),
    provider: toId(booking.provider?._id || booking.provider),
    service: {
      _id: toId(service._id),
      title: service.title || '',
    },
    date: booking.date,
    timeSlot: booking.timeSlot,
    totalAmount: Number(booking.totalAmount || 0),
    status: booking.status,
    customer: {
      name: booking.customerName || customer.name || '',
      email: booking.customerEmail || customer.email || '',
      profilePic: customer.profilePic || '',
    },
    customerReview: review
      ? {
          _id: toId(review._id),
          serviceId: toId(review.service?._id || review.service),
          customerName: review.customerName || '',
          rating: Number(review.rating || 0),
          comment: review.comment || '',
          reply: review.reply || '',
          date: review.date,
        }
      : null,
  };
}

function formatReview(review) {
  return {
    _id: toId(review._id),
    serviceId: toId(review.service?._id || review.service),
    serviceTitle: review.serviceTitle || review.service?.title || '',
    customerName: review.customerName || '',
    rating: Number(review.rating || 0),
    comment: review.comment || '',
    reply: review.reply || '',
    date: review.date,
  };
}

async function getCurrentProvider(userId) {
  return Provider.findOne({ user: userId }).populate('user');
}

async function refreshProviderStats(providerId) {
  const services = await Service.find({ provider: providerId }).select('_id').lean();
  const serviceIds = services.map((service) => service._id);

  const reviewAggregate = await Review.aggregate([
    { $match: { service: { $in: serviceIds } } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } },
  ]);

  const totalJobs = await Booking.countDocuments({ provider: providerId, status: 'completed' });

  await Provider.findByIdAndUpdate(providerId, {
    averageRating: reviewAggregate[0]?.averageRating || 0,
    totalJobs,
  });
}

const getDashboard = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const services = await Service.find({ provider: provider._id }).sort({ createdAt: 1 }).lean();
    return res.json(formatProvider(provider, services));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleOpen = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    provider.isOpen = !provider.isOpen;
    await provider.save();
    return res.json({ isOpen: provider.isOpen });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const includedItems = Array.isArray(req.body.includedItems)
      ? req.body.includedItems
      : String(req.body.includedItems || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);

    await Service.create({
      provider: provider._id,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      icon: req.body.icon || '',
      includedItems,
    });

    const services = await Service.find({ provider: provider._id }).sort({ createdAt: 1 }).lean();
    return res.json(services.map(formatService));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editService = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const service = await Service.findOne({ _id: req.params.serviceId, provider: provider._id });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = req.body.title;
    service.description = req.body.description;
    service.price = Number(req.body.price);
    service.category = req.body.category;
    service.icon = req.body.icon || service.icon;
    service.includedItems = Array.isArray(req.body.includedItems)
      ? req.body.includedItems
      : String(req.body.includedItems || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
    await service.save();

    const services = await Service.find({ provider: provider._id }).sort({ createdAt: 1 }).lean();
    return res.json(services.map(formatService));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const service = await Service.findOneAndDelete({ _id: req.params.serviceId, provider: provider._id });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const bookings = await Booking.find({ provider: provider._id, status: 'pending' })
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .lean();

    return res.json(bookings.map((booking) => formatBooking(booking)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const respondToBooking = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const booking = await Booking.findOne({ _id: req.params.bookingId, provider: provider._id }).populate('service', 'title');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.action === 'accept' ? 'accepted' : 'declined';
    await booking.save();

    return res.json(formatBooking(booking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const booking = await Booking.findOne({ _id: req.params.bookingId, provider: provider._id }).populate('service', 'title');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentIndex = STATUS_PIPELINE.indexOf(booking.status);
    if (currentIndex === -1 || currentIndex === STATUS_PIPELINE.length - 1) {
      return res.status(400).json({ message: 'Booking is already completed or has an invalid status.' });
    }

    booking.status = STATUS_PIPELINE[currentIndex + 1];
    await booking.save();

    if (booking.status === 'completed') {
      await refreshProviderStats(provider._id);
    }

    return res.json(formatBooking(booking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getActiveBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Review.find({ booking: { $in: bookings.map((booking) => booking._id) } }).lean();
    const reviewMap = new Map(reviews.map((review) => [toId(review.booking), review]));

    return res.json(bookings.map((booking) => formatBooking(booking, reviewMap.get(toId(booking._id)) || null)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const bookings = await Booking.find({ provider: provider._id, status: 'completed' }).lean();
    const period = req.query.period === 'daily' ? 'daily' : 'monthly';
    const buckets = new Map();

    bookings.forEach((booking) => {
      const key = period === 'daily' ? booking.date : String(booking.date || '').slice(0, 7);
      if (!key) {
        return;
      }

      buckets.set(key, (buckets.get(key) || 0) + Number(booking.totalAmount || 0));
    });

    return res.json(
      Array.from(buckets.entries())
        .sort(([a], [b]) => String(a).localeCompare(String(b)))
        .map(([label, amount]) => ({ label, amount: Number(amount.toFixed(2)) }))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadPortfolioPhoto = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;
    await Upload.create({ provider: provider._id, url });

    provider.portfolio = provider.portfolio || [];
    provider.portfolio.push(url);
    await provider.save();

    return res.json({ url, portfolio: provider.portfolio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllServices = async (_req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    return res.json(services.map(formatService));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const services = await Service.find({ category: new RegExp(`^${category}$`, 'i') }).sort({ createdAt: -1 }).lean();
    return res.json(services.map(formatService));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchServices = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const services = await Service.find({
      $or: [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { category: new RegExp(keyword, 'i') },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(services.map(formatService));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json(formatService(service));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopProviders = async (_req, res) => {
  try {
    // Only providers with averageRating > 0, sorted by rating then completed jobs
    const providers = await Provider.find({ averageRating: { $gt: 0 } })
      .sort({ averageRating: -1, totalJobs: -1 })
      .limit(5)
      .populate('user')
      .lean();

    const providerIds = providers.map((provider) => provider._id);
    const services = await Service.find({ provider: { $in: providerIds } }).lean();

    const servicesByProvider = services.reduce((acc, service) => {
      const providerId = toId(service.provider);
      if (!acc.has(providerId)) {
        acc.set(providerId, []);
      }
      acc.get(providerId).push(service);
      return acc;
    }, new Map());

    return res.json(providers.map((provider) => formatProvider(provider, servicesByProvider.get(toId(provider._id)) || [])));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('user').lean();
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const services = await Service.find({ provider: provider._id }).sort({ createdAt: -1 }).lean();
    return res.json(formatProvider(provider, services));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, customerName, customerEmail } = req.body;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ message: 'serviceId, date, and timeSlot are required.' });
    }

    const chosenDate = new Date(`${date}T${timeSlot}:00`);
    if (Number.isNaN(chosenDate.getTime()) || chosenDate <= new Date()) {
      return res.status(400).json({ message: 'Cannot book a date/time in the past.' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const platformFee = Number(service.price) * 0.1;
    const tax = Number(service.price) * 0.05;
    const totalAmount = Number((Number(service.price) + platformFee + tax).toFixed(2));

    const booking = await Booking.create({
      provider: service.provider,
      service: service._id,
      date,
      timeSlot,
      totalAmount,
      status: 'pending',
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'customer@fixit.com',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('service', 'title').lean();
    return res.status(201).json(formatBooking(populatedBooking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).lean();
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const appointmentTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const now = new Date();
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);
    if (diffHours <= 2) {
      return res.status(403).json({ message: `Cannot cancel — appointment within ${diffHours.toFixed(1)} hours.` });
    }

    await Booking.deleteOne({ _id: booking._id });
    return res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.id }).sort({ createdAt: -1 }).lean();
    return res.json(reviews.map(formatReview));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { bookingId, customerName, rating, comment } = req.body;
    const serviceId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating between 1 and 5 is required.' });
    }

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required.' });
    }

    if (bookingId) {
      const booking = await Booking.findById(bookingId).lean();
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
      if (booking.status !== 'completed') {
        return res.status(400).json({ message: 'Only completed orders can be reviewed.' });
      }
      if (String(booking.service) !== String(serviceId)) {
        return res.status(400).json({ message: 'Review service does not match this booking.' });
      }
    }

    const review = await Review.create({
      service: serviceId,
      booking: bookingId || undefined,
      customerName: customerName || 'Anonymous',
      rating: Number(rating),
      comment,
      reply: '',
    });

    const service = await Service.findById(serviceId).lean();
    if (service?.provider) {
      await refreshProviderStats(service.provider);
    }

    const savedReview = await Review.findById(review._id).populate('service', 'title').lean();
    return res.status(201).json(formatReview(savedReview));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const services = await Service.find({ provider: provider._id }).select('_id title').lean();
    const serviceMap = new Map(services.map((service) => [toId(service._id), service.title]));
    const serviceIds = services.map((service) => service._id);
    const reviews = await Review.find({ service: { $in: serviceIds } }).sort({ createdAt: -1 }).populate('service', 'title').lean();

    return res.json(
      reviews.map((review) =>
        formatReview({
          ...review,
          serviceTitle: serviceMap.get(toId(review.service?._id || review.service)) || review.service?.title || '',
        })
      )
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const provider = await getCurrentProvider(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    if (!req.body.reply) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    const serviceIds = await Service.find({ provider: provider._id }).select('_id').lean();
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, service: { $in: serviceIds.map((service) => service._id) } },
      { reply: req.body.reply },
      { new: true }
    ).populate('service', 'title').lean();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.json(formatReview(review));
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
  getProviderById,
  updateBookingStatus,
  getActiveBookings,
  createBooking,
  cancelBooking,
  getServiceReviews,
  addReview,
  getProviderReviews,
  replyToReview,
};