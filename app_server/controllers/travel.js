// app_server/controllers/travel.js
// Controller for the Travel (dive sites) page

const travel = (req, res) => {
  res.render('travel', {
    title: 'Travel | Travlr Getaways'
  });
};

module.exports = {
  travel
};
