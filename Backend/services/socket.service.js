const rideService = require('./ride.service');

// Send new ride request to nearby available drivers
module.exports.sendRideRequestToDrivers = async (io, rideData, nearbyDrivers) => {
    if (!nearbyDrivers || nearbyDrivers.length === 0) {
        return;
    }

    nearbyDrivers.forEach((driver) => {
        if (driver.socketId) {
            io.to(driver.socketId).emit('new-ride-request', {
                rideId: rideData._id,
                pickup: rideData.pickup,
                destination: rideData.destination,
                fare: rideData.fare,
                distance: rideData.distance,
                duration: rideData.duration,
                vehicleType: rideData.vehicleType,
                user: rideData.user,
            });
        }
    });
};

// Send ride acceptance confirmation to user
module.exports.sendRideAcceptedToUser = (io, userId, rideData, captainData) => {
    io.to(userId).emit('ride-accepted', {
        rideId: rideData._id,
        captain: {
            _id: captainData._id,
            fullname: captainData.fullname,
            vehicle: captainData.vehicle,
            location: captainData.location,
        },
        otp: rideData.otp,
        status: rideData.status,
    });
};

// Send ride started notification to user
module.exports.sendRideStartedToUser = (io, userId, rideData) => {
    io.to(userId).emit('ride-started', {
        rideId: rideData._id,
        status: rideData.status,
        captain: rideData.captain,
    });
};

// Send ride completed notification to both user and captain
module.exports.sendRideCompletedNotification = (io, userId, captainId, rideData) => {
    io.to(userId).emit('ride-completed', {
        rideId: rideData._id,
        status: rideData.status,
        fare: rideData.fare,
    });

    io.to(captainId).emit('ride-completed', {
        rideId: rideData._id,
        status: rideData.status,
        fare: rideData.fare,
    });
};

// Broadcast captain location updates to user
module.exports.broadcastCaptainLocation = (io, userId, captainLocation) => {
    io.to(userId).emit('captain-location-update', {
        location: captainLocation,
    });
};
