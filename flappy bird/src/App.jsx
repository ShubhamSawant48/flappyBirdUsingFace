import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Game Constants ---
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 25;
const JUMP_HEIGHT = 60; // UPDATED at Line 13: Reverted to a discrete jump height

function App() {
  // --- State Management ---
  const [birdPosition, setBirdPosition] = useState(SCREEN_HEIGHT / 2);
  const [gameState, setGameState] = useState('waiting'); // waiting, running, over
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState('');

  // --- Refs for direct DOM/value access ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  const gameLoopIntervalRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const pipePosition = useRef(SCREEN_WIDTH);
  const pipeHeight = useRef(0);
  const birdVelocity = useRef(0);
  const canJumpRef = useRef(true); // UPDATED at Line 38: Re-introduced for jump cooldown

  // --- API Endpoint ---
  const API_URL = 'http://localhost:5000/api/leaderboard';

  // --- Model Loading ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        if (!window.faceapi) {
          console.error("FaceAPI script not loaded yet.");
          return;
        }
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
        console.log("FaceAPI models loaded successfully.");
      } catch (error) {
        console.error("Error loading FaceAPI models:", error);
      }
    };
    if (window.faceapi) {
        loadModels();
    } else {
        const script = document.getElementById('faceapi-script');
        script.addEventListener('load', loadModels);
    }
  }, []);

  // --- Leaderboard Fetching ---
  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // --- Game Mechanics ---
  // UPDATED at Lines 91-93: The discrete jump function has been added back.
  const jump = useCallback(() => {
    birdVelocity.current = -JUMP_HEIGHT / 10;
  }, []);

  const resetGame = useCallback(() => {
    setBirdPosition(SCREEN_HEIGHT / 2);
    pipePosition.current = SCREEN_WIDTH;
    pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
    birdVelocity.current = 0;
    setScore(0);
    setGameState('running');
  }, []);

  const startGame = () => {
    if (gameState !== 'running') {
      resetGame();
      handleVideoPlay();
    }
  };

  const handleGameOver = useCallback(async () => {
    setGameState('over');
    setIsDetecting(false);
    clearInterval(detectionIntervalRef.current);
    // Clear the face box canvas on game over
    const canvas = faceBoxCanvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (score > highScore) {
      setHighScore(score);
    }
    if (username && score > 0) {
      try {
        await axios.post(API_URL, { name: username, score });
        fetchLeaderboard();
      } catch (error) {
        console.error("Failed to post score", error);
      }
    }
  }, [score, highScore, username, fetchLeaderboard]);

  // --- Game Loop ---
  const gameLoop = useCallback(() => {
    // UPDATED BLOCK from Line 147 to 152: Physics reverted to only apply gravity.
    // Bird physics
    birdVelocity.current += GRAVITY / 100; // Gravity always pulls the bird down
    const newBirdPosition = birdPosition + birdVelocity.current;

    // Pipe movement
    pipePosition.current -= 3;
    if (pipePosition.current < -PIPE_WIDTH) {
      pipePosition.current = SCREEN_WIDTH;
      pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
      setScore(prev => prev + 1);
    }

    // Collision detection
    const birdTop = newBirdPosition - BIRD_HEIGHT / 2;
    const birdBottom = newBirdPosition + BIRD_HEIGHT / 2;
    const birdLeft = SCREEN_WIDTH / 4 - BIRD_WIDTH / 2;
    const birdRight = SCREEN_WIDTH / 4 + BIRD_WIDTH / 2;

    const pipeTop = pipeHeight.current;
    const pipeBottom = pipeHeight.current + PIPE_GAP;
    const pipeLeft = pipePosition.current;
    const pipeRight = pipePosition.current + PIPE_WIDTH;

    const hitTopPipe = birdLeft < pipeRight && birdRight > pipeLeft && birdTop < pipeTop;
    const hitBottomPipe = birdLeft < pipeRight && birdRight > pipeLeft && birdBottom > pipeBottom;
    const hitGround = birdBottom > SCREEN_HEIGHT;
    const hitCeiling = birdTop < 0;

    if (hitTopPipe || hitBottomPipe || hitGround || hitCeiling) {
      handleGameOver();
      return;
    }

    setBirdPosition(newBirdPosition);
  }, [birdPosition, handleGameOver]);

  useEffect(() => {
    if (gameState === 'running') {
      gameLoopIntervalRef.current = setInterval(gameLoop, 20);
    } else {
      clearInterval(gameLoopIntervalRef.current);
    }
    return () => clearInterval(gameLoopIntervalRef.current);
  }, [gameState, gameLoop]);

  // --- Face Detection Logic ---
  // UPDATED BLOCK from Line 202 to 218: Re-implemented jump with cooldown for rhythmic jumping.
  const handleVideoPlay = () => {
    setIsDetecting(true);
    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

        const canvas = faceBoxCanvasRef.current;
        const displaySize = { width: 120, height: 90 }; // Match video size
        if (canvas) {
          window.faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (resizedDetections) {
            window.faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        }
        
        // If smiling and can jump, then jump and start cooldown
        if (detections && detections.expressions.happy > 0.15) {
          if (canJumpRef.current) {
            jump();
            canJumpRef.current = false;
            setTimeout(() => {
              canJumpRef.current = true;
            }, 250); // 400ms cooldown creates the jump-fall rhythm
          }
        }
      }
    }, 80);
  };

  // --- Canvas Drawing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(
      SCREEN_WIDTH / 4 - BIRD_WIDTH / 2,
      birdPosition - BIRD_HEIGHT / 2,
      BIRD_WIDTH,
      BIRD_HEIGHT
    );
    
    // Draw eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(SCREEN_WIDTH / 4 + BIRD_WIDTH / 4, birdPosition, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pipes
    ctx.fillStyle = '#008000'; // Green
    // Top pipe
    ctx.fillRect(pipePosition.current, 0, PIPE_WIDTH, pipeHeight.current);
    // Bottom pipe
    ctx.fillRect(
      pipePosition.current,
      pipeHeight.current + PIPE_GAP,
      PIPE_WIDTH,
      SCREEN_HEIGHT - pipeHeight.current - PIPE_GAP
    );

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(score, 20, 40);

    // Game Over message
    if (gameState === 'over') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = '40px Arial';
      ctx.fillText('Game Over', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40);
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      ctx.fillText('Click Start to Play Again', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 40);
      ctx.textAlign = 'left';
    }
  }, [birdPosition, score, gameState]);

  // --- JSX Rendering ---
  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        <h1 style={styles.title}>Flappy Face</h1>
        <div style={{ position: 'relative', width: SCREEN_WIDTH, height: SCREEN_HEIGHT, border: '2px solid black' }}>
            <canvas ref={canvasRef} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />
            <canvas ref={faceBoxCanvasRef} style={styles.faceBoxCanvas} /> 
            <video ref={videoRef} autoPlay muted style={styles.video} playsInline></video>
        </div>
        {!isDetecting && modelsLoaded && (
          <button onClick={() => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  navigator.mediaDevices.getUserMedia({ video: true })
                      .then(stream => {
                          if (videoRef.current) {
                              videoRef.current.srcObject = stream;
                              startGame();
                          }
                      })
                      .catch(err => console.error("Error accessing webcam:", err));
              }
          }} style={styles.button}>
            Start Game
          </button>
        )}
        {gameState !== 'running' && (
          <div style={styles.usernameContainer}>
            <input
              type="text"
              placeholder="Enter Your Name for Leaderboard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
        )}
      </div>
      <div style={styles.leaderboardContainer}>
        <h2 style={styles.leaderboardTitle}>🏆 Global Leaderboard 🏆</h2>
        <ul style={styles.leaderboardList}>
          {leaderboard.map((entry, index) => (
            <li key={entry._id || index} style={styles.leaderboardItem}>
              <span>{index + 1}. {entry.name}</span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>
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
    video: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '120px',
        height: '90px',
        border: '2px solid white',
        borderRadius: '8px',
        transform: 'scaleX(-1)', // Mirror effect
    },
    faceBoxCanvas: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '120px',
        height: '90px',
        transform: 'scaleX(-1)', // Mirror effect to match video
    },
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
    leaderboardContainer: {
        width: '300px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    leaderboardTitle: {
        textAlign: 'center',
        color: '#333',
    },
    leaderboardList: {
        listStyle: 'none',
        padding: 0,
    },
    leaderboardItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #eee',
    }
};

export default App;

