const db = require('./db');

function seed() {
  const insertProvider = db.prepare(`INSERT OR REPLACE INTO providers (id,name,email,profilePic,isOpen,averageRating,totalJobs) VALUES (@id,@name,@email,@profilePic,@isOpen,@averageRating,@totalJobs)`);
  const insertService = db.prepare(`INSERT OR REPLACE INTO services (id,providerId,title,description,price,category) VALUES (@id,@providerId,@title,@description,@price,@category)`);
  const insertBooking = db.prepare(`INSERT OR REPLACE INTO bookings (id,providerId,serviceId,date,timeSlot,totalAmount,status,customerName,customerEmail) VALUES (@id,@providerId,@serviceId,@date,@timeSlot,@totalAmount,@status,@customerName,@customerEmail)`);
  const insertReview = db.prepare(`INSERT OR REPLACE INTO reviews (id,serviceId,customerName,rating,comment,reply,date) VALUES (@id,@serviceId,@customerName,@rating,@comment,@reply,@date)`);

  const provider = {
    id: 'provider-1',
    name: 'Mahadi Provider',
    email: 'mahadi@test.com',
    profilePic: '',
    isOpen: 1,
    averageRating: 4.5,
    totalJobs: 23,
  };

  insertProvider.run(provider);

  const services = [
    { id: 'svc-1', providerId: provider.id, title: 'AC Repair', description: 'AC installation and repair service', price: 1200, category: 'Appliance' },
    { id: 'svc-2', providerId: provider.id, title: 'Deep Cleaning', description: 'Home deep cleaning with professional tools', price: 800, category: 'Cleaning' },
    { id: 'svc-3', providerId: provider.id, title: 'Electrical Wiring', description: 'Safe electrical wiring and socket setup', price: 950, category: 'Electrical' },
  ];

  const now = new Date();

  services.forEach(s => insertService.run(s));

  const bookings = [
    { id: 'abk-1', providerId: provider.id, serviceId: 'svc-1', date: '2026-05-08', timeSlot: '10:00', totalAmount: 1380, status: 'pending', customerName: 'Rahim Uddin', customerEmail: 'rahim@test.com' },
    { id: 'abk-2', providerId: provider.id, serviceId: 'svc-2', date: '2026-05-09', timeSlot: '14:00', totalAmount: 920, status: 'accepted', customerName: 'Karim Hossain', customerEmail: 'karim@test.com' },
    { id: 'abk-3', providerId: provider.id, serviceId: 'svc-3', date: '2026-05-10', timeSlot: '09:00', totalAmount: 1092, status: 'on_the_way', customerName: 'Nasrin Akter', customerEmail: 'nasrin@test.com' },
  ];

  bookings.forEach(b => insertBooking.run(b));

  const reviews = [
    { id: 'rev-1', serviceId: 'svc-1', customerName: 'Alice Smith', rating: 5, comment: 'Excellent AC repair! The technician was very polite and fixed the issue quickly.', reply: 'Thank you Alice! We are glad you liked our service.', date: '2026-05-01' },
    { id: 'rev-2', serviceId: 'svc-1', customerName: 'Bob Johnson', rating: 4, comment: 'Good service, but arrived 10 minutes late.', reply: '', date: '2026-05-03' },
  ];

  reviews.forEach(r => insertReview.run(r));

  console.log('Seed complete');
}

seed();
