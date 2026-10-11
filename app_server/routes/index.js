// app_server/routes/index.js
// Public website routes (the pages customers see).
// The REST API lives separately in app_api.

const express = require('express');
const router = express.Router();

const travelController = require('../controllers/travel');

router.get('/travel', travelController.travel);

module.exports = router;
