// app_server/routes/index.js
// Public website routes

const express = require('express');
const router = express.Router();

const travelController = require('../controllers/travel');

router.get('/travel', travelController.travel);
router.get('/api/trips', travelController.tripsJson);

module.exports = router;
