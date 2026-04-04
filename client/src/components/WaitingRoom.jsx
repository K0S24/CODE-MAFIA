import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function WaitingRoom({ roomCode, players: initialPlayers, isHost, myId, onGameStart }) {
  const [players, setPlayers] = useState(initialPlayers);

  const socket = useSocket({
    lobby_update: ({ players: updated }) => setPlayers(updated),
    game_started: ({ code, players: gamePlayers }) => onGameStart({ code, players: gamePlayers }),
    role_assigned: ({ role }) => {
      sessionStorage.setItem('myRole', role);
    },
  });

  function handleStart() {
    socket.emit('start_game', { roomCode });
  }

  return (
    <div>
      <h2>WAITING ROOM</h2>
      <p>ROOM CODE: <strong>{roomCode}</strong></p>

      <div>
        <p>PLAYERS ({players.length}/5):</p>
        {players.map((p) => (
          <div key={p.id} style={{ color: p.color }}>
            {p.username} {p.isHost ? '(HOST)' : ''} {p.id === myId ? '(YOU)' : ''}
          </div>
        ))}
      </div>

      {isHost ? (
        players.length < 3
          ? <p>NEED {3 - players.length} MORE PLAYERS</p>
          : <button onClick={handleStart}>START GAME</button>
      ) : (
        <p>WAITING FOR HOST TO START...</p>
      )}
    </div>
  );
}
