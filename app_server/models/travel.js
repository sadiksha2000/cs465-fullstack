// app_server/models/travel.js
// Reads the trips data from trips.json.
// (In a later module this will be swapped for a MongoDB-backed model,
// but the controller interface below is written so that swap won't
// require changes anywhere else.)

const fs = require('fs');
const path = require('path');

const tripsPath = path.join(__dirname, '..', 'data', 'trips.json');

const getAllTrips = () => {
  const raw = fs.readFileSync(tripsPath, 'utf-8');
  return JSON.parse(raw);
};

module.exports = {
  getAllTrips
};
