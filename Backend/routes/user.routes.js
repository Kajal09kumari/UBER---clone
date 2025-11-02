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

router.get('/profile', authUser, userController.getUserProfile); 
router.get('/logout', authUser, userController.logoutUser);      

// Request a ride -> broadcasts to nearby/online captains
router.post(
  '/request-ride',
  authUser,
  [
    body('pickup.lat').isFloat({ min: -90, max: 90 }).withMessage('pickup.lat must be a valid latitude'),
    body('pickup.lng').isFloat({ min: -180, max: 180 }).withMessage('pickup.lng must be a valid longitude'),
    body('dropoff.lat').isFloat({ min: -90, max: 90 }).withMessage('dropoff.lat must be a valid latitude'),
    body('dropoff.lng').isFloat({ min: -180, max: 180 }).withMessage('dropoff.lng must be a valid longitude'),
  ],
  userController.requestRide
);

module.exports = router;

