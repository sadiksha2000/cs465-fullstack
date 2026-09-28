// app_server/models/db.js
// Database access module.
// Opens the connection to the local MongoDB "travlr" database through
// Mongoose, reports connection events, and closes the connection cleanly
// when the application stops.

const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

// Report connection events so problems are easy to spot in the terminal.
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Open the connection. A failed first connection is reported clearly
// instead of leaving the app running without a database.
const connect = async () => {
  try {
    await mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.error('Could not connect to MongoDB. Is mongod running?');
    console.error(err.message);
    throw err;
  }
};

// Close the connection and report the reason for shutdown.
const shutdown = async (msg) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}`);
};

process.once('SIGUSR2', async () => {
  await shutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await shutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown('SIGTERM shutdown');
  process.exit(0);
});

// Load the schema so the Trip model is registered as soon as the
// connection module is required.
require('./travlr');

module.exports = { mongoose, connect, dbURI };
