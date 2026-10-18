// app_api/routes/index.js
// Route definitions for the trips REST API.
// This router is mounted at /api in app.js, so these paths become:
//   GET    /api/trips             -> all trips
//   POST   /api/trips             -> add a trip
//   GET    /api/trips/:tripCode   -> one trip, found by its code
//   PUT    /api/trips/:tripCode   -> update a trip
//   DELETE /api/trips/:tripCode   -> delete a trip
//   POST   /api/register          -> create a user (see below)
//   POST   /api/login             -> log in, receive a token
// Reading trips is public. Adding, updating and deleting need a token.

const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const { requireAuth, registerGate } = require('../middleware/auth');

// Users. Login is open to everyone. Registering is open only for the very
// first user; after that it needs a valid token (see middleware/auth.js).
router.post('/register', registerGate, authController.register);
router.post('/login', authController.login);

// The collection: list every trip, or add a new one.
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(requireAuth, tripsController.tripsAddTrip);

// One trip, identified by its code.
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(requireAuth, tripsController.tripsUpdateTrip)
  .delete(requireAuth, tripsController.tripsDeleteTrip);

// Anything else under /api is not a real endpoint. Answer with JSON
// instead of the default HTML error page, so API callers get a clean 404.
router.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = router;
