import { useState, useRef } from 'react';
import { useSocket } from './hooks/useSocket';
import LobbyScreen from './components/LobbyScreen';
import WaitingRoom from './components/WaitingRoom';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import './styles/pixel.css';

export default function App() {
  const [screen, setScreen] = useState('lobby');
  const [gameData, setGameData] = useState(null);
  const [roleReveal, setRoleReveal] = useState(null);
  const [resultData, setResultData] = useState(null);
  const revealTimerRef = useRef(null);

  const socket = useSocket({
    game_over: (data) => {
      clearTimeout(revealTimerRef.current);
      setRoleReveal(null);
      setResultData({ ...data, players: gameData?.players });
      setScreen('result');
    },
    // registered app-wide so it can't be missed while the role reveal
    // or any other screen is showing
    voting_started: () => {
      setGameData((prev) => (prev ? { ...prev, voting: true } : prev));
    },
    game_roster: ({ players }) => {
      setGameData((prev) => (prev ? { ...prev, players } : prev));
    },
  });

  function handleLobbyJoined({ roomCode, players, isHost, myId, username }) {
    setGameData({ roomCode, players, isHost, myId, username });
    setScreen('waiting');
  }

  function handleGameStart({ code, players, duration }) {
    const role = sessionStorage.getItem('myRole') || 'civilian';
    // absolute deadline measured from receive time — the countdown stays in
    // sync with the server timer no matter when GameScreen mounts
    const endsAt = Date.now() + (duration ?? 0) * 1000;
    setGameData((prev) => ({ ...prev, initialCode: code, players, endsAt, voting: false }));
    setRoleReveal({ role });
    setScreen('role');
    clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      setRoleReveal(null);
      setScreen('game');
    }, 3000);
  }

  function handlePlayAgain() {
    socket.emit('leave_lobby');
    sessionStorage.removeItem('myRole');
    setScreen('lobby');
    setGameData(null);
    setResultData(null);
  }

  if (screen === 'role' && roleReveal) {
    const isImposter = roleReveal.role === 'imposter';
    return (
      <div className="screen sky-screen sky-dusk" style={{ textAlign: 'center' }}>
        <div className="pixel-panel" style={{ maxWidth: '400px', padding: '40px' }}>
          <p style={{ fontSize: '8px', color: '#888', marginBottom: '24px' }}>YOUR ROLE IS...</p>
          <h1 className="bounce" style={{ fontFamily: 'Press Start 2P', fontSize: '22px', color: isImposter ? '#FF4444' : '#44CC44' }}>
            {isImposter ? 'IMPOSTER' : 'CIVILIAN'}
          </h1>
          <p style={{ fontFamily: 'Press Start 2P', fontSize: '8px', color: '#888', marginTop: '20px' }}>
            {isImposter ? 'SABOTAGE THE CODE!' : 'FIX ALL THE BUGS!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === 'lobby' && <LobbyScreen onLobbyJoined={handleLobbyJoined} />}
      {screen === 'waiting' && gameData && (
        <WaitingRoom
          roomCode={gameData.roomCode}
          players={gameData.players}
          myId={gameData.myId}
          onGameStart={handleGameStart}
        />
      )}
      {screen === 'game' && gameData && (
        <GameScreen
          roomCode={gameData.roomCode}
          initialCode={gameData.initialCode}
          players={gameData.players}
          myId={gameData.myId}
          endsAt={gameData.endsAt}
          voting={!!gameData.voting}
        />
      )}
      {screen === 'result' && resultData && (
        <ResultScreen
          winner={resultData.winner}
          imposter={resultData.imposter}
          players={resultData.players}
          tie={resultData.tie}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
