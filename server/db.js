const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'fixit.sqlite');
const db = new Database(dbPath);

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  profilePic TEXT,
  isOpen INTEGER,
  averageRating REAL,
  totalJobs INTEGER
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  providerId TEXT,
  title TEXT,
  description TEXT,
  price REAL,
  category TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  providerId TEXT,
  serviceId TEXT,
  date TEXT,
  timeSlot TEXT,
  totalAmount REAL,
  status TEXT,
  customerName TEXT,
  customerEmail TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  serviceId TEXT,
  customerName TEXT,
  rating INTEGER,
  comment TEXT,
  reply TEXT,
  date TEXT
);

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  providerId TEXT,
  url TEXT
);
`);

console.log('Database initialized at', dbPath);

module.exports = db;
