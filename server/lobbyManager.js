const PLAYER_COLORS = ['#FF4444', '#4488FF', '#44CC44', '#FFCC00', '#CC44FF'];

const lobbies = {};

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function createLobby(socketId, username) {
  let code;
  do { code = generateCode(); } while (lobbies[code]);

  const player = { id: socketId, username, color: PLAYER_COLORS[0], isHost: true, role: null };
  lobbies[code] = { code, players: [player], hostId: socketId, code_content: '' };
  return lobbies[code];
}

function joinLobby(socketId, username, roomCode) {
  const lobby = lobbies[roomCode];
  if (!lobby) return { success: false, message: 'Lobby not found' };
  if (lobby.players.length >= 5) return { success: false, message: 'Lobby is full' };

  const color = PLAYER_COLORS[lobby.players.length];
  const player = { id: socketId, username, color, isHost: false, role: null };
  lobby.players.push(player);
  return { success: true, players: lobby.players };
}

function removePlayer(socketId) {
  for (const code in lobbies) {
    const lobby = lobbies[code];
    const index = lobby.players.findIndex((p) => p.id === socketId);
    if (index !== -1) {
      lobby.players.splice(index, 1);
      if (lobby.players.length === 0) {
        delete lobbies[code];
        return null;
      }
      if (lobby.hostId === socketId && lobby.players.length > 0) {
        lobby.players[0].isHost = true;
        lobby.hostId = lobby.players[0].id;
      }
      return { roomCode: code, players: lobby.players };
    }
  }
  return null;
}

function getLobby(roomCode) {
  return lobbies[roomCode] || null;
}

function getPlayer(roomCode, playerId) {
  const lobby = lobbies[roomCode];
  if (!lobby) return null;
  return lobby.players.find((p) => p.id === playerId) || null;
}

module.exports = { createLobby, joinLobby, removePlayer, getLobby, getPlayer };
