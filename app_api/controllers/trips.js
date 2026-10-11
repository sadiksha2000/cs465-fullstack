// app_api/controllers/trips.js
// Controller for the trips REST API.
// Each method returns JSON and uses an HTTP status code that tells the
// caller what happened:
//   200 - the request worked
//   201 - a new trip was created
//   204 - the trip was deleted (nothing to send back)
//   400 - the data sent was missing or invalid
//   404 - the requested trip does not exist
//   409 - a trip with that code already exists
//   500 - something went wrong on the server (for example, the database)

const Trip = require('../models/travlr');

// Pick only the fields a trip is allowed to have, so a caller cannot
// write anything else (such as _id) into the database.
const TRIP_FIELDS = [
  'code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'
];

const pickTripFields = (body = {}) => {
  const trip = {};
  TRIP_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      trip[field] = body[field];
    }
  });
  return trip;
};

// Mongoose reports bad input as a ValidationError (missing or empty field)
// or a CastError (for example, a date it cannot read). Both are the
// caller's mistake, so they get a 400 instead of a 500.
const isBadInput = (err) =>
  err.name === 'ValidationError' || err.name === 'CastError';

// Turn a Mongoose validation error into a short list of readable messages.
const validationMessages = (err) =>
  err.errors ? Object.values(err.errors).map((e) => e.message) : [err.message];

// GET /api/trips
// Returns every trip in the collection, soonest departure first.
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ start: 1 }).exec();
    return res.status(200).json(trips);
  } catch (err) {
    console.error('API error (tripsList):', err.message);
    return res.status(500).json({ message: 'Unable to load trips' });
  }
};

// GET /api/trips/:tripCode
// Returns the single trip whose code matches, such as GALR261114.
const tripsFindByCode = async (req, res) => {
  try {
    // find() returns an array, so an empty array means no match
    const matches = await Trip.find({ code: req.params.tripCode }).exec();

    if (matches.length === 0) {
      return res
        .status(404)
        .json({ message: `Trip ${req.params.tripCode} was not found` });
    }

    return res.status(200).json(matches[0]);
  } catch (err) {
    console.error('API error (tripsFindByCode):', err.message);
    return res.status(500).json({ message: 'Unable to load the trip' });
  }
};

// POST /api/trips
// Adds a new trip. The request body is the trip as JSON.
const tripsAddTrip = async (req, res) => {
  try {
    const data = pickTripFields(req.body);

    // Trip codes identify trips in the URL, so two trips must not share one.
    if (data.code) {
      const existing = await Trip.findOne({ code: data.code }).exec();
      if (existing) {
        return res
          .status(409)
          .json({ message: `A trip with code ${data.code} already exists` });
      }
    }

    const created = await Trip.create(data);
    return res.status(201).json(created);
  } catch (err) {
    if (isBadInput(err)) {
      return res
        .status(400)
        .json({ message: 'The trip data is not valid', errors: validationMessages(err) });
    }
    console.error('API error (tripsAddTrip):', err.message);
    return res.status(500).json({ message: 'Unable to add the trip' });
  }
};

// PUT /api/trips/:tripCode
// Replaces the values of an existing trip and returns the updated trip.
const tripsUpdateTrip = async (req, res) => {
  try {
    const data = pickTripFields(req.body);

    // The code in the URL says which trip to change. If the body carries a
    // different code, make sure it does not collide with another trip.
    if (data.code && data.code !== req.params.tripCode) {
      const clash = await Trip.findOne({ code: data.code }).exec();
      if (clash) {
        return res
          .status(409)
          .json({ message: `A trip with code ${data.code} already exists` });
      }
    }

    // new: true returns the trip after the change; runValidators applies
    // the schema rules to the values being saved.
    const updated = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      data,
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      return res
        .status(404)
        .json({ message: `Trip ${req.params.tripCode} was not found` });
    }

    return res.status(200).json(updated);
  } catch (err) {
    if (isBadInput(err)) {
      return res
        .status(400)
        .json({ message: 'The trip data is not valid', errors: validationMessages(err) });
    }
    console.error('API error (tripsUpdateTrip):', err.message);
    return res.status(500).json({ message: 'Unable to update the trip' });
  }
};

// DELETE /api/trips/:tripCode
// Removes a trip. A successful delete answers 204 with no body.
const tripsDeleteTrip = async (req, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Trip ${req.params.tripCode} was not found` });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('API error (tripsDeleteTrip):', err.message);
    return res.status(500).json({ message: 'Unable to delete the trip' });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};
