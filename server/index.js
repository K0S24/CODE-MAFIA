const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const lobbyManager = require('./lobbyManager');
const gameManager = require('./gameManager');

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

  socket.on('start_game', ({ roomCode }) => {
    const result = gameManager.startGame(roomCode, lobbyManager.getLobby(roomCode));
    if (!result.success) {
      socket.emit('error', { message: result.message });
      return;
    }
    result.players.forEach((player) => {
      io.to(player.id).emit('role_assigned', { role: player.role });
    });
    io.to(roomCode).emit('game_started', { code: result.code, players: result.players });
  });

  socket.on('code_change', ({ roomCode, code, userId }) => {
    gameManager.updateCode(roomCode, code);
    socket.to(roomCode).emit('code_update', { code, userId });
  });

  socket.on('chat_message', ({ roomCode, userId, message }) => {
    const player = lobbyManager.getPlayer(roomCode, userId);
    if (!player) return;
    io.to(roomCode).emit('chat_update', { userId, username: player.username, message, color: player.color });
  });

  socket.on('cast_vote', ({ roomCode, voterId, targetId }) => {
    const result = gameManager.castVote(roomCode, voterId, targetId);
    if (!result) return;
    io.to(roomCode).emit('vote_result', { eliminated: result.eliminated, wasImposter: result.wasImposter });
    if (result.gameOver) {
      io.to(roomCode).emit('game_over', { winner: result.winner, imposter: result.imposter });
    }
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
