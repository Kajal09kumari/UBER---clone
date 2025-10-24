const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require('../middlewares/auth.middleware');

router.post(  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),  
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be one of car, motorcycle, or auto'),

  ],
  captainController.registerCaptain
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  captainController.loginCaptain
);

// ⭐ NEW ROUTE: PUT /api/captain/status
router.put(
    '/status', 
    authMiddleware.authCaptain, 
    [
        body('status').isIn(['online', 'offline', 'on-trip']).withMessage('Invalid status. Must be online, offline, or on-trip.')
    ],
    captainController.updateCaptainStatus
);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);
module.exports = router;