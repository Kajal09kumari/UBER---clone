const http = require('http');
const app = require('./app');
const { initSocket } = require('./socket');
const port = process.env.PORT || 3000;



const server = http.createServer(app);
// initialize Socket.io on the same HTTP server
initSocket(server);




server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});