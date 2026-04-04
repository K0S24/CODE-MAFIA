const codeTemplates = require('./codeTemplates');

const gameStates = {};

function startGame(roomCode, lobby) {
  if (!lobby) return { success: false, message: 'Lobby not found' };
  if (lobby.players.length < 3) return { success: false, message: 'Need at least 3 players' };

  const players = [...lobby.players];
  const imposterIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => { p.role = i === imposterIndex ? 'imposter' : 'civilian'; });

  const code = codeTemplates.getRandom();
  gameStates[roomCode] = { code, votes: {}, players };

  return { success: true, code, players };
}

function updateCode(roomCode, code) {
  if (gameStates[roomCode]) gameStates[roomCode].code = code;
}

function castVote(roomCode, voterId, targetId) {
  const state = gameStates[roomCode];
  if (!state) return null;

  state.votes[voterId] = targetId;

  if (Object.keys(state.votes).length < state.players.length) return null;

  const tally = {};
  Object.values(state.votes).forEach((id) => {
    tally[id] = (tally[id] || 0) + 1;
  });

  const eliminated = Object.keys(tally).reduce((a, b) => (tally[a] > tally[b] ? a : b));
  const eliminatedPlayer = state.players.find((p) => p.id === eliminated);
  const wasImposter = eliminatedPlayer?.role === 'imposter';
  const imposter = state.players.find((p) => p.role === 'imposter');

  return {
    eliminated,
    wasImposter,
    gameOver: true,
    winner: wasImposter ? 'civilians' : 'imposter',
    imposter: imposter?.id,
  };
}

module.exports = { startGame, updateCode, castVote };
