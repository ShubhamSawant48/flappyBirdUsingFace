import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

const GRAVITY = 0.6; 
const JUMP_VELOCITY = -13; 
const GAME_SPEED = 5; 

export const useDinoLogic = () => {
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const dinoY = useRef(0);
  const velocityY = useRef(0);
  const cactusX = useRef(1200); // CRITICAL FIX: Gives you ~3.5 seconds to get ready!
  const frameRef = useRef(null);
  const usernameRef = useRef('');
  const scoreRef = useRef(0); 

  const refreshLeaderboard = useCallback(async () => {
    const data = await fetchLeaderboard();
    setLeaderboard(data);
  }, []);

  useEffect(() => { refreshLeaderboard(); }, [refreshLeaderboard]);

  const jump = useCallback(() => {
    if (gameState === 'running' && dinoY.current >= -5) {
      velocityY.current = JUMP_VELOCITY;
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'running') return;

    velocityY.current += GRAVITY;
    dinoY.current += velocityY.current;

    if (dinoY.current > 0) {
      dinoY.current = 0;
      velocityY.current = 0;
    }

    cactusX.current -= GAME_SPEED;
    
    // Reset Cactus closer once the game is actually flowing
    if (cactusX.current < -50) {
      cactusX.current = 600 + Math.random() * 200; 
      scoreRef.current += 10;
      setScore(scoreRef.current);
    }

    const hitCactus = (
      cactusX.current < 110 && 
      cactusX.current > 40 && 
      dinoY.current > -30 
    );

    if (hitCactus) {
      setGameState('over');
      postScore(usernameRef.current, scoreRef.current).then(refreshLeaderboard);
      return; 
    }

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, refreshLeaderboard]);

  const startGame = useCallback((username) => {
    dinoY.current = 0;
    velocityY.current = 0;
    cactusX.current = 1200; // Reset to the big delay every time you hit play!
    scoreRef.current = 0;
    setScore(0);
    usernameRef.current = username;
    setGameState('running');
  }, []);

  useEffect(() => {
    if (gameState === 'running') {
      frameRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(frameRef.current);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, gameLoop]);

  return { gameState, score, dinoY, cactusX, leaderboard, startGame, jump };
};