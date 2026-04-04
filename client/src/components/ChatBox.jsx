import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function ChatBox({ roomCode, myId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const socket = useSocket({
    chat_update: ({ userId, username, message, color }) => {
      setMessages((prev) => [...prev, { userId, username, message, color }]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    socket.emit('chat_message', { roomCode, userId: myId, message: input.trim() });
    setInput('');
  }

  function handleKey(e) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div style={{ width: '200px', display: 'flex', flexDirection: 'column', borderLeft: '2px solid #333', background: '#111' }}>
      <div style={{ padding: '6px 10px', borderBottom: '1px solid #333', color: '#4488FF', fontSize: '11px' }}>
        CHAT
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ fontSize: '10px', wordBreak: 'break-word' }}>
            <span style={{ color: msg.color }}>{msg.userId === myId ? 'YOU' : msg.username}: </span>
            <span style={{ color: '#ccc' }}>{msg.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #333' }}>
        <input
          style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: 'none', padding: '6px 8px', fontSize: '10px', outline: 'none' }}
          placeholder="TYPE..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          maxLength={80}
        />
        <button
          style={{ background: '#4488FF', color: '#fff', border: 'none', padding: '6px 10px', cursor: 'pointer', fontSize: '10px' }}
          onClick={sendMessage}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
