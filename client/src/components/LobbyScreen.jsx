import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import SkyBackdrop from './SkyBackdrop';
import '../styles/pixel.css';

export default function LobbyScreen({ onLobbyJoined }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // useSocket manages the listener lifecycle (registered once, removed on
  // unmount, always calling the latest handlers) — no manual once/off.
  const socket = useSocket({
    lobby_created: ({ roomCode: created, players }) => {
      setBusy(false);
      onLobbyJoined({ roomCode: created, players, isHost: true, myId: socket.id, username: username.trim() });
    },
    lobby_update: ({ players }) => {
      if (!busy) return; // only our own in-flight join attempt counts
      setBusy(false);
      onLobbyJoined({ roomCode: roomCode.toUpperCase(), players, isHost: false, myId: socket.id, username: username.trim() });
    },
    error: ({ message }) => {
      setBusy(false);
      setError(message.toUpperCase());
    },
  });

  function handleCreate() {
    if (busy) return;
    if (!username.trim()) { setError('ENTER A USERNAME'); return; }
    setError('');
    setBusy(true);
    socket.emit('create_lobby', { username: username.trim() });
  }

  function handleJoin() {
    if (busy) return;
    if (!username.trim()) { setError('ENTER A USERNAME'); return; }
    if (!roomCode.trim()) { setError('ENTER A ROOM CODE'); return; }
    setError('');
    setBusy(true);
    socket.emit('join_lobby', { username: username.trim(), roomCode: roomCode.toUpperCase() });
  }

  return (
    <div className="screen sky-screen sky-sunset">
      <SkyBackdrop
        moon={{ top: '5%', left: '50%', marginLeft: '-160px' }}
        clouds={[
          { w: 96, h: 32, top: '12%', drift: 22, delay: -2 },
          { w: 64, h: 24, top: '28%', drift: 30, delay: -12 },
          { w: 120, h: 36, top: '8%', drift: 38, delay: -22 },
          { w: 80, h: 28, top: '40%', drift: 25, delay: -8 },
        ]}
        sparkles={[
          { top: '18%', left: '12%' },
          { top: '10%', right: '20%', animationDelay: '-1.2s' },
          { top: '38%', left: '28%', animationDelay: '-0.6s' },
          { top: '30%', right: '10%', animationDelay: '-1.8s' },
        ]}
      />
      <h1 className="pixel-title pixel-title-3d pixel-title-3d-purple bounce" style={{ marginBottom: '40px' }}>CODE MAFIA</h1>

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
            <button className="pixel-btn pixel-btn-green" onClick={handleCreate} disabled={busy} style={{ opacity: busy ? 0.6 : 1 }}>{busy ? 'CREATING...' : 'CREATE'}</button>
            <button className="pixel-btn pixel-btn-gray" onClick={() => setMode(null)}>BACK</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input className="pixel-input" placeholder="ENTER USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} />
            <input className="pixel-input" placeholder="ROOM CODE" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={4} />
            {error && <p style={{ color: '#FF4444', fontSize: '8px', textAlign: 'center' }}>{error}</p>}
            <button className="pixel-btn pixel-btn-green" onClick={handleJoin} disabled={busy} style={{ opacity: busy ? 0.6 : 1 }}>{busy ? 'JOINING...' : 'JOIN'}</button>
            <button className="pixel-btn pixel-btn-gray" onClick={() => setMode(null)}>BACK</button>
          </div>
        )}
      </div>
    </div>
  );
}
