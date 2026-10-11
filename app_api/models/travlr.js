// app_server/models/travlr.js
// Mongoose schema and model for a Travlr Getaways trip.
// Every trip must have the fields below. Mongoose checks them before a
// document is saved, so incomplete records never reach the database.

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  code: { type: String, required: [true, 'A trip code is required'], index: true },
  name: { type: String, required: [true, 'A trip name is required'], index: true },
  length: { type: String, required: [true, 'The trip length is required'] },
  start: { type: Date, required: [true, 'A start date is required'] },
  resort: { type: String, required: [true, 'A resort name is required'] },
  perPerson: { type: String, required: [true, 'A price per person is required'] },
  image: { type: String, required: [true, 'An image file name is required'] },
  description: { type: String, required: [true, 'A description is required'] }
});

// Third argument sets the collection name to "trips".
const Trip = mongoose.model('trips', tripSchema, 'trips');

module.exports = Trip;
