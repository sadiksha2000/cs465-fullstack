// app_server/controllers/travel.js
// Controller for the Travel (dive trips) page.
// Data is now sourced dynamically from trips.json instead of being
// hardcoded in the view.

const Travel = require('../models/travel');

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const travel = (req, res) => {
  const trips = Travel.getAllTrips().map((trip) => ({
    ...trip,
    start: formatDate(trip.start)
  }));

  res.render('travel', {
    title: 'Travel | Travlr Getaways',
    trips
  });
};

module.exports = {
  travel
};
