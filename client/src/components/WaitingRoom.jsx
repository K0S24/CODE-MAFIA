import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import SkyBackdrop from './SkyBackdrop';
import '../styles/pixel.css';

export default function WaitingRoom({ roomCode, players: initialPlayers, myId, onGameStart }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [notice, setNotice] = useState('');

  const socket = useSocket({
    lobby_update: ({ players: updated }) => setPlayers(updated),
    game_started: onGameStart,
    role_assigned: ({ role }) => sessionStorage.setItem('myRole', role),
    error: ({ message }) => setNotice(message.toUpperCase()),
  });

  // derive from the live list so a host transfer (original host left)
  // immediately shows the start button to the promoted player
  const isHost = !!players.find((p) => p.id === myId)?.isHost;

  return (
    <div className="screen sky-screen sky-sunset">
      <SkyBackdrop
        clouds={[
          { w: 100, h: 32, top: '10%', drift: 26, delay: -5 },
          { w: 72, h: 28, top: '30%', drift: 34, delay: -18 },
          { w: 112, h: 36, top: '18%', drift: 20, delay: -3 },
          { w: 60, h: 22, top: '45%', drift: 28, delay: -14 },
        ]}
        sparkles={[
          { top: '14%', left: '16%' },
          { top: '24%', right: '12%', animationDelay: '-0.9s' },
          { top: '36%', left: '34%', animationDelay: '-1.6s' },
        ]}
      />
      <h1 className="pixel-title pixel-title-3d pixel-title-3d-purple" style={{ marginBottom: '8px' }}>WAITING ROOM</h1>
      <p style={{ fontFamily: 'Press Start 2P', fontSize: '20px', color: '#FFCC00', marginBottom: '32px', letterSpacing: '6px', textShadow: '3px 3px 0 #000' }}>{roomCode}</p>

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
          ? <p style={{ fontSize: '8px', color: '#fff', textShadow: '2px 2px 0 #000' }}>NEED {3 - players.length} MORE PLAYERS</p>
          : <button className="pixel-btn pixel-btn-green" style={{ fontSize: '12px' }} onClick={() => socket.emit('start_game', { roomCode })}>START GAME</button>
      ) : (
        <p className="blink" style={{ fontSize: '8px', color: '#fff', textShadow: '2px 2px 0 #000' }}>WAITING FOR HOST...</p>
      )}
      {notice && (
        <p style={{ fontSize: '8px', color: '#FF8866', marginTop: '14px', textShadow: '2px 2px 0 #000' }}>{notice}</p>
      )}
    </div>
  );
}
