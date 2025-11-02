const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const { getIO } = require('../socket');
const { Types } = require('mongoose');
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

// Create a simple ride request and broadcast to available captains
// body: { pickup: {lat, lng, address?}, dropoff: {lat, lng, address?} }
module.exports.requestRide = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { pickup, dropoff } = req.body;
        const rideId = new Types.ObjectId().toString();

        // Broadcast to all online drivers for now; in production filter nearby by geo query
        const io = getIO();
        io.to('drivers:online').emit('ride:new', {
            rideId,
            pickup,
            dropoff,
            user: {
                _id: req.user._id,
                name: `${req.user.fullname?.firstname || ''} ${req.user.fullname?.lastname || ''}`.trim(),
            },
        });

        return res.status(200).json({ rideId, status: 'broadcasted' });
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to request ride' });
    }
}