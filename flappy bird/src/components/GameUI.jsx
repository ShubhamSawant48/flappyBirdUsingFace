import React from 'react';

const GameUI = ({ gameState, modelsLoaded, username, setUsername, onStart }) => {
  
  const handleStartClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          onStart(stream);
        })
        .catch(err => console.error("Error accessing webcam:", err));
    }
  };

  return (
    <>
      {gameState !== 'running' && modelsLoaded && (
        <button onClick={handleStartClick} style={styles.button}>
          {gameState === 'over' ? 'Play Again' : 'Start Game'}
        </button>
      )}
      {gameState !== 'running' && (
        <div style={styles.usernameContainer}>
          <input
            type="text"
            placeholder="Enter Name for Leaderboard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
      )}
    </>
  );
};

const styles = {
    button: {
        padding: '15px 30px',
        fontSize: '1.2em',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    usernameContainer: {
        marginTop: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '1em',
        width: '250px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
};

export default GameUI;
