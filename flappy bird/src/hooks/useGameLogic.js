// src/hooks/useGameLogic.js

import { useState, useRef, useCallback, useEffect } from 'react';
import { postScore, fetchLeaderboard } from '../api';

// --- Game Constants ---
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 170; // We'll keep the gap constant
const GRAVITY = 25;
const JUMP_HEIGHT = 60;

// --- NEW: Difficulty Settings for Moving Pipes ---
const BASE_PIPE_SPEED = 3;     // Horizontal speed of pipes
const LEVEL_2_SCORE = 7;
const LEVEL_3_SCORE = 14;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, running, over
  const [score, setScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(SCREEN_HEIGHT / 2);
  const [leaderboard, setLeaderboard] = useState([]);
  const [level, setLevel] = useState(1);

  const gameLoopIntervalRef = useRef(null);
  const pipePosition = useRef(SCREEN_WIDTH);
  const pipeHeight = useRef(0); // This will now be dynamic
  const birdVelocity = useRef(0);
  const usernameRef = useRef('');

  // --- NEW: Refs for pipe movement ---
  const pipeVerticalSpeed = useRef(0);
  const pipeVerticalDirection = useRef(1); // 1 for down, -1 for up
  const pipeMovementBounds = useRef({ top: 50, bottom: SCREEN_HEIGHT - PIPE_GAP - 50 }); // How far pipes can move

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
    await postScore(usernameRef.current, score); 
    await refreshLeaderboard();
  }, [score, refreshLeaderboard]);

  const gameLoop = useCallback(() => {
    birdVelocity.current += GRAVITY / 100;
    const newBirdPosition = birdPosition + birdVelocity.current;

    // 1. Move pipe horizontally
    pipePosition.current -= BASE_PIPE_SPEED; 

    // --- NEW: 2. Move pipe vertically if it's a moving pipe ---
    if (pipeVerticalSpeed.current > 0) {
        // Update pipeHeight
        pipeHeight.current += (pipeVerticalSpeed.current * pipeVerticalDirection.current);

        // Check bounds and reverse direction
        if (pipeHeight.current >= pipeMovementBounds.current.bottom) {
            pipeVerticalDirection.current = -1; // Move up
        } else if (pipeHeight.current <= pipeMovementBounds.current.top) {
            pipeVerticalDirection.current = 1; // Move down
        }
    }
    // --- End of new logic ---


    // 3. Check if pipe is off-screen
    if (pipePosition.current < -PIPE_WIDTH) {
      pipePosition.current = SCREEN_WIDTH;
      
      // Generate new pipe height
      pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
      
      setScore(prev => {
        const newScore = prev + 1;
        
        // --- NEW: Set difficulty for the *next* pipe ---
        if (newScore >= LEVEL_3_SCORE) { 
            setLevel(3);
            pipeVerticalSpeed.current = 1.5; // Level 3: Faster movement
        } else if (newScore >= LEVEL_2_SCORE) {
            setLevel(2);
            pipeVerticalSpeed.current = 0.8; // Level 2: Slow movement
        }
        // --- End of new logic ---

        return newScore;
      });
    }

    // 4. Collision Detection
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

    // 5. Update bird position
    setBirdPosition(newBirdPosition);
  }, [birdPosition, handleGameOver]); // Removed 'level' as setScore handles it

  // --- NEW: Reset difficulty on game start ---
  const startGame = useCallback((username) => {
    setBirdPosition(SCREEN_HEIGHT / 2);
    pipePosition.current = SCREEN_WIDTH;
    pipeHeight.current = Math.floor(Math.random() * (SCREEN_HEIGHT - PIPE_GAP));
    birdVelocity.current = 0;
    setScore(0);
    usernameRef.current = username; 
    
    // --- Reset all difficulty logic ---
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
    level, // Return level so you can display it in the UI
  };
};