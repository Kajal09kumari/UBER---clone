const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Captain = require('../models/captain.model');

let io;

/**
 * Initialize Socket.io server with CORS configuration
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.io instance
 */
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Middleware for socket authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if user or captain
            let user = await User.findById(decoded._id);
            let userType = 'user';
            
            if (!user) {
                user = await Captain.findById(decoded._id);
                userType = 'captain';
            }

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            socket.userType = userType;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`New ${socket.userType} connected:`, socket.user._id);

        // Join user to their own room
        socket.join(socket.user._id.toString());

        // If captain, join captains room and handle status
        if (socket.userType === 'captain') {
            socket.join('captains');
            
            // Store captain's socket ID for location updates
            socket.on('captain:available', (data) => {
                const { location } = data;
                socket.location = location;
                console.log(`Captain ${socket.user._id} is available at:`, location);
            });

            // Handle captain location updates
            socket.on('captain:location-update', (data) => {
                const { location, rideId } = data;
                socket.location = location;
                
                // If captain is on a ride, emit location to the user
                if (rideId) {
                    io.to(rideId).emit('driver:location-update', {
                        location,
                        captainId: socket.user._id
                    });
                }
            });

            // Handle ride acceptance
            socket.on('captain:accept-ride', (data) => {
                const { rideId, userId } = data;
                
                // Notify the user that captain accepted the ride
                io.to(userId).emit('ride:accepted', {
                    captainId: socket.user._id,
                    captain: {
                        fullname: socket.user.fullname,
                        vehicle: socket.user.vehicle,
                        location: socket.location
                    },
                    rideId
                });

                // Join ride-specific room
                socket.join(rideId);
            });

            // Handle ride rejection
            socket.on('captain:reject-ride', (data) => {
                const { rideId } = data;
                console.log(`Captain ${socket.user._id} rejected ride ${rideId}`);
            });
        }

        // If user, join users room
        if (socket.userType === 'user') {
            socket.join('users');

            // Handle ride request from user
            socket.on('user:request-ride', (rideData) => {
                const { pickup, destination, vehicleType } = rideData;
                
                // Emit to all available captains
                io.to('captains').emit('ride:new-request', {
                    rideId: socket.id + Date.now(), // Generate unique ride ID
                    userId: socket.user._id,
                    user: {
                        fullname: socket.user.fullname,
                    },
                    pickup,
                    destination,
                    vehicleType,
                    timestamp: new Date()
                });

                console.log(`User ${socket.user._id} requested a ${vehicleType} ride`);
            });

            // Handle ride cancellation
            socket.on('user:cancel-ride', (data) => {
                const { rideId } = data;
                io.to('captains').emit('ride:cancelled', { rideId });
                console.log(`User ${socket.user._id} cancelled ride ${rideId}`);
            });
        }

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`${socket.userType} disconnected:`, socket.user._id);
            
            if (socket.userType === 'captain') {
                socket.leave('captains');
            } else {
                socket.leave('users');
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
}

/**
 * Get the Socket.io instance
 * @returns {Object} Socket.io instance
 */
function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

/**
 * Emit a new ride request to nearby available captains
 * @param {Object} rideData - Ride request data
 */
function emitNewRideRequest(rideData) {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    
    io.to('captains').emit('ride:new-request', rideData);
}

/**
 * Emit driver location update to a specific user
 * @param {String} userId - User ID
 * @param {Object} locationData - Location data with captain info
 */
function emitDriverLocation(userId, locationData) {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    
    io.to(userId).emit('driver:location-update', locationData);
}

/**
 * Emit ride acceptance notification to user
 * @param {String} userId - User ID
 * @param {Object} rideData - Ride acceptance data
 */
function emitRideAccepted(userId, rideData) {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    
    io.to(userId).emit('ride:accepted', rideData);
}

module.exports = {
    initializeSocket,
    getIO,
    emitNewRideRequest,
    emitDriverLocation,
    emitRideAccepted
};
