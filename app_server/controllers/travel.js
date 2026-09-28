// app_server/controllers/travel.js
// Controller for the Travel (dive trips) page.
// Trip data now comes from the MongoDB "trips" collection through Mongoose.

const Trip = require('../models/travlr');

const formatDate = (value) => {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

// Fetch every trip, soonest departure first, as plain JavaScript objects.
const getTrips = () => Trip.find({}).sort({ start: 1 }).lean().exec();

// GET /travel  ->  renders the Handlebars view with data from MongoDB
const travel = async (req, res) => {
  try {
    const trips = (await getTrips()).map((trip) => ({
      ...trip,
      start: formatDate(trip.start)
    }));

    res.render('travel', {
      title: 'Travel | Travlr Getaways',
      trips
    });
  } catch (err) {
    console.error('Error loading trips:', err.message);
    res.status(500).send('Sorry, the trips could not be loaded right now.');
  }
};

// GET /api/trips  ->  returns the same data as raw JSON
const tripsJson = async (req, res) => {
  try {
    const trips = await getTrips();
    res.status(200).json(trips);
  } catch (err) {
    console.error('Error loading trips:', err.message);
    res.status(500).json({ message: 'Unable to load trips' });
  }
};

module.exports = {
  travel,
  tripsJson
};
