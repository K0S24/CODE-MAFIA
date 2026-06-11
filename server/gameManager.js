const codeTemplates = require('./codeTemplates');

const GAME_DURATION_SECONDS = 180;

const gameStates = {};

function startGame(roomCode, lobby, onTimeUp) {
  if (!lobby) return { success: false, message: 'Lobby not found' };
  if (lobby.players.length < 3) return { success: false, message: 'Need at least 3 players' };
  if (gameStates[roomCode]) return { success: false, message: 'Game already running' };

  const players = [...lobby.players];
  const imposterIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => { p.role = i === imposterIndex ? 'imposter' : 'civilian'; });

  const code = codeTemplates.getRandom();
  gameStates[roomCode] = {
    code,
    votes: {},
    players,
    voting: false,
    // the server owns the round timer; clients only display a countdown
    timer: setTimeout(onTimeUp, GAME_DURATION_SECONDS * 1000),
  };

  return { success: true, code, players, duration: GAME_DURATION_SECONDS };
}

function updateCode(roomCode, code) {
  if (gameStates[roomCode]) gameStates[roomCode].code = code;
}

function isActive(roomCode) {
  return !!gameStates[roomCode];
}

function isInGame(roomCode, socketId) {
  const state = gameStates[roomCode];
  return !!state && state.players.some((p) => p.id === socketId);
}

function startVoting(roomCode) {
  const state = gameStates[roomCode];
  if (!state || state.voting) return false;
  state.voting = true;
  clearTimeout(state.timer);
  return true;
}

// Returns { accepted, result } — `accepted` tells the voter whether their
// ballot counted (acked back to the client), `result` is the game_over
// payload once the final ballot lands.
function castVote(roomCode, voterId, targetId) {
  const state = gameStates[roomCode];
  if (!state || !state.voting) return { accepted: false, result: null };
  if (state.votes[voterId] || voterId === targetId) return { accepted: false, result: null };
  const isPlayer = (id) => state.players.some((p) => p.id === id);
  if (!isPlayer(voterId) || !isPlayer(targetId)) return { accepted: false, result: null };

  state.votes[voterId] = targetId;
  return { accepted: true, result: resolveIfComplete(roomCode) };
}

function resolveIfComplete(roomCode) {
  const state = gameStates[roomCode];
  if (!state || Object.keys(state.votes).length < state.players.length) return null;

  const tally = {};
  Object.values(state.votes).forEach((id) => {
    tally[id] = (tally[id] || 0) + 1;
  });

  const max = Math.max(...Object.values(tally));
  const top = Object.keys(tally).filter((id) => tally[id] === max);
  const eliminated = top.length === 1 ? top[0] : null; // tie: nobody is ejected

  const imposter = state.players.find((p) => p.role === 'imposter');
  const wasImposter = eliminated !== null && eliminated === imposter?.id;

  endGame(roomCode);
  return {
    eliminated,
    wasImposter,
    tie: top.length > 1,
    winner: wasImposter ? 'civilians' : 'imposter',
    imposter: imposter?.id,
  };
}

// A player left mid-game. Returns null if they weren't in this game,
// { gameOver } if their departure ends it, or { players, resetVoters }
// when the game continues: `players` is the updated roster and
// `resetVoters` are players whose ballot targeted the leaver and may
// now vote again.
function removePlayer(roomCode, socketId) {
  const state = gameStates[roomCode];
  if (!state) return null;
  const index = state.players.findIndex((p) => p.id === socketId);
  if (index === -1) return null;

  const leaver = state.players[index];
  state.players.splice(index, 1);
  delete state.votes[socketId];

  // ballots cast FOR the leaver are void — those players vote again
  const resetVoters = Object.keys(state.votes).filter((voterId) => state.votes[voterId] === socketId);
  resetVoters.forEach((voterId) => { delete state.votes[voterId]; });

  if (leaver.role === 'imposter') {
    endGame(roomCode);
    return { gameOver: { eliminated: null, wasImposter: false, tie: false, winner: 'civilians', imposter: socketId } };
  }
  if (state.players.length < 2) {
    const imposter = state.players.find((p) => p.role === 'imposter');
    endGame(roomCode);
    return { gameOver: { eliminated: null, wasImposter: false, tie: false, winner: 'imposter', imposter: imposter?.id } };
  }
  const result = resolveIfComplete(roomCode);
  if (result) return { gameOver: result };
  return { players: state.players, resetVoters };
}

function endGame(roomCode) {
  const state = gameStates[roomCode];
  if (!state) return;
  clearTimeout(state.timer);
  delete gameStates[roomCode];
}

module.exports = { startGame, updateCode, isActive, isInGame, startVoting, castVote, removePlayer, endGame };
