const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle WebRTC offer
  socket.on('offer', (offer) => {
    console.log('Received offer:', offer);
    socket.broadcast.emit('offer', offer); // Forward the offer to other clients
  });

  // Handle WebRTC answer
  socket.on('answer', (answer) => {
    console.log('Received answer:', answer);
    socket.broadcast.emit('answer', answer); // Forward the answer to the client who sent the offer
  });

  // Handle ICE candidates
  socket.on('ice-candidate', (candidate) => {
    console.log('Received ICE candidate:', candidate);
    socket.broadcast.emit('ice-candidate', candidate); // Forward the ICE candidates to other peers
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
