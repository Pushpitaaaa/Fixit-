require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
// Connect to MongoDB before starting the server
var mongo = require('./mongo');

const providerRoutes = require('./routes/provider');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req, res) => {
  res.json({ message: 'FixIt API running' });
});

// Health and readiness endpoints
app.get('/health', (_req, res) => {
  const readyState = mongo.mongoose && mongo.mongoose.connection ? mongo.mongoose.connection.readyState : 0;
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  res.json({ status: 'ok', mongoReadyState: readyState });
});

app.get('/ready', (_req, res) => {
  const readyState = mongo.mongoose && mongo.mongoose.connection ? mongo.mongoose.connection.readyState : 0;
  if (readyState === 1) return res.json({ ready: true });
  return res.status(503).json({ ready: false, mongoReadyState: readyState });
});

app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);

(async function start() {
  try {
    await mongo.connect();
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('MongoDB connect failed, continuing without Mongo:', err && err.message);
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
