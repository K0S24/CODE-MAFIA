import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';
import '../styles/pixel.css';

export default function VotingScreen({ roomCode, players, myId }) {
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const socket = getSocket();

  function castVote() {
    if (!selectedId) return;
    socket.emit('cast_vote', { roomCode, voterId: myId, targetId: selectedId });
    setVoted(true);
  }

  return (
    <div className="screen">
      <h1 className="pixel-title" style={{ color: '#FF4444', marginBottom: '8px' }}>VOTING TIME</h1>
      <p style={{ fontSize: '8px', color: '#888', marginBottom: '32px' }}>WHO IS THE IMPOSTER?</p>

      <div className="pixel-panel" style={{ width: '100%', maxWidth: '380px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {players.filter((p) => p.id !== myId).map((p) => (
            <div
              key={p.id}
              onClick={() => !voted && setSelectedId(p.id)}
              style={{
                padding: '10px 14px',
                border: `3px solid ${selectedId === p.id ? '#FFCC00' : p.color}`,
                cursor: voted ? 'default' : 'pointer',
                background: selectedId === p.id ? '#2a2a1e' : '#111',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ width: '10px', height: '10px', background: p.color, border: '2px solid #000' }} />
              <span style={{ color: '#fff', fontSize: '9px' }}>{p.username}</span>
              {selectedId === p.id && <span style={{ color: '#FFCC00', fontSize: '7px', marginLeft: 'auto' }}>SELECTED</span>}
            </div>
          ))}
        </div>
      </div>

      {!voted
        ? <button className="pixel-btn pixel-btn-red" onClick={castVote} disabled={!selectedId} style={{ opacity: selectedId ? 1 : 0.5 }}>VOTE</button>
        : <p className="blink" style={{ fontSize: '9px', color: '#FFCC00' }}>VOTE CAST! WAITING...</p>
      }
    </div>
  );
}
