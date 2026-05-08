const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connect } = require('./mongo');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Provider = require('./models/Provider');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

async function seed() {
  await connect();

  const passwordHash = await bcrypt.hash('password123', 10);

  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Provider.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const providerUser = await User.create({
    name: 'Mahadi Provider',
    email: 'mahadi@test.com',
    passwordHash,
    role: 'provider',
    profilePic: '',
  });

  const customerUser = await User.create({
    name: 'Demo Customer',
    email: 'customer@test.com',
    passwordHash,
    role: 'customer',
    profilePic: '',
  });

  const customer = await Customer.create({
    user: customerUser._id,
    name: 'Demo Customer',
    profilePic: '',
    phone: '',
  });

  const provider = await Provider.create({
    user: providerUser._id,
    isOpen: true,
    isVerified: true,
    portfolio: [],
    averageRating: 4.5,
    totalJobs: 23,
  });

  const services = await Service.insertMany([
    {
      provider: provider._id,
      title: 'AC Repair',
      description: 'AC installation and repair service',
      price: 1200,
      category: 'Appliance',
      icon: '📺',
      includedItems: ['Basic diagnosis', 'Filter cleaning', 'Cooling check'],
    },
    {
      provider: provider._id,
      title: 'Deep Cleaning',
      description: 'Home deep cleaning with professional tools',
      price: 800,
      category: 'Cleaning',
      icon: '🧹',
      includedItems: ['Floor and surface cleaning', 'Kitchen grease removal', 'Bathroom sanitization'],
    },
    {
      provider: provider._id,
      title: 'Electrical Wiring',
      description: 'Safe electrical wiring and socket setup',
      price: 950,
      category: 'Electrical',
      icon: '⚡',
      includedItems: ['Wiring safety inspection', 'Socket and switch testing', 'Minor connection repair'],
    },
  ]);

  const bookings = await Booking.insertMany([
    {
      provider: provider._id,
      service: services[0]._id,
      customer: customer._id,
      customerName: 'Rahim Uddin',
      customerEmail: 'rahim@test.com',
      date: '2026-05-08',
      timeSlot: '10:00',
      totalAmount: 1380,
      status: 'pending',
    },
    {
      provider: provider._id,
      service: services[1]._id,
      customer: customer._id,
      customerName: 'Karim Hossain',
      customerEmail: 'karim@test.com',
      date: '2026-05-09',
      timeSlot: '14:00',
      totalAmount: 920,
      status: 'accepted',
    },
    {
      provider: provider._id,
      service: services[2]._id,
      customer: customer._id,
      customerName: 'Nasrin Akter',
      customerEmail: 'nasrin@test.com',
      date: '2026-05-10',
      timeSlot: '09:00',
      totalAmount: 1092,
      status: 'on_the_way',
    },
    {
      provider: provider._id,
      service: services[0]._id,
      customer: customer._id,
      customerName: 'Ayesha Rahman',
      customerEmail: 'ayesha@test.com',
      date: '2026-04-28',
      timeSlot: '11:00',
      totalAmount: 690,
      status: 'completed',
    },
  ]);

  await Review.insertMany([
    {
      service: services[0]._id,
      booking: bookings[3]._id,
      customer: customer._id,
      customerName: 'Alice Smith',
      rating: 5,
      comment: 'Excellent AC repair! The technician was very polite and fixed the issue quickly.',
      reply: 'Thank you Alice! We are glad you liked our service.',
      date: '2026-05-01',
    },
    {
      service: services[0]._id,
      booking: bookings[3]._id,
      customer: customer._id,
      customerName: 'Bob Johnson',
      rating: 4,
      comment: 'Good service, but arrived 10 minutes late.',
      reply: '',
      date: '2026-05-03',
    },
  ]);

  console.log('Seed complete');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
