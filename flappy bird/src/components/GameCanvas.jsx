import React, { useRef, useEffect } from 'react';

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

const GameCanvas = ({ birdPosition, pipePosition, pipeHeight, score, gameState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw pipes
    ctx.fillStyle = '#008000';
    ctx.fillRect(pipePosition, 0, PIPE_WIDTH, pipeHeight);
    ctx.fillRect(pipePosition, pipeHeight + PIPE_GAP, PIPE_WIDTH, SCREEN_HEIGHT - pipeHeight - PIPE_GAP);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(SCREEN_WIDTH / 4 - BIRD_WIDTH / 2, birdPosition - BIRD_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(SCREEN_WIDTH / 4 + BIRD_WIDTH / 4, birdPosition, 3, 0, 2 * Math.PI);
    ctx.fill();

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
      ctx.fillText('Click Button to Play Again', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 40);
      ctx.textAlign = 'left';
    }
  }, [birdPosition, pipePosition, pipeHeight, score, gameState]);

  return <canvas ref={canvasRef} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />;
};

export default GameCanvas;
