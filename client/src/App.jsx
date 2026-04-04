import { useState } from 'react';
import LobbyScreen from './components/LobbyScreen';
import WaitingRoom from './components/WaitingRoom';
import GameScreen from './components/GameScreen';

export default function App() {
  const [screen, setScreen] = useState('lobby');
  const [gameData, setGameData] = useState(null);
  const [roleReveal, setRoleReveal] = useState(null);

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

  if (screen === 'role' && roleReveal) {
    const isImposter = roleReveal.role === 'imposter';
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>YOUR ROLE IS...</p>
        <h1 style={{ color: isImposter ? 'red' : 'green', fontSize: '32px' }}>
          {isImposter ? 'IMPOSTER' : 'CIVILIAN'}
        </h1>
        <p>{isImposter ? 'SABOTAGE THE CODE!' : 'FIX ALL THE BUGS!'}</p>
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
        />
      )}
    </>
  );
}
