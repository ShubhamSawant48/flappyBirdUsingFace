import React from "react";

const GameUI = ({
  gameState,
  modelsLoaded,
  username,
  setUsername,
  onStart,
  loadingText = "Loading AI models..." // Default fallback
}) => {
  const handleStartClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          onStart(stream);
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {gameState !== "running" && modelsLoaded && (
        <button
          onClick={handleStartClick}
          className="w-full px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {gameState === "over" ? "Play Again" : "Start Game"}
        </button>
      )}
      {gameState !== "running" && (
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-slate-400 text-white-900"
        />
      )}
      
      {/* Dynamic Loading Text */}
      {gameState !== "running" && !modelsLoaded && (
        <div className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
          <span className="text-blue-600 font-medium">
            {loadingText}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameUI;