const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Provider = require('../models/Provider');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function toUserResponse(user, profile = {}) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name || profile.name || '',
    profilePic: user.profilePic || profile.profilePic || '',
    customerId: profile.customerId,
    providerId: profile.providerId,
  };
}

const registerCustomer = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || '',
      email: normalizedEmail,
      passwordHash: hash,
      role: 'customer',
    });

    const customer = await Customer.create({
      user: user._id,
      name: name || '',
      profilePic: '',
      phone: '',
    });

    const userResponse = toUserResponse(user, { customerId: customer._id.toString() });
    const token = generateToken(userResponse);
    return res.status(201).json({ token, user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registerProvider = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || '',
      email: normalizedEmail,
      passwordHash: hash,
      role: 'provider',
    });

    const provider = await Provider.create({
      user: user._id,
      isOpen: true,
      isVerified: false,
      portfolio: [],
      averageRating: 0,
      totalJobs: 0,
    });

    const userResponse = toUserResponse(user, { providerId: provider._id.toString() });
    const token = generateToken(userResponse);
    return res.status(201).json({ token, user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: 'Selected role does not match this account' });
    }

    const profile = {};
    if (user.role === 'customer') {
      const customer = await Customer.findOne({ user: user._id });
      if (customer) {
        profile.customerId = customer._id.toString();
        profile.name = customer.name || user.name;
        profile.profilePic = customer.profilePic || user.profilePic;
      }
    }

    if (user.role === 'provider') {
      const provider = await Provider.findOne({ user: user._id });
      if (provider) {
        profile.providerId = provider._id.toString();
        profile.name = user.name;
        profile.profilePic = user.profilePic;
      }
    }

    const userResponse = toUserResponse(user, profile);
    const token = generateToken(userResponse);
    return res.json({ token, user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerCustomer, registerProvider, login };
