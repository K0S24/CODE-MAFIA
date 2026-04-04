import { useState } from 'react';
import LobbyScreen from './components/LobbyScreen';
import WaitingRoom from './components/WaitingRoom';

export default function App() {
  const [screen, setScreen] = useState('lobby');
  const [gameData, setGameData] = useState(null);

  function handleLobbyJoined({ roomCode, players, isHost, myId, username }) {
    setGameData({ roomCode, players, isHost, myId, username });
    setScreen('waiting');
  }

  function handleGameStart({ code, players }) {
    setGameData((prev) => ({ ...prev, initialCode: code, players }));
    setScreen('game');
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
      {screen === 'game' && <p>Game coming soon...</p>}
    </>
  );
}
