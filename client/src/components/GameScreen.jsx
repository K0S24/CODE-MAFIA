import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import CodeEditor from './CodeEditor';

export default function GameScreen({ roomCode, initialCode, players, myId }) {
  const [code, setCode] = useState(initialCode);

  const socket = useSocket({
    code_update: ({ code: newCode }) => setCode(newCode),
  });

  function handleCodeChange(newCode) {
    setCode(newCode);
    socket.emit('code_change', { roomCode, code: newCode, userId: myId });
  }

  const myRole = sessionStorage.getItem('myRole') || 'civilian';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 16px', background: '#1e1e1e', borderBottom: '2px solid #333', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ color: '#fff' }}>IT MAFIA</span>
        <span style={{ color: '#888' }}>ROOM: {roomCode}</span>
        <span style={{ color: myRole === 'imposter' ? 'red' : 'green' }}>
          ROLE: {myRole.toUpperCase()}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          players={players}
          myId={myId}
        />
      </div>
    </div>
  );
}
