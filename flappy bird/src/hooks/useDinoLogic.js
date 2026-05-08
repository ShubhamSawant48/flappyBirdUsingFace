import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

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

  // ✅ FIX 1: gameState ref so gameLoop never needs gameState as a dependency
  const gameStateRef = useRef('waiting');

  // ✅ FIX 2: refreshLeaderboard ref so gameLoop never needs it as a dependency  
  const refreshLeaderboardRef = useRef(null);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const refreshLeaderboard = useCallback(async () => {
    const data = await fetchLeaderboard('dino');
    setLeaderboard(data);
  }, []);

  // Keep ref in sync
  useEffect(() => {
    refreshLeaderboardRef.current = refreshLeaderboard;
  }, [refreshLeaderboard]);

  useEffect(() => { refreshLeaderboard(); }, [refreshLeaderboard]);

  // ✅ FIX 2: jump reads from ref — never stale, no deps needed
  const jump = useCallback(() => {
    if (gameStateRef.current === 'running' && dinoY.current >= -5) {
      velocityY.current = JUMP_VELOCITY;
    }
  }, []); // empty deps — always fresh via ref

  // ✅ FIX 1: gameLoop has empty deps — created ONCE, never recreated
  // Reads everything from refs so rAF chain runs uninterrupted every frame
  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== 'running') return;

    const { gameSpeed, minGap, maxGap } = LEVELS[difficultyRef.current];

    velocityY.current += GRAVITY;
    dinoY.current += velocityY.current;

    if (dinoY.current > 0) {
      dinoY.current = 0;
      velocityY.current = 0;
    }

    cactusX.current -= gameSpeed;

    if (cactusX.current < -50) {
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
      gameStateRef.current = 'over';
      setGameState('over');
      postScore(usernameRef.current, scoreRef.current, 'dino')
        .then(() => refreshLeaderboardRef.current?.());
      return;
    }

    frameRef.current = requestAnimationFrame(gameLoop);
  }, []); // ✅ empty deps — stable forever, zero stutter

  const startGame = useCallback((username) => {
    dinoY.current = 0;
    velocityY.current = 0;
    cactusX.current = 1200;
    scoreRef.current = 0;
    setScore(0);
    usernameRef.current = username;
    gameStateRef.current = 'running';
    setGameState('running');
  }, []);

  useEffect(() => {
    if (gameState === 'running') {
      frameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
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