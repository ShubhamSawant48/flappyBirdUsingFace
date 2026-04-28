import React, { useRef, useEffect } from "react";

const DinoCanvas = ({ dinoY, cactusX, score, gameState, currentLevel }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const render = () => {
      ctx.clearRect(0, 0, 600, 300);

      // 1. Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 300);

      // 2. Sun & Clouds
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(500, 50, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "40px Arial";
      ctx.fillText("☁️", 100, 60);
      ctx.fillText("☁️", 350, 90);

      // 3. Ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, 240, 600, 60);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(0, 240, 600, 10);

      // 4. Dino facing FORWARD — flip canvas horizontally around the dino's position
      // 🦕 faces right by default in emoji, so we mirror it to face left (toward player)
      ctx.save();
      ctx.scale(-1, 1);                          // flip horizontally
      ctx.font = "50px Arial";
      // When flipped, x position becomes negative mirror: -80-50 = -130
      ctx.fillText("🦖", -(80 + 50), 240 + dinoY.current);
      ctx.restore();

      // 5. Cactus
      ctx.font = "50px Arial";
      ctx.fillText("🌵", cactusX.current, 245);

      // 6. Score
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${score}`, 20, 40);

      // 7. Level badge (top right)
      if (currentLevel) {
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "right";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(currentLevel, 580, 40);
        ctx.textAlign = "left";
      }

      // 8. Get Ready message
      if (gameState === "running" && cactusX.current > 600) {
        ctx.fillStyle = "#d97706";
        ctx.textAlign = "center";
        ctx.font = "bold 36px Arial";
        ctx.fillText("Get Ready! ✊", 300, 150);
        ctx.textAlign = "left";
      }

      // 9. Game Over overlay
      if (gameState === "over") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 600, 300);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 40px Arial";
        ctx.fillText("Game Over!", 300, 140);
        ctx.font = "20px Arial";
        ctx.fillText("Check left panel to play again", 300, 180);
        ctx.textAlign = "left";
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [gameState, score, currentLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      className="w-full h-full object-cover rounded-2xl"
    />
  );
};

export default DinoCanvas;