const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create a new ride (user)
router.post(
    '/create',
    authMiddleware.authUser,
    [
        body('pickup.address').isString().notEmpty().withMessage('Pickup address is required'),
        body('pickup.coordinates.lat').isNumeric().withMessage('Pickup latitude is required'),
        body('pickup.coordinates.lng').isNumeric().withMessage('Pickup longitude is required'),
        body('destination.address').isString().notEmpty().withMessage('Destination address is required'),
        body('destination.coordinates.lat').isNumeric().withMessage('Destination latitude is required'),
        body('destination.coordinates.lng').isNumeric().withMessage('Destination longitude is required'),
        body('vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
    ],
    rideController.createRide
);

// Accept a ride (captain)
router.post(
    '/accept',
    authMiddleware.authCaptain,
    [
        body('rideId').isMongoId().withMessage('Invalid ride ID'),
    ],
    rideController.acceptRide
);

// Start a ride (captain)
router.post(
    '/start',
    authMiddleware.authCaptain,
    [
        body('rideId').isMongoId().withMessage('Invalid ride ID'),
        body('otp').isString().isLength({ min: 4, max: 4 }).withMessage('Invalid OTP'),
    ],
    rideController.startRide
);

// Complete a ride (captain)
router.post(
    '/complete',
    authMiddleware.authCaptain,
    [
        body('rideId').isMongoId().withMessage('Invalid ride ID'),
    ],
    rideController.completeRide
);

// Get ride details
router.get(
    '/:rideId',
    authMiddleware.authUser,
    rideController.getRide
);

// Get user's ride history
router.get(
    '/user/history',
    authMiddleware.authUser,
    rideController.getUserRides
);

// Get captain's ride history
router.get(
    '/captain/history',
    authMiddleware.authCaptain,
    rideController.getCaptainRides
);

// Update captain location (for real-time tracking)
router.post(
    '/update-location',
    authMiddleware.authCaptain,
    [
        body('lat').isNumeric().withMessage('Latitude is required'),
        body('lng').isNumeric().withMessage('Longitude is required'),
    ],
    rideController.updateCaptainLocation
);

module.exports = router;
