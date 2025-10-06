import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

// --- Game Constants ---
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 25;
const JUMP_HEIGHT = 60;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, running, over
  const [score, setScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(SCREEN_HEIGHT / 2);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const gameLoopIntervalRef = useRef(null);
  const pipePosition = useRef(SCREEN_WIDTH);
  const pipeHeight = useRef(0);
  const birdVelocity = useRef(0);

  const refreshLeaderboard = useCallback(async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
  }, []);

  useEffect(() => {
      refreshLeaderboard();
  }, [refreshLeaderboard]);

  const jump = useCallback(() => {
    if (gameState === 'running') {
      birdVelocity.current = -JUMP_HEIGHT / 10;
    }
  }, [gameState]);

  const handleGameOver = useCallback(async (username) => {
    setGameState('over');
    await postScore(username, score);
    await refreshLeaderboard();
  }, [score, refreshLeaderboard]);

  const gameLoop = useCallback((username) => {
    birdVelocity.current += GRAVITY / 100;
    const newBirdPosition = birdPosition + birdVelocity.current;

    pipePosition.current -= 3;
    if (pipePosition.current < -PIPE_WIDTH) {
      pipePosition.current = SCREEN_WIDTH;
      pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
      setScore(prev => prev + 1);
    }

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
      handleGameOver(username);
      return;
    }

    setBirdPosition(newBirdPosition);
  }, [birdPosition, handleGameOver]);

  const startGame = useCallback(() => {
    setBirdPosition(SCREEN_HEIGHT / 2);
    pipePosition.current = SCREEN_WIDTH;
    pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
    birdVelocity.current = 0;
    setScore(0);
    setGameState('running');
  }, []);

  useEffect(() => {
    let usernameForLoop = ''; // Pass a stable username to the loop
    if (gameState === 'running') {
      gameLoopIntervalRef.current = setInterval(() => gameLoop(usernameForLoop), 20);
    } else {
      clearInterval(gameLoopIntervalRef.current);
    }
    return () => clearInterval(gameLoopIntervalRef.current);
  }, [gameState, gameLoop]);

  return {
    gameState,
    score,
    birdPosition,
    pipePosition: pipePosition.current,
    pipeHeight: pipeHeight.current,
    leaderboard,
    startGame,
    jump
  };
};
