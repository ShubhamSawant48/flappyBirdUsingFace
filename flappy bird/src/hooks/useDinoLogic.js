import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

// ✅ LEVELS: Speed and cactus gap change per level
const LEVELS = {
  easy:   { gameSpeed: 4,  minGap: 700, maxGap: 900,  label: '🟢 Easy'   },
  medium: { gameSpeed: 7,  minGap: 500, maxGap: 700,  label: '🟡 Medium' },
  hard:   { gameSpeed: 11, minGap: 300, maxGap: 500,  label: '🔴 Hard'   },
};

const GRAVITY = 0.6;
const JUMP_VELOCITY = -13;

export const useDinoLogic = (difficulty = 'easy') => {
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  const dinoY = useRef(0);
  const velocityY = useRef(0);
  const cactusX = useRef(1200);
  const frameRef = useRef(null);
  const usernameRef = useRef('');
  const scoreRef = useRef(0);
  const difficultyRef = useRef(difficulty);

  // Keep difficulty ref in sync
  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const refreshLeaderboard = useCallback(async () => {
    const data = await fetchLeaderboard('dino');
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

    const { gameSpeed, minGap, maxGap } = LEVELS[difficultyRef.current];

    velocityY.current += GRAVITY;
    dinoY.current += velocityY.current;

    if (dinoY.current > 0) {
      dinoY.current = 0;
      velocityY.current = 0;
    }

    cactusX.current -= gameSpeed;

    if (cactusX.current < -50) {
      // Gap between cacti depends on difficulty
      cactusX.current = minGap + Math.random() * (maxGap - minGap);
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
      postScore(usernameRef.current, scoreRef.current, 'dino').then(refreshLeaderboard);
      return;
    }

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, refreshLeaderboard]);

  const startGame = useCallback((username) => {
    dinoY.current = 0;
    velocityY.current = 0;
    cactusX.current = 1200;
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

  return {
    gameState,
    score,
    dinoY,
    cactusX,
    leaderboard,
    startGame,
    jump,
    currentLevel: LEVELS[difficulty].label,
  };
};