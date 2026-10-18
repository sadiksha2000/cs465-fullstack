// app_api/middleware/auth.js
// Guards for the admin endpoints.
//   requireAuth - the request must carry a valid, unexpired token
//   registerGate - anyone may create the very first user; after that,
//                  only a logged-in user may create more

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }
  try {
    req.auth = jwt.verify(token, User.getSecret());
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Your session has expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return res.status(401).json({ message });
  }
};

const registerGate = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      return next(); // bootstrap: nobody exists yet, so allow the first admin
    }
    return requireAuth(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: 'Could not check existing users' });
  }
};

module.exports = { requireAuth, registerGate };
