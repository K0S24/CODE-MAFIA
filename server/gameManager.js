const codeTemplates = require('./codeTemplates');

const gameStates = {};

function startGame(roomCode, lobby) {
  if (!lobby) return { success: false, message: 'Lobby not found' };
  if (lobby.players.length < 3) return { success: false, message: 'Need at least 3 players' };

  const players = [...lobby.players];
  const imposterIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => { p.role = i === imposterIndex ? 'imposter' : 'civilian'; });

  const code = codeTemplates.getRandom();
  gameStates[roomCode] = { code, players };

  return { success: true, code, players };
}

function updateCode(roomCode, code) {
  if (gameStates[roomCode]) gameStates[roomCode].code = code;
}

module.exports = { startGame, updateCode };
