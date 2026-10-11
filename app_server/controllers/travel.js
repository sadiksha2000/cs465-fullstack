// app_server/controllers/travel.js
// Controller for the Travel (dive trips) page.
// This controller no longer touches the database. It asks the REST API
// (app_api) for the trips as JSON, then hands that data to the view.

// Where the API lives. Defaults to this same server's /api endpoint.
const apiBase =
  process.env.API_URL || `http://localhost:${process.env.PORT || 3000}/api`;

const formatDate = (value) => {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

// GET /travel  ->  renders the Handlebars view with trips from the API
const travel = async (req, res) => {
  try {
    const response = await fetch(`${apiBase}/trips`);

    // fetch only fails on network errors, so check the status code too
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const tripsFromApi = await response.json();

    const trips = tripsFromApi.map((trip) => ({
      ...trip,
      start: formatDate(trip.start)
    }));

    res.render('travel', {
      title: 'Travel | Travlr Getaways',
      trips
    });
  } catch (err) {
    console.error('Error loading trips from the API:', err.message);
    res.status(500).send('Sorry, the trips could not be loaded right now.');
  }
};

module.exports = {
  travel
};
