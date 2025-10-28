import React, { useRef, useEffect, useState } from "react";

const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

const GameCanvas = ({
  birdPosition,
  pipePosition,
  pipeHeight,
  score,
  gameState,
}) => {
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [birdImg, setBirdImg] = useState(null);
  const [pipeImg, setPipeImg] = useState(null);

  // Load images on component mount
  useEffect(() => {
    const loadImages = () => {
      const bg = new Image();
      bg.src = "/assets/background-day.png";
      bg.onload = () => setBackgroundImg(bg);

      const bird = new Image();
      bird.src = "/assets/bluebird.png";
      bird.onload = () => setBirdImg(bird);

      const pipe = new Image();
      pipe.src = "/assets/pipe-green.png";
      pipe.onload = () => setPipeImg(pipe);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!backgroundImg || !birdImg || !pipeImg) {
      setImagesLoaded(false);
      return;
    }
    setImagesLoaded(true);
  }, [backgroundImg, birdImg, pipeImg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw pipes (top and bottom)
    const topPipeHeight = pipeHeight;
    const bottomPipeHeight = SCREEN_HEIGHT - pipeHeight - PIPE_GAP;

    // Top pipe (flipped vertically)
    ctx.save();
    ctx.translate(pipePosition, 0);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, 0, -topPipeHeight, PIPE_WIDTH, topPipeHeight);
    ctx.restore();

    // Bottom pipe (normal)
    ctx.drawImage(
      pipeImg,
      pipePosition,
      pipeHeight + PIPE_GAP,
      PIPE_WIDTH,
      bottomPipeHeight
    );

    // Draw bird
    if (birdImg) {
      const birdX = SCREEN_WIDTH / 4 - BIRD_WIDTH / 2;
      const birdY = birdPosition - BIRD_HEIGHT / 2;
      ctx.drawImage(birdImg, birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);
    }

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, 20, 40);

    // Game Over message
    if (gameState === "over") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "40px Arial";
      ctx.fillText("Game Over", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 40);
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      ctx.fillText(
        "Click Button to Play Again",
        SCREEN_WIDTH / 2,
        SCREEN_HEIGHT / 2 + 40
      );
      ctx.textAlign = "left";
    }
  }, [
    birdPosition,
    pipePosition,
    pipeHeight,
    score,
    gameState,
    imagesLoaded,
    backgroundImg,
    birdImg,
    pipeImg,
  ]);

  return <canvas ref={canvasRef} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />;
};

export default GameCanvas;
