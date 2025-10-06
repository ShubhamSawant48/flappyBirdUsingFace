import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic.js';
import { useFaceApi } from './hooks/useFaceApi.js';
import GameCanvas from './components/GameCanvas.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import WebcamView from './components/WebcamView.jsx';
import GameUI from './components/GameUI.jsx';

function App() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState('');
  
  const {
    gameState,
    score,
    birdPosition,
    pipePosition,
    pipeHeight,
    leaderboard,
    startGame,
    jump
  } = useGameLogic();

  const { modelsLoaded, videoRef, faceBoxCanvasRef } = useFaceApi(jump, isDetecting);

  const handleStart = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      startGame();
      setIsDetecting(true);
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        <h1 style={styles.title}>Flappy Face</h1>
        <div style={{ position: 'relative', width: 500, height: 500, border: '2px solid black' }}>
          <GameCanvas 
            birdPosition={birdPosition}
            pipePosition={pipePosition}
            pipeHeight={pipeHeight}
            score={score}
            gameState={gameState}
          />
          <WebcamView ref={videoRef} faceBoxCanvasRef={faceBoxCanvasRef} />
        </div>
        <GameUI 
          gameState={gameState}
          modelsLoaded={modelsLoaded}
          username={username}
          setUsername={setUsername}
          onStart={handleStart}
        />
      </div>
      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
}

// --- Inline Styles ---
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '40px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f8ff',
        minHeight: '100vh',
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '3em',
        color: '#ff4500',
        textShadow: '2px 2px 4px #ccc',
    },
};

export default App;

