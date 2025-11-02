const { Server } = require('socket.io');

let io;
const connectedUsers = new Map(); // Map to store user connections: userId -> socketId
const connectedCaptains = new Map(); // Map to store captain connections: captainId -> socketId
const captainLocations = new Map(); // Map to store captain locations: captainId -> {lat, lng}

/**
 * Initialize Socket.io server
 * @param {http.Server} server - The HTTP server instance
 */
function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // User joins with their user ID
        socket.on('join:user', (userId) => {
            console.log(`User ${userId} connected with socket ${socket.id}`);
            connectedUsers.set(userId, socket.id);
            socket.join(`user:${userId}`);
        });

        // Captain joins with their captain ID
        socket.on('join:captain', (captainId) => {
            console.log(`Captain ${captainId} connected with socket ${socket.id}`);
            connectedCaptains.set(captainId, socket.id);
            socket.join(`captain:${captainId}`);
            socket.join('available-captains'); // Join a room for all available captains
        });

        // User requests nearby captains
        socket.on('request:nearby-captains', (data) => {
            console.log('Request for nearby captains:', data);
            // Get all captain locations (in real app, filter by proximity)
            const nearbyCaptains = Array.from(captainLocations.entries()).map(([captainId, location]) => ({
                captainId,
                location
            }));
            socket.emit('captains:nearby', nearbyCaptains);
        });

        // Captain updates their location
        socket.on('update:location', (data) => {
            const { captainId, location } = data;
            captainLocations.set(captainId, location);
            console.log(`Captain ${captainId} location updated:`, location);
            
            // Broadcast location to the user if captain is on a ride
            if (data.rideId) {
                io.to(`ride:${data.rideId}`).emit('location:updated', {
                    captainId,
                    location,
                    timestamp: Date.now()
                });
            }
        });

        // Captain sets availability status
        socket.on('captain:availability', (data) => {
            const { captainId, isAvailable } = data;
            if (isAvailable) {
                socket.join('available-captains');
                console.log(`Captain ${captainId} is now available`);
            } else {
                socket.leave('available-captains');
                console.log(`Captain ${captainId} is now unavailable`);
            }
        });

        // User or Captain joins a specific ride room
        socket.on('join:ride', (rideId) => {
            socket.join(`ride:${rideId}`);
            console.log(`Socket ${socket.id} joined ride room: ${rideId}`);
        });

        // User or Captain leaves a ride room
        socket.on('leave:ride', (rideId) => {
            socket.leave(`ride:${rideId}`);
            console.log(`Socket ${socket.id} left ride room: ${rideId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            
            // Remove from connected users
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
            
            // Remove from connected captains
            for (const [captainId, socketId] of connectedCaptains.entries()) {
                if (socketId === socket.id) {
                    connectedCaptains.delete(captainId);
                    captainLocations.delete(captainId);
                    console.log(`Captain ${captainId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
}

/**
 * Get Socket.io instance
 * @returns {Server} Socket.io server instance
 */
function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized! Call initializeSocket first.');
    }
    return io;
}

/**
 * Emit a new ride request to nearby available captains
 * @param {Object} rideData - The ride request data
 * @param {Array} nearbyCaptainIds - Array of captain IDs that are nearby
 */
function emitNewRideRequest(rideData, nearbyCaptainIds = []) {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    // If specific captain IDs are provided, emit to them
    if (nearbyCaptainIds.length > 0) {
        nearbyCaptainIds.forEach(captainId => {
            const socketId = connectedCaptains.get(captainId);
            if (socketId) {
                io.to(socketId).emit('ride:new-request', rideData);
                console.log(`Ride request sent to captain ${captainId}`);
            }
        });
    } else {
        // Otherwise, emit to all available captains
        io.to('available-captains').emit('ride:new-request', rideData);
        console.log('Ride request broadcast to all available captains');
    }
}

/**
 * Notify user that their ride has been accepted
 * @param {String} userId - The user ID
 * @param {Object} rideData - The ride data including captain info
 */
function notifyRideAccepted(userId, rideData) {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    io.to(`user:${userId}`).emit('ride:accepted', rideData);
    console.log(`Ride acceptance notification sent to user ${userId}`);
}

/**
 * Notify captain that ride has been cancelled
 * @param {String} captainId - The captain ID
 * @param {Object} rideData - The ride cancellation data
 */
function notifyRideCancelled(captainId, rideData) {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    io.to(`captain:${captainId}`).emit('ride:cancelled', rideData);
    console.log(`Ride cancellation notification sent to captain ${captainId}`);
}

/**
 * Notify user about ride status updates
 * @param {String} userId - The user ID
 * @param {Object} statusData - The status update data
 */
function notifyRideStatusUpdate(userId, statusData) {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }

    io.to(`user:${userId}`).emit('ride:status-update', statusData);
    console.log(`Ride status update sent to user ${userId}`);
}

/**
 * Get captain's current location
 * @param {String} captainId - The captain ID
 * @returns {Object|null} Captain location or null if not available
 */
function getCaptainLocation(captainId) {
    return captainLocations.get(captainId) || null;
}

/**
 * Check if captain is connected
 * @param {String} captainId - The captain ID
 * @returns {Boolean} True if captain is connected
 */
function isCaptainConnected(captainId) {
    return connectedCaptains.has(captainId);
}

/**
 * Check if user is connected
 * @param {String} userId - The user ID
 * @returns {Boolean} True if user is connected
 */
function isUserConnected(userId) {
    return connectedUsers.has(userId);
}

module.exports = {
    initializeSocket,
    getIO,
    emitNewRideRequest,
    notifyRideAccepted,
    notifyRideCancelled,
    notifyRideStatusUpdate,
    getCaptainLocation,
    isCaptainConnected,
    isUserConnected
};
