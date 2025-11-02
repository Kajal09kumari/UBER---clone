const rideService = require('../services/ride.service');
const socketService = require('../services/socket.service');
const { validationResult } = require('express-validator');
const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');

// Create a new ride request
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, vehicleType, distance, duration } = req.body;
        const userId = req.user._id;

        // Create the ride
        const ride = await rideService.createRide({
            user: userId,
            pickup,
            destination,
            vehicleType,
            distance,
            duration,
        });

        // Populate user data
        const populatedRide = await ride.populate('user');

        // Find nearby drivers
        const nearbyDrivers = await rideService.findNearbyDrivers(
            pickup.coordinates.lat,
            pickup.coordinates.lng,
            vehicleType
        );

        // Get io instance from app
        const io = req.app.get('io');

        // Send ride request to nearby drivers via Socket.io
        socketService.sendRideRequestToDrivers(io, populatedRide, nearbyDrivers);

        res.status(201).json({
            success: true,
            ride: populatedRide,
            nearbyDriversCount: nearbyDrivers.length,
        });
    } catch (error) {
        console.error('Create ride error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Accept a ride (captain)
module.exports.acceptRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const captainId = req.captain._id;

        const ride = await rideService.acceptRide(rideId, captainId);
        const populatedRide = await ride.populate('user captain');

        // Get io instance
        const io = req.app.get('io');

        // Get user's socketId from user model
        const user = await userModel.findById(ride.user);
        const captain = await captainModel.findById(captainId);

        if (user && user.socketId) {
            socketService.sendRideAcceptedToUser(io, user.socketId, populatedRide, captain);
        }

        res.status(200).json({
            success: true,
            ride: populatedRide,
        });
    } catch (error) {
        console.error('Accept ride error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Start a ride (captain)
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId, otp } = req.body;

        const ride = await rideService.startRide(rideId, otp);

        // Get io instance
        const io = req.app.get('io');

        // Get user's socketId
        const user = await userModel.findById(ride.user._id);
        if (user && user.socketId) {
            socketService.sendRideStartedToUser(io, user.socketId, ride);
        }

        res.status(200).json({
            success: true,
            ride,
        });
    } catch (error) {
        console.error('Start ride error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Complete a ride (captain)
module.exports.completeRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;

        const ride = await rideService.completeRide(rideId);

        // Get io instance
        const io = req.app.get('io');

        // Get user and captain socketIds
        const user = await userModel.findById(ride.user._id);
        const captain = await captainModel.findById(ride.captain._id);

        if (user && user.socketId && captain && captain.socketId) {
            socketService.sendRideCompletedNotification(
                io,
                user.socketId,
                captain.socketId,
                ride
            );
        }

        res.status(200).json({
            success: true,
            ride,
        });
    } catch (error) {
        console.error('Complete ride error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get ride details
module.exports.getRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await rideService.getRideById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        res.status(200).json({
            success: true,
            ride,
        });
    } catch (error) {
        console.error('Get ride error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's ride history
module.exports.getUserRides = async (req, res) => {
    try {
        const userId = req.user._id;
        const rides = await rideService.getUserRides(userId);

        res.status(200).json({
            success: true,
            rides,
        });
    } catch (error) {
        console.error('Get user rides error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get captain's ride history
module.exports.getCaptainRides = async (req, res) => {
    try {
        const captainId = req.captain._id;
        const rides = await rideService.getCaptainRides(captainId);

        res.status(200).json({
            success: true,
            rides,
        });
    } catch (error) {
        console.error('Get captain rides error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update captain location (for real-time tracking)
module.exports.updateCaptainLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const captainId = req.captain._id;

        // Update captain's location in database
        const captain = await captainModel.findByIdAndUpdate(
            captainId,
            { location: { lat, lng } },
            { new: true }
        );

        // Get io instance
        const io = req.app.get('io');

        // Broadcast location to all connected users (they can filter by their ride)
        io.emit('captain-location-update', {
            captainId: captainId.toString(),
            location: { lat, lng },
        });

        res.status(200).json({
            success: true,
            location: captain.location,
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
