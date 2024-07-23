const fs = require('fs');
const https = require('https');
const express = require('express');
const { Server } = require('socket.io');

const app = express();

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const server_https = https.createServer(options, app);

const io = new Server(server_https, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true); // Allow all origins
    },
    credentials: true
  },
  transports: ['websocket'],
  debug: true
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send an echo message every second
  const interval = setInterval(() => {
    socket.emit('echo', 'Hello from server');
  }, 1000);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clearInterval(interval);
  });
});



server_https.listen(8080, () => {
  console.log('HTTPS server listening on port 3000');
});

