// app.js
// Express server for the Travlr Getaways site.
//   app_server - the customer-facing website (MVC with Handlebars views)
//   app_api    - the REST API (served under /api) that reads MongoDB via Mongoose
// Keeping them separate is "separation of concerns": the website asks the
// API for data and never touches the database itself.

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const { connect } = require('./app_api/models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- View engine setup (Handlebars) -----
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'app_server/views/layouts'),
  partialsDir: path.join(__dirname, 'app_server/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server/views'));

// ----- Static assets (CSS, images, and remaining static HTML pages) -----
app.use(express.static(path.join(__dirname, 'public')));

// ----- REST API routes (JSON), mounted under /api -----
// Read JSON request bodies (needed for POST and PUT).
app.use('/api', express.json());

// The Angular admin app runs on its own address (port 4200 during
// development), so the browser needs the API's permission to talk to it.
// This is called CORS. Only the Angular development address is allowed.
const ANGULAR_ORIGIN = process.env.ANGULAR_ORIGIN || 'http://localhost:4200';
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', ANGULAR_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // A browser first sends an OPTIONS "preflight" request before PUT or
  // DELETE. Answer it right away with no body.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const apiRouter = require('./app_api/routes/index');
app.use('/api', apiRouter);

// ----- Website routes (HTML pages) -----
const indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

// If a caller sends JSON that cannot be read, answer with a clean 400.
app.use('/api', (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'The request body is not valid JSON' });
  }
  return next(err);
});

// Connect to MongoDB first, then start the server.
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
