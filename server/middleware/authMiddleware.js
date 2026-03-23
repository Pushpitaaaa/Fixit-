const DEMO_TOKEN = 'demo-provider-token';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  if (token !== DEMO_TOKEN) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }

  req.user = {
    id: 'provider-user-1',
    name: 'Mahadi Provider',
    email: 'mahadi@test.com',
    role: 'provider',
  };

  return next();
};

const providerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'provider') {
    return res.status(403).json({ message: 'Access denied. Provider only.' });
  }

  return next();
};

module.exports = {
  protect,
  providerOnly,
  DEMO_TOKEN,
};
