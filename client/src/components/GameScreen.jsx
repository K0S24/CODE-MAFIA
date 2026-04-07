import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import CodeEditor from './CodeEditor';
import ChatBox from './ChatBox';
import VotingScreen from './VotingScreen';

const GAME_DURATION = 180;

export default function GameScreen({ roomCode, initialCode, players, myId, onVoteResult, onGameOver }) {
  const [code, setCode] = useState(initialCode);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showVoting, setShowVoting] = useState(false);

  const [playerCursors, setPlayerCursors] = useState({});

  const socket = useSocket({
    code_update: ({ code: newCode }) => setCode(newCode),
    cursor_update: ({ userId, line }) => setPlayerCursors((prev) => ({ ...prev, [userId]: line })),
    vote_result: (result) => onVoteResult(result),
    game_over: (data) => onGameOver(data),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setShowVoting(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCodeChange(newCode) {
    setCode(newCode);
    socket.emit('code_change', { roomCode, code: newCode, userId: myId });
  }

  function handleCursorChange(line) {
    socket.emit('cursor_move', { roomCode, userId: myId, line });
  }

  const myRole = sessionStorage.getItem('myRole') || 'civilian';
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (showVoting) {
    return <VotingScreen roomCode={roomCode} players={players} myId={myId} />;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 16px', background: '#1e1e1e', borderBottom: '2px solid #333', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ color: '#fff' }}>IT MAFIA</span>
        <span style={{ color: '#888' }}>ROOM: {roomCode}</span>
        <span style={{ color: myRole === 'imposter' ? 'red' : 'green' }}>ROLE: {myRole.toUpperCase()}</span>
        <span style={{ color: timeLeft <= 30 ? 'red' : '#FFCC00', marginLeft: 'auto' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <button onClick={() => setShowVoting(true)} style={{ padding: '6px 12px', background: 'red', color: '#fff', border: 'none', cursor: 'pointer' }}>
          CALL VOTE
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <CodeEditor code={code} onChange={handleCodeChange} onCursorChange={handleCursorChange} players={players} myId={myId} playerCursors={playerCursors} />
        <ChatBox roomCode={roomCode} myId={myId} />
      </div>
    </div>
  );
}
