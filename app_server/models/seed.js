// app_server/models/seed.js
// Loads the sample trips from data/trips.json into the "trips" collection.
// Run with:  npm run seed
// Running it again is safe. It clears the collection first, so the
// database always ends up with exactly the trips listed in trips.json.

const { mongoose, connect } = require('./db');
const Trip = require('./travlr');
const trips = require('../data/trips.json');

const seedDB = async () => {
  await connect();

  // Remove any existing trips, then insert the sample data.
  // insertMany checks every trip against the schema before saving.
  await Trip.deleteMany({});
  const inserted = await Trip.insertMany(trips);
  console.log(`Seeded ${inserted.length} trips into the "trips" collection`);
};

seedDB()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
