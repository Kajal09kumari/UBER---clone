const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');

router.post(
  '/request',
  [
    body('userId').notEmpty(),
    body('pickup').notEmpty(),
    body('destination').notEmpty(),
  ],
  rideController.requestRide
);

module.exports = router;
