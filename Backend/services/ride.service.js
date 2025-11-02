const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const crypto = require('crypto');

// Generate OTP for ride verification
function generateOTP() {
    return crypto.randomInt(1000, 9999).toString();
}

// Calculate fare based on vehicle type and distance
function calculateFare(vehicleType, distance) {
    const baseFares = {
        car: 50,
        auto: 30,
        motorcycle: 20,
    };
    const perKmRates = {
        car: 15,
        auto: 10,
        motorcycle: 8,
    };

    const baseFare = baseFares[vehicleType] || 50;
    const perKmRate = perKmRates[vehicleType] || 15;
    
    return Math.round(baseFare + (distance * perKmRate));
}

module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
    distance,
    duration
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = calculateFare(vehicleType, distance || 5);
    const otp = generateOTP();

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare,
        distance,
        duration,
        status: 'pending',
        vehicleType,
        otp,
    });

    return ride;
};

module.exports.acceptRide = async (rideId, captainId) => {
    const ride = await rideModel.findById(rideId);
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'pending') {
        throw new Error('Ride is not available');
    }

    ride.captain = captainId;
    ride.status = 'accepted';
    await ride.save();

    return ride;
};

module.exports.startRide = async (rideId, otp) => {
    const ride = await rideModel.findById(rideId).populate('user').populate('captain');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride is not in accepted state');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    ride.status = 'ongoing';
    await ride.save();

    return ride;
};

module.exports.completeRide = async (rideId) => {
    const ride = await rideModel.findById(rideId).populate('user').populate('captain');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing');
    }

    ride.status = 'completed';
    await ride.save();

    return ride;
};

module.exports.findNearbyDrivers = async (latitude, longitude, vehicleType, radius = 5) => {
    // Find captains within specified radius (in kilometers)
    // Using simple distance calculation
    const radiusInDegrees = radius / 111; // Rough conversion (1 degree ≈ 111 km)

    const drivers = await captainModel.find({
        'vehicle.vehicleType': vehicleType,
        status: 'online',
        'location.lat': {
            $gte: latitude - radiusInDegrees,
            $lte: latitude + radiusInDegrees,
        },
        'location.lng': {
            $gte: longitude - radiusInDegrees,
            $lte: longitude + radiusInDegrees,
        },
    });

    return drivers;
};

module.exports.getRideById = async (rideId) => {
    const ride = await rideModel.findById(rideId).populate('user').populate('captain');
    return ride;
};

module.exports.getUserRides = async (userId) => {
    const rides = await rideModel.find({ user: userId }).populate('captain').sort({ createdAt: -1 });
    return rides;
};

module.exports.getCaptainRides = async (captainId) => {
    const rides = await rideModel.find({ captain: captainId }).populate('user').sort({ createdAt: -1 });
    return rides;
};
