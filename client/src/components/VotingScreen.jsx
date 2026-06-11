import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import SkyBackdrop from './SkyBackdrop';
import '../styles/pixel.css';

export default function VotingScreen({ roomCode, players, myId }) {
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('');

  const socket = useSocket({
    // our ballot targeted a player who left — vote again
    vote_reset: () => {
      setVoted(false);
      setSelectedId(null);
      setNotice('YOUR PICK LEFT THE GAME — VOTE AGAIN');
    },
  });

  // if the selected player drops out of the roster, clear the selection
  useEffect(() => {
    if (selectedId && !players.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [players, selectedId]);

  function castVote() {
    if (!selectedId) return;
    socket.emit('cast_vote', { roomCode, targetId: selectedId }, (res) => {
      if (res?.ok) {
        setVoted(true);
        setNotice('');
      } else {
        setVoted(false);
        setSelectedId(null);
        setNotice('VOTE NOT COUNTED — PICK AGAIN');
      }
    });
  }

  return (
    <div className="screen sky-screen sky-dusk">
      <SkyBackdrop
        sparkles={[
          { top: '14%', left: '12%' },
          { top: '22%', right: '14%', animationDelay: '-1.3s' },
        ]}
      />
      <h1 className="pixel-title pixel-title-3d pixel-title-3d-red" style={{ marginBottom: '8px' }}>VOTING TIME</h1>
      <p style={{ fontSize: '8px', color: '#d8b8c8', marginBottom: '32px', textShadow: '2px 2px 0 #000' }}>WHO IS THE IMPOSTER?</p>

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
      {notice && (
        <p style={{ fontSize: '8px', color: '#FF8866', marginTop: '14px', textShadow: '2px 2px 0 #000' }}>{notice}</p>
      )}
    </div>
  );
}
