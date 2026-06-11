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
const ALLOWED_ORIGINS = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174']
  : ['http://localhost:5173', 'http://localhost:5174'];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
  },
});

// Never include roles in player lists sent to clients — each player only
// learns their own role via 'role_assigned'.
function publicPlayers(players) {
  return players.map(({ id, username, color, isHost }) => ({ id, username, color, isHost }));
}

function sanitizeUsername(username) {
  return typeof username === 'string' ? username.trim().slice(0, 12) : '';
}

// Remove the socket from whatever lobby/game it is in and notify the room.
function leaveEverything(socket) {
  const info = lobbyManager.removePlayer(socket.id);
  if (!info) return;
  socket.leave(info.roomCode);
  if (info.empty) {
    gameManager.endGame(info.roomCode);
    return;
  }
  io.to(info.roomCode).emit('lobby_update', { players: publicPlayers(info.players) });
  const gameInfo = gameManager.removePlayer(info.roomCode, socket.id);
  if (!gameInfo) return;
  if (gameInfo.gameOver) {
    io.to(info.roomCode).emit('game_over', gameInfo.gameOver);
    return;
  }
  // game continues with a smaller roster; voided ballots may be re-cast
  io.to(info.roomCode).emit('game_roster', { players: publicPlayers(gameInfo.players) });
  gameInfo.resetVoters.forEach((voterId) => io.to(voterId).emit('vote_reset'));
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('create_lobby', ({ username } = {}) => {
    const name = sanitizeUsername(username);
    if (!name) {
      socket.emit('error', { message: 'Invalid username' });
      return;
    }
    leaveEverything(socket);
    const room = lobbyManager.createLobby(socket.id, name);
    socket.join(room.code);
    socket.emit('lobby_created', { roomCode: room.code, players: publicPlayers(room.players) });
  });

  socket.on('join_lobby', ({ username, roomCode } = {}) => {
    const name = sanitizeUsername(username);
    const code = typeof roomCode === 'string' ? roomCode.trim().toUpperCase() : '';
    if (!name) {
      socket.emit('error', { message: 'Invalid username' });
      return;
    }
    // validate BEFORE leaveEverything so a rejected join has no side effects
    const lobby = lobbyManager.getLobby(code);
    if (!lobby) {
      socket.emit('error', { message: 'Lobby not found' });
      return;
    }
    if (lobby.players.length >= 5) {
      socket.emit('error', { message: 'Lobby is full' });
      return;
    }
    if (gameManager.isActive(code)) {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }
    leaveEverything(socket);
    const result = lobbyManager.joinLobby(socket.id, name, code);
    if (!result.success) {
      socket.emit('error', { message: result.message });
      return;
    }
    socket.join(code);
    io.to(code).emit('lobby_update', { players: publicPlayers(result.players) });
  });

  socket.on('start_game', ({ roomCode } = {}) => {
    const lobby = lobbyManager.getLobby(roomCode);
    if (!lobby || lobby.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game' });
      return;
    }
    const result = gameManager.startGame(roomCode, lobby, () => {
      if (gameManager.startVoting(roomCode)) io.to(roomCode).emit('voting_started', {});
    });
    if (!result.success) {
      socket.emit('error', { message: result.message });
      return;
    }
    result.players.forEach((player) => {
      io.to(player.id).emit('role_assigned', { role: player.role });
    });
    io.to(roomCode).emit('game_started', {
      code: result.code,
      players: publicPlayers(result.players),
      duration: result.duration,
    });
  });

  socket.on('code_change', ({ roomCode, code } = {}) => {
    if (typeof code !== 'string') return;
    if (!gameManager.isInGame(roomCode, socket.id)) return;
    gameManager.updateCode(roomCode, code);
    socket.to(roomCode).emit('code_update', { code, userId: socket.id });
  });

  socket.on('cursor_move', ({ roomCode, line } = {}) => {
    if (!Number.isInteger(line) || line < 1) return;
    if (!gameManager.isInGame(roomCode, socket.id)) return;
    socket.to(roomCode).emit('cursor_update', { userId: socket.id, line });
  });

  socket.on('chat_message', ({ roomCode, message } = {}) => {
    const player = lobbyManager.getPlayer(roomCode, socket.id);
    if (!player) return;
    const text = typeof message === 'string' ? message.trim().slice(0, 200) : '';
    if (!text) return;
    io.to(roomCode).emit('chat_update', { userId: socket.id, username: player.username, message: text, color: player.color });
  });

  socket.on('call_vote', ({ roomCode } = {}) => {
    if (!gameManager.isInGame(roomCode, socket.id)) return;
    const player = lobbyManager.getPlayer(roomCode, socket.id);
    if (gameManager.startVoting(roomCode)) {
      io.to(roomCode).emit('voting_started', { calledBy: player?.username });
    }
  });

  socket.on('cast_vote', ({ roomCode, targetId } = {}, ack) => {
    const { accepted, result } = gameManager.castVote(roomCode, socket.id, targetId);
    if (typeof ack === 'function') ack({ ok: accepted });
    if (result) io.to(roomCode).emit('game_over', result);
  });

  socket.on('leave_lobby', () => {
    leaveEverything(socket);
  });

  socket.on('disconnect', () => {
    leaveEverything(socket);
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
