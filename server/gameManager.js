const gameStates = {};

function startGame(roomCode, lobby) {
  if (!lobby) return { success: false, message: 'Lobby not found' };
  if (lobby.players.length < 3) return { success: false, message: 'Need at least 3 players' };

  const players = [...lobby.players];
  const imposterIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => { p.role = i === imposterIndex ? 'imposter' : 'civilian'; });

  gameStates[roomCode] = { players };

  return { success: true, players };
}

module.exports = { startGame };
