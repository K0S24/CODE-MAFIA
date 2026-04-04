import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';

export default function LobbyScreen({ onLobbyJoined }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState(null);
  const [error, setError] = useState('');

  const socket = getSocket();

  function handleCreate() {
    if (!username.trim()) { setError('ENTER A USERNAME'); return; }
    socket.once('lobby_created', ({ roomCode, players }) => {
      onLobbyJoined({ roomCode, players, isHost: true, myId: socket.id, username });
    });
    socket.once('error', ({ message }) => setError(message.toUpperCase()));
    socket.emit('create_lobby', { username: username.trim() });
  }

  function handleJoin() {
    if (!username.trim()) { setError('ENTER A USERNAME'); return; }
    if (!roomCode.trim()) { setError('ENTER A ROOM CODE'); return; }
    socket.once('lobby_update', ({ players }) => {
      onLobbyJoined({ roomCode: roomCode.toUpperCase(), players, isHost: false, myId: socket.id, username });
    });
    socket.once('error', ({ message }) => setError(message.toUpperCase()));
    socket.emit('join_lobby', { username: username.trim(), roomCode: roomCode.toUpperCase() });
  }

  return (
    <div>
      <h1>IT MAFIA</h1>
      {!mode ? (
        <div>
          <input placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={() => { setError(''); setMode('create'); }}>CREATE LOBBY</button>
          <button onClick={() => { setError(''); setMode('join'); }}>JOIN LOBBY</button>
        </div>
      ) : mode === 'create' ? (
        <div>
          <input placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleCreate}>CREATE</button>
          <button onClick={() => setMode(null)}>BACK</button>
        </div>
      ) : (
        <div>
          <input placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
          <input placeholder="ROOM CODE" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={4} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleJoin}>JOIN</button>
          <button onClick={() => setMode(null)}>BACK</button>
        </div>
      )}
    </div>
  );
}
