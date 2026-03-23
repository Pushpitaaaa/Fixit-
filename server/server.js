const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
