const express = require('express');
const { DEMO_TOKEN } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, role } = req.body || {};

  if (role === 'provider' && email === 'mahadi@test.com' && password === 'password123') {
    return res.json({
      token: DEMO_TOKEN,
      user: {
        id: 'provider-user-1',
        name: 'Mahadi Provider',
        email: 'mahadi@test.com',
        role: 'provider',
      },
    });
  }

  if (role === 'customer' && email === 'customer@test.com' && password === 'password123') {
    return res.json({
      token: DEMO_TOKEN,
      user: {
        id: 'customer-user-1',
        name: 'Demo Customer',
        email: 'customer@test.com',
        role: 'customer',
      },
    });
  }

  return res.status(400).json({ message: 'Invalid credentials or role' });
});

module.exports = router;
