import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';

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
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2 style={{ color: 'red' }}>VOTING TIME</h2>
      <p>WHO IS THE IMPOSTER?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '24px auto' }}>
        {players.filter((p) => p.id !== myId).map((p) => (
          <div
            key={p.id}
            onClick={() => !voted && setSelectedId(p.id)}
            style={{
              padding: '10px 16px',
              border: `2px solid ${selectedId === p.id ? '#FFCC00' : p.color}`,
              cursor: voted ? 'default' : 'pointer',
              background: selectedId === p.id ? '#222' : '#111',
              color: p.color,
            }}
          >
            {p.username} {selectedId === p.id ? '✓' : ''}
          </div>
        ))}
      </div>

      {!voted ? (
        <button
          onClick={castVote}
          disabled={!selectedId}
          style={{ padding: '10px 24px', background: 'red', color: '#fff', border: 'none', cursor: selectedId ? 'pointer' : 'default', opacity: selectedId ? 1 : 0.5 }}
        >
          VOTE
        </button>
      ) : (
        <p>VOTE CAST! WAITING FOR OTHERS...</p>
      )}
    </div>
  );
}
