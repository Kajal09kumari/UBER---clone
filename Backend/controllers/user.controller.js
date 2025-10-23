// users controller file 

const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model'); // ⭐ NEW: Import Captain Model for matching

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if (!errors.isEmpty()) {
        // console.error("Validation errors:", errors.array());

        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullname, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {      
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    
    res.status(201).json({token, user});

}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token,);
    
    res.status(200).json({token, user});
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}


module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}


// ⭐ NEW FUNCTION: Ride Matching Logic
module.exports.requestRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // In a real app, you'd get origin/destination from req.body
    // const { startLocation, endLocation } = req.body; 

    try {
        // --- RIDE MATCHING LOGIC ---
        
        // Find drivers who are 'online' and NOT 'on-trip' (optional but recommended)
        const query = {
            status: 'online', // ⭐ KEY CHANGE: Filter by online status
            // You would normally add geospatial queries here:
            // 'location.lat': { $exists: true },
            // location: { 
            //     $nearSphere: {
            //         $geometry: { 
            //             type: "Point", 
            //             coordinates: [startLocation.lng, startLocation.lat] 
            //         },
            //         $maxDistance: 5000 // 5km radius
            //     }
            // }
        };

        // Find the first matching driver (limited to 5 for demonstration)
        const availableCaptains = await captainModel
            .find(query)
            .limit(5)
            .select('fullname email vehicle location status'); 

        if (availableCaptains.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No online captains found nearby. Please try again shortly."
            });
        }

        // For simplicity, we just return the list of potential captains.
        // A real app would pick the best one and send them a ride request.
        const matchedCaptain = availableCaptains[0]; 

        res.status(200).json({
            success: true,
            message: "Captain found! Sending ride request...",
            matchedCaptain: {
                fullname: matchedCaptain.fullname,
                vehicle: matchedCaptain.vehicle,
                location: matchedCaptain.location
            },
            // Optional: return the full list for debugging/further processing
            // availableCaptains 
        });

    } catch (error) {
        console.error('Error during ride request/matching:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during driver search.'
        });
    }
};

// ... (NOTE: Don't forget to update your user routes file to use requestRide)