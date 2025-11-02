const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user/captain joining
    socket.on('join', async (data) => {
        const { userId, userType } = data; // userType: 'user' or 'captain'
        socket.join(userId);
        console.log(`${userType} ${userId} joined room with socket ${socket.id}`);

        // Update socket ID in database
        try {
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'online'
                });
            }
        } catch (error) {
            console.error('Error updating socket ID:', error);
        }
    });

    // Handle captain location updates
    socket.on('update-location-captain', async (data) => {
        const { userId, location } = data;
        
        try {
            // Update captain location in database
            await captainModel.findByIdAndUpdate(userId, {
                location: { lat: location.lat, lng: location.lng }
            });

            // Broadcast to all users (they'll filter by their ride)
            socket.broadcast.emit('captain-location-update', { 
                captainId: userId, 
                location 
            });
        } catch (error) {
            console.error('Error updating captain location:', error);
        }
    });

    // Disconnect handling
    socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);

        try {
            // Update captain status to offline when they disconnect
            await captainModel.findOneAndUpdate(
                { socketId: socket.id },
                { status: 'offline', socketId: null }
            );

            // Clear socket ID for users
            await userModel.findOneAndUpdate(
                { socketId: socket.id },
                { socketId: null }
            );
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    });
});

// Make io available to other modules
app.set('io', io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});