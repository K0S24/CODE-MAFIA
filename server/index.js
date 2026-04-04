const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const lobbyManager = require('./lobbyManager');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('create_lobby', ({ username }) => {
    const room = lobbyManager.createLobby(socket.id, username);
    socket.join(room.code);
    socket.emit('lobby_created', { roomCode: room.code, players: room.players });
  });

  socket.on('join_lobby', ({ username, roomCode }) => {
    const result = lobbyManager.joinLobby(socket.id, username, roomCode);
    if (!result.success) {
      socket.emit('error', { message: result.message });
      return;
    }
    socket.join(roomCode);
    io.to(roomCode).emit('lobby_update', { players: result.players });
  });

  socket.on('disconnect', () => {
    const info = lobbyManager.removePlayer(socket.id);
    if (info) {
      io.to(info.roomCode).emit('lobby_update', { players: info.players });
    }
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
