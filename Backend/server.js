const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./services/socket.service');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});