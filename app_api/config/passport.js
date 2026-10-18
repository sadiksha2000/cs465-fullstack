// app_api/config/passport.js
// Tells Passport how to check an email and password at login.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: String(email).toLowerCase().trim() });
      // The same message is used for "no such user" and "wrong password",
      // so an attacker cannot learn which emails have accounts.
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
