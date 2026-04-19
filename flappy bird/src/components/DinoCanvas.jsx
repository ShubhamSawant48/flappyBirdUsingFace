import React, { useRef, useEffect } from "react";

const DinoCanvas = ({ dinoY, cactusX, score, gameState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const render = () => {
      // 1. Clear the old frame
      ctx.clearRect(0, 0, 600, 300);

      // 2. Draw Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 300);

      // 3. Draw Sun & Clouds
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(500, 50, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "40px Arial";
      ctx.fillText("☁️", 100, 60);
      ctx.fillText("☁️", 350, 90);

      // 4. Draw Ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, 240, 600, 60);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(0, 240, 600, 10);

      // 5. Draw Dino 🦖 
      ctx.font = "50px Arial";
      ctx.fillText("🦖", 80, 240 + dinoY.current);

      // 6. Draw Cactus 🌵 (Now you will see it moving!)
      ctx.font = "50px Arial";
      ctx.fillText("🌵", cactusX.current, 245);

      // 7. Draw Score
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${score}`, 20, 40);

      // 8. "Get Ready" Message
      if (gameState === "running" && cactusX.current > 600) {
        ctx.fillStyle = "#d97706";
        ctx.textAlign = "center";
        ctx.font = "bold 36px Arial";
        ctx.fillText("Get Ready! ✊", 300, 150);
        ctx.textAlign = "left";
      }

      // 9. Game Over Message
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

      // Constantly loop this drawing function
      animationId = requestAnimationFrame(render);
    };

    // Start the loop
    render();

    // Clean up
    return () => cancelAnimationFrame(animationId);
  }, [gameState, score]); // Update when state changes

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