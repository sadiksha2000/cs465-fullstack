// app_api/controllers/authentication.js
// POST /api/register - create a user
// POST /api/login    - check email + password, answer with a token

const passport = require('../config/passport');
const User = require('../models/user');

const MIN_PASSWORD_LENGTH = 8;

const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are all required' });
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `The password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    });
  }
  try {
    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'A user with that email already exists' });
    }
    const user = new User({ name, email });
    user.setPassword(password);
    await user.save();
    return res.status(201).json({ token: user.generateJwt() });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ message: 'The user data is not valid' });
    }
    return res.status(500).json({ message: 'Could not create the user' });
  }
};

const login = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Login failed. Please try again.' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    return res.status(200).json({ token: user.generateJwt() });
  })(req, res);
};

module.exports = { register, login };
