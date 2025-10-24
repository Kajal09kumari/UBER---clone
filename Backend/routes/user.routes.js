const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware'); 


router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  ],
  
  userController.registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userController.loginUser
);

// ⭐ NEW ROUTE: Ride Request Endpoint
router.post(
    '/ride/request',
    authUser,
    [
        // Add basic validation for required ride data (e.g., location coordinates)
        body('startLocation.lat').isFloat().withMessage('Start latitude is required and must be a number.'),
        body('startLocation.lng').isFloat().withMessage('Start longitude is required and must be a number.'),
        body('endLocation.lat').isFloat().withMessage('End latitude is required and must be a number.'),
        body('endLocation.lng').isFloat().withMessage('End longitude is required and must be a number.'),
    ],
    userController.requestRide // Links to the function that performs the driver matching
);


router.get('/profile', authUser, userController.getUserProfile); 
router.get('/logout', authUser, userController.logoutUser);      

module.exports = router;