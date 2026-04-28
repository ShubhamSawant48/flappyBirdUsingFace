import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 170;
const GRAVITY = 25;
const JUMP_HEIGHT = 60;

const BASE_PIPE_SPEED = 3;
const LEVEL_2_SCORE = 7;
const LEVEL_3_SCORE = 14;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(SCREEN_HEIGHT / 2);
  const [leaderboard, setLeaderboard] = useState([]);
  const [level, setLevel] = useState(1);

  const gameLoopIntervalRef = useRef(null);
  const pipePosition = useRef(SCREEN_WIDTH);
  const pipeHeight = useRef(0);
  const birdVelocity = useRef(0);
  const usernameRef = useRef('');

  const pipeVerticalSpeed = useRef(0);
  const pipeVerticalDirection = useRef(1);
  const pipeMovementBounds = useRef({ top: 50, bottom: SCREEN_HEIGHT - PIPE_GAP - 50 });

  const refreshLeaderboard = useCallback(async () => {
    // ✅ FIX: fetch only flappy scores
    const data = await fetchLeaderboard('flappy');
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

  const handleGameOver = useCallback(async () => {
    setGameState('over');
    // ✅ FIX: pass 'flappy' as the game identifier
    await postScore(usernameRef.current, score, 'flappy');
    await refreshLeaderboard();
  }, [score, refreshLeaderboard]);

  const gameLoop = useCallback(() => {
    birdVelocity.current += GRAVITY / 100;
    const newBirdPosition = birdPosition + birdVelocity.current;

    pipePosition.current -= BASE_PIPE_SPEED;

    if (pipeVerticalSpeed.current > 0) {
      pipeHeight.current += (pipeVerticalSpeed.current * pipeVerticalDirection.current);
      if (pipeHeight.current >= pipeMovementBounds.current.bottom) {
        pipeVerticalDirection.current = -1;
      } else if (pipeHeight.current <= pipeMovementBounds.current.top) {
        pipeVerticalDirection.current = 1;
      }
    }

    if (pipePosition.current < -PIPE_WIDTH) {
      pipePosition.current = SCREEN_WIDTH;
      pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore >= LEVEL_3_SCORE) {
          setLevel(3);
          pipeVerticalSpeed.current = 1.5;
        } else if (newScore >= LEVEL_2_SCORE) {
          setLevel(2);
          pipeVerticalSpeed.current = 0.8;
        }
        return newScore;
      });
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
      handleGameOver();
      return;
    }

    setBirdPosition(newBirdPosition);
  }, [birdPosition, handleGameOver]);

  const startGame = useCallback((username) => {
    setBirdPosition(SCREEN_HEIGHT / 2);
    pipePosition.current = SCREEN_WIDTH;
    pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
    birdVelocity.current = 0;
    setScore(0);
    usernameRef.current = username;

    setLevel(1);
    pipeVerticalSpeed.current = 0;
    pipeVerticalDirection.current = 1;

    setGameState('running');
  }, []);

  useEffect(() => {
    if (gameState === 'running') {
      gameLoopIntervalRef.current = setInterval(gameLoop, 20);
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
    jump,
    level,
  };
};