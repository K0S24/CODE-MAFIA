import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import '../styles/pixel.css';

export default function WaitingRoom({ roomCode, players: initialPlayers, isHost, myId, onGameStart }) {
  const [players, setPlayers] = useState(initialPlayers);

  const socket = useSocket({
    lobby_update: ({ players: updated }) => setPlayers(updated),
    game_started: ({ code, players: gamePlayers }) => onGameStart({ code, players: gamePlayers }),
    role_assigned: ({ role }) => sessionStorage.setItem('myRole', role),
  });

  return (
    <div className="screen outdoor-screen">
      <div className="sky-clouds">
        <div className="pixel-cloud" style={{ width: 100, height: 32, top: '10%', animation: 'cloud-drift 26s linear infinite', animationDelay: '-5s' }} />
        <div className="pixel-cloud" style={{ width: 72, height: 28, top: '30%', animation: 'cloud-drift 34s linear infinite', animationDelay: '-18s' }} />
        <div className="pixel-cloud" style={{ width: 112, height: 36, top: '18%', animation: 'cloud-drift 20s linear infinite', animationDelay: '-3s' }} />
        <div className="pixel-cloud" style={{ width: 60, height: 22, top: '45%', animation: 'cloud-drift 28s linear infinite', animationDelay: '-14s' }} />
      </div>
      <h1 className="pixel-title" style={{ marginBottom: '8px' }}>WAITING ROOM</h1>
      <p style={{ fontFamily: 'Press Start 2P', fontSize: '20px', color: '#FFCC00', marginBottom: '32px', letterSpacing: '6px' }}>{roomCode}</p>

      <div className="pixel-panel" style={{ width: '100%', maxWidth: '380px', marginBottom: '24px' }}>
        <p style={{ fontSize: '9px', color: '#FFCC00', marginBottom: '14px' }}>PLAYERS ({players.length}/5)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {players.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', border: `2px solid ${p.color}`, fontSize: '9px' }}>
              <div style={{ width: '10px', height: '10px', background: p.color, border: '2px solid #000', flexShrink: 0 }} />
              <span style={{ color: '#fff' }}>{p.username}</span>
              {p.isHost && <span style={{ color: '#FFCC00', marginLeft: 'auto', fontSize: '7px' }}>HOST</span>}
              {p.id === myId && <span style={{ color: '#888', fontSize: '7px' }}>(YOU)</span>}
            </div>
          ))}
        </div>
      </div>

      {isHost ? (
        players.length < 3
          ? <p style={{ fontSize: '8px', color: '#888' }}>NEED {3 - players.length} MORE PLAYERS</p>
          : <button className="pixel-btn pixel-btn-green" style={{ fontSize: '12px' }} onClick={() => socket.emit('start_game', { roomCode })}>START GAME</button>
      ) : (
        <p className="blink" style={{ fontSize: '8px', color: '#888' }}>WAITING FOR HOST...</p>
      )}
    </div>
  );
}
