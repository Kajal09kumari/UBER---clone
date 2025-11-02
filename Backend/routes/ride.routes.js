const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * POST /rides/create
 * Create a new ride request
 * Requires authentication
 */
router.post('/create',
    authMiddleware.authUser,
    [
        body('pickup.address').notEmpty().withMessage('Pickup address is required'),
        body('pickup.coordinates.lat').isFloat().withMessage('Valid pickup latitude is required'),
        body('pickup.coordinates.lng').isFloat().withMessage('Valid pickup longitude is required'),
        body('destination.address').notEmpty().withMessage('Destination address is required'),
        body('destination.coordinates.lat').isFloat().withMessage('Valid destination latitude is required'),
        body('destination.coordinates.lng').isFloat().withMessage('Valid destination longitude is required'),
        body('vehicleType').optional().isIn(['car', 'auto', 'bike']).withMessage('Invalid vehicle type')
    ],
    rideController.createRide
);

/**
 * POST /rides/accept
 * Captain accepts a ride
 * Requires captain authentication
 */
router.post('/accept',
    authMiddleware.authCaptain,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required')
    ],
    rideController.acceptRide
);

/**
 * POST /rides/cancel
 * Cancel a ride
 * Requires authentication (user or captain)
 */
router.post('/cancel',
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('cancelledBy').notEmpty().withMessage('cancelledBy is required')
    ],
    rideController.cancelRide
);

/**
 * POST /rides/status
 * Update ride status
 * Requires captain authentication
 */
router.post('/status',
    authMiddleware.authCaptain,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('status').notEmpty().withMessage('Status is required')
    ],
    rideController.updateRideStatus
);

module.exports = router;
