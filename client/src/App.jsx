import { useState } from 'react';
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

  useSocket({
    game_over: (data) => {
      setResultData({ ...data, players: gameData?.players });
      setScreen('result');
    },
  });

  function handleLobbyJoined({ roomCode, players, isHost, myId, username }) {
    setGameData({ roomCode, players, isHost, myId, username });
    setScreen('waiting');
  }

  function handleGameStart({ code, players }) {
    const role = sessionStorage.getItem('myRole') || 'civilian';
    setGameData((prev) => ({ ...prev, initialCode: code, players }));
    setRoleReveal({ role });
    setScreen('role');
    setTimeout(() => {
      setRoleReveal(null);
      setScreen('game');
    }, 3000);
  }

  function handleVoteResult(result) {
    setResultData({ ...result, players: gameData?.players });
    setScreen('result');
  }

  function handlePlayAgain() {
    sessionStorage.removeItem('myRole');
    setScreen('lobby');
    setGameData(null);
    setResultData(null);
  }

  if (screen === 'role' && roleReveal) {
    const isImposter = roleReveal.role === 'imposter';
    return (
      <div className="screen" style={{ textAlign: 'center' }}>
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
          isHost={gameData.isHost}
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
          onVoteResult={handleVoteResult}
          onGameOver={(data) => {
            setResultData({ ...data, players: gameData.players });
            setScreen('result');
          }}
        />
      )}
      {screen === 'result' && resultData && (
        <ResultScreen
          winner={resultData.winner}
          imposter={resultData.imposter}
          players={resultData.players}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
