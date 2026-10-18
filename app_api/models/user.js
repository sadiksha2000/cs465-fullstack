// app_api/models/user.js
// A user of the admin site. The plain-text password is NEVER stored.
// Only a random salt and a hash of (password + salt) are saved, so a
// stolen database does not reveal anyone's password.

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const HASH_ITERATIONS = 310000;
const HASH_LENGTH = 64;
const HASH_DIGEST = 'sha512';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  hash: { type: String },
  salt: { type: String }
});

// Create a new random salt and store the hash of the password with it.
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_LENGTH, HASH_DIGEST)
    .toString('hex');
};

// Hash the password that was typed in and compare it to the stored hash.
userSchema.methods.validPassword = function (password) {
  const attempt = crypto
    .pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_LENGTH, HASH_DIGEST);
  const stored = Buffer.from(this.hash, 'hex');
  return stored.length === attempt.length && crypto.timingSafeEqual(stored, attempt);
};

// The secret that signs every token. Set JWT_SECRET in the environment for
// real use. The fallback is only so the class project runs without setup.
const getSecret = () => process.env.JWT_SECRET || 'travlr-dev-secret-change-me';

// A JSON Web Token (JWT) proves who the user is. It is signed with the
// secret, so it cannot be changed without the server noticing. It expires
// after one hour.
userSchema.methods.generateJwt = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    getSecret(),
    { expiresIn: '1h' }
  );
};

userSchema.statics.getSecret = getSecret;

module.exports = mongoose.model('users', userSchema);
