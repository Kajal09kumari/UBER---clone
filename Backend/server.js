const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Attach io instance to the express app so controllers can access it
app.set('io', io);

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

        // Captain accepts a ride — forward to the specific user room
        socket.on('acceptRide', ({ rideId, userId, captain }) => {
            if (!userId) return;
            // emit to user room
            io.to(`user:${userId}`).emit('rideAccepted', { rideId, captain });
        });

        // Captain periodically sends driver location updates
        socket.on('driverLocation', ({ userId, location }) => {
            if (!userId) return;
            io.to(`user:${userId}`).emit('driverLocation', { location });
        });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

server.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
});