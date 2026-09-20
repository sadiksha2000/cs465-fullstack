// app.js
// Express server for the Travlr Getaways site, now using an MVC structure
// with Handlebars (HBS) templating for the /travel route.

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

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

// ----- MVC Routes -----
const indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
