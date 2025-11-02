const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const captainModel = require('./models/captain.model');
const userModel = require('./models/user.model');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Captain comes online and registers their socket
    socket.on('captain:online', async ({ token, location } = {}) => {
      try {
        if (!token) return;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findByIdAndUpdate(
          decoded._id,
          {
            socketId: socket.id,
            status: 'online',
            ...(location?.lat && location?.lng
              ? { location: { lat: location.lat, lng: location.lng } }
              : {}),
          },
          { new: true }
        );
        if (!captain) return;
        // Join a general room for available drivers
        socket.join('drivers:online');
      } catch (e) {
        // ignore invalid token
      }
    });

    // Captain updates their live location (optionally for a specific ride)
    socket.on('captain:location', async ({ token, lat, lng, rideId } = {}) => {
      try {
        if (!token || typeof lat !== 'number' || typeof lng !== 'number') return;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await captainModel.findByIdAndUpdate(decoded._id, {
          location: { lat, lng },
        });
        if (rideId) {
          io.to(`ride:${rideId}`).emit('driver:location', { lat, lng, rideId });
        }
      } catch (e) {
        // silently fail
      }
    });

    // Allow both user and captain to join a specific ride room
    socket.on('ride:join', ({ rideId } = {}) => {
      if (!rideId) return;
      socket.join(`ride:${rideId}`);
    });

    // Simple server-driven broadcast for a new ride request to all online drivers
    // payload: { rideId, pickup: {lat,lng,address?}, dropoff: {lat,lng,address?}, user: { _id, name? } }
    socket.on('ride:broadcast', ({ rideId, pickup, dropoff, user } = {}) => {
      if (!rideId || !pickup || !dropoff) return;
      io.to('drivers:online').emit('ride:new', { rideId, pickup, dropoff, user });
    });

    socket.on('disconnect', async () => {
      try {
        const captain = await captainModel.findOne({ socketId: socket.id });
        if (captain) {
          captain.socketId = undefined;
          captain.status = 'offline';
          await captain.save();
        }
      } catch (e) {
        // ignore
      }
    });
  });

  console.log('Socket.io initialized');
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { initSocket, getIO };
