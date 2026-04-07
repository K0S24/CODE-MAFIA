import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';
import '../styles/pixel.css';

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
    <div className="screen outdoor-screen">
      <div className="sky-clouds">
        <div className="pixel-cloud" style={{ width: 96, height: 32, top: '12%', animation: 'cloud-drift 22s linear infinite', animationDelay: '0s' }} />
        <div className="pixel-cloud" style={{ width: 64, height: 24, top: '28%', animation: 'cloud-drift 30s linear infinite', animationDelay: '-12s' }} />
        <div className="pixel-cloud" style={{ width: 120, height: 36, top: '8%', animation: 'cloud-drift 38s linear infinite', animationDelay: '-22s' }} />
        <div className="pixel-cloud" style={{ width: 80, height: 28, top: '40%', animation: 'cloud-drift 25s linear infinite', animationDelay: '-8s' }} />
      </div>
      <h1 className="pixel-title bounce" style={{ marginBottom: '40px' }}>CODE MAFIA</h1>

      <div className="pixel-panel" style={{ width: '100%', maxWidth: '380px' }}>
        {!mode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input className="pixel-input" placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
            {error && <p style={{ color: '#FF4444', fontSize: '8px', textAlign: 'center' }}>{error}</p>}
            <button className="pixel-btn pixel-btn-yellow" onClick={() => { setError(''); setMode('create'); }}>CREATE LOBBY</button>
            <button className="pixel-btn pixel-btn-blue" onClick={() => { setError(''); setMode('join'); }}>JOIN LOBBY</button>
          </div>
        ) : mode === 'create' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input className="pixel-input" placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
            {error && <p style={{ color: '#FF4444', fontSize: '8px', textAlign: 'center' }}>{error}</p>}
            <button className="pixel-btn pixel-btn-green" onClick={handleCreate}>CREATE</button>
            <button className="pixel-btn pixel-btn-gray" onClick={() => setMode(null)}>BACK</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input className="pixel-input" placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
            <input className="pixel-input" placeholder="ROOM CODE" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={4} />
            {error && <p style={{ color: '#FF4444', fontSize: '8px', textAlign: 'center' }}>{error}</p>}
            <button className="pixel-btn pixel-btn-green" onClick={handleJoin}>JOIN</button>
            <button className="pixel-btn pixel-btn-gray" onClick={() => setMode(null)}>BACK</button>
          </div>
        )}
      </div>
    </div>
  );
}
