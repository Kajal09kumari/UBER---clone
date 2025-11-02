const {
    emitNewRideRequest,
    notifyRideAccepted,
    notifyRideCancelled,
    notifyRideStatusUpdate
} = require('../services/socket.service');

/**
 * Create a new ride request
 * This simulates creating a ride and notifying nearby captains
 */
module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination, userId, vehicleType } = req.body;

        // Validate request
        if (!pickup || !destination || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // In a real implementation, you would:
        // 1. Save the ride to database
        // 2. Calculate nearby captains based on pickup location
        // 3. Filter captains by vehicle type and availability
        
        // For now, we'll create a mock ride object
        const ride = {
            _id: `ride_${Date.now()}`, // Mock ride ID
            userId,
            pickup: {
                address: pickup.address,
                coordinates: pickup.coordinates
            },
            destination: {
                address: destination.address,
                coordinates: destination.coordinates
            },
            vehicleType: vehicleType || 'car',
            status: 'pending',
            fare: calculateFare(pickup.coordinates, destination.coordinates, vehicleType),
            createdAt: new Date()
        };

        // TODO: Implement logic to find nearby captains
        // For now, emit to all available captains
        const nearbyCaptainIds = []; // Empty array will broadcast to all available captains
        
        emitNewRideRequest(ride, nearbyCaptainIds);

        res.status(201).json({
            success: true,
            message: 'Ride request created and sent to nearby captains',
            data: ride
        });

    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating ride request',
            error: error.message
        });
    }
};

/**
 * Captain accepts a ride
 */
module.exports.acceptRide = async (req, res) => {
    try {
        const { rideId, captainId } = req.body;

        if (!rideId || !captainId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // In a real implementation:
        // 1. Update ride status in database
        // 2. Get captain details from database
        // 3. Notify the user

        // Mock accepted ride data
        const acceptedRide = {
            rideId,
            captainId,
            status: 'accepted',
            captain: {
                _id: captainId,
                name: 'Captain Name', // Would come from database
                vehicle: {
                    type: 'car',
                    plate: 'ABC-123'
                }
            },
            acceptedAt: new Date()
        };

        // TODO: Get userId from ride data in database
        const userId = req.body.userId; // This should come from the ride record

        if (userId) {
            notifyRideAccepted(userId, acceptedRide);
        }

        res.status(200).json({
            success: true,
            message: 'Ride accepted successfully',
            data: acceptedRide
        });

    } catch (error) {
        console.error('Error accepting ride:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting ride',
            error: error.message
        });
    }
};

/**
 * Cancel a ride
 */
module.exports.cancelRide = async (req, res) => {
    try {
        const { rideId, cancelledBy } = req.body;

        if (!rideId || !cancelledBy) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // In a real implementation:
        // 1. Update ride status in database
        // 2. Get ride details
        // 3. Notify relevant parties

        const cancellationData = {
            rideId,
            status: 'cancelled',
            cancelledBy,
            cancelledAt: new Date()
        };

        // Notify captain or user depending on who cancelled
        // This is simplified - in reality, get IDs from database
        if (req.body.captainId) {
            notifyRideCancelled(req.body.captainId, cancellationData);
        }

        res.status(200).json({
            success: true,
            message: 'Ride cancelled successfully',
            data: cancellationData
        });

    } catch (error) {
        console.error('Error cancelling ride:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling ride',
            error: error.message
        });
    }
};

/**
 * Update ride status (started, arrived, completed, etc.)
 */
module.exports.updateRideStatus = async (req, res) => {
    try {
        const { rideId, status, userId } = req.body;

        if (!rideId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Valid status values
        const validStatuses = ['accepted', 'arriving', 'arrived', 'started', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const statusUpdate = {
            rideId,
            status,
            updatedAt: new Date()
        };

        // Notify user about status update
        if (userId) {
            notifyRideStatusUpdate(userId, statusUpdate);
        }

        res.status(200).json({
            success: true,
            message: 'Ride status updated successfully',
            data: statusUpdate
        });

    } catch (error) {
        console.error('Error updating ride status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating ride status',
            error: error.message
        });
    }
};

/**
 * Helper function to calculate fare based on distance
 * This is a simplified calculation
 */
function calculateFare(pickupCoords, destCoords, vehicleType = 'car') {
    // Simple distance calculation (Haversine formula would be better)
    const lat1 = pickupCoords.lat;
    const lon1 = pickupCoords.lng;
    const lat2 = destCoords.lat;
    const lon2 = destCoords.lng;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Base fare + per km rate (varies by vehicle type)
    const rates = {
        car: { base: 50, perKm: 15 },
        auto: { base: 30, perKm: 10 },
        bike: { base: 20, perKm: 8 }
    };

    const rate = rates[vehicleType] || rates.car;
    const fare = rate.base + (distance * rate.perKm);

    return Math.round(fare);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
