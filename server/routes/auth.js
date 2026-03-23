const express = require('express');
const { DEMO_TOKEN } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (email !== 'mahadi@test.com' || password !== 'password123') {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: DEMO_TOKEN,
    user: {
      id: 'provider-user-1',
      name: 'Mahadi Provider',
      email: 'mahadi@test.com',
      role: 'provider',
    },
  });
});

module.exports = router;
