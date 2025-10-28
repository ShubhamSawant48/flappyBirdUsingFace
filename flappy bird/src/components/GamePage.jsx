import React, { useEffect, useState } from "react";
import { useGameLogic } from "../hooks/useGameLogic.js";
import { useFaceApi } from "../hooks/useFaceApi.js";
import GameCanvas from "./GameCanvas.jsx";
import Leaderboard from "./Leaderboard.jsx";
import WebcamView from "./WebcamView.jsx";
import GameUI from "./GameUI.jsx";

function GamePage() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState("");
  const [highScore, setHighScore] = useState(0);

  const {
    gameState,
    score,
    birdPosition,
    pipePosition,
    pipeHeight,
    leaderboard,
    startGame,
    jump,
  } = useGameLogic();

  const { modelsLoaded, videoRef, faceBoxCanvasRef } = useFaceApi(
    jump,
    isDetecting
  );

  const handleStart = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      startGame();
      setIsDetecting(true);
    }
  };

  // Update high score locally
  useEffect(() => {
    if (score > 0 && score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // Sync with leaderboard
  useEffect(() => {
    const leaderboardMax = Math.max(
      ...(leaderboard || []).map((l) => l.score),
      0
    );
    setHighScore((prev) => Math.max(prev, leaderboardMax));
  }, [leaderboard]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-sky-100 py-6 px-4">
      <div className="container mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 items-start">
        {/* --- LEFT SECTION (Camera, Score, Leaderboard) --- */}
        <div className="flex py-10 flex-col items-center justify-between gap-6 order-2 lg:order-1 w-full">
          {/* Camera Feed */}
          
            <div className="relative w-full max-w-[420px] aspect-video bg-black border border-slate-300 rounded-2xl overflow-hidden shadow-lg">
              <WebcamView ref={videoRef} faceBoxCanvasRef={faceBoxCanvasRef} />
            </div>

            {/* Game Controls (Play Button + Input) */}
            <div className="w-full max-w-[420px]">
              <GameUI
                gameState={gameState}
                modelsLoaded={modelsLoaded}
                username={username}
                setUsername={setUsername}
                onStart={handleStart}
              />
            </div>
          

          {/* Score Cards */}
          <div className="w-full max-w-[420px] grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white shadow-sm p-5 text-center">
              <p className="text-gray-500 text-sm">Current Score</p>
              <h3 className="text-3xl font-bold text-sky-600">{score}</h3>
            </div>
            <div className="rounded-xl border bg-white shadow-sm p-5 text-center">
              <p className="text-gray-500 text-sm">Best Score</p>
              <h3 className="text-3xl font-bold text-emerald-600">
                {highScore}
              </h3>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="w-full max-w-[420px] rounded-2xl border bg-white p-5 shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              🏆 Leaderboard
            </h2>
            <ul className="divide-y divide-gray-200">
              {(leaderboard || []).slice(0, 10).map((entry, idx) => (
                <li
                  key={entry._id || idx}
                  className="flex justify-between py-2 text-gray-700"
                >
                  <span>
                    {idx + 1}. {entry.name}
                  </span>
                  <span className="font-semibold text-sky-600">
                    {entry.score}
                  </span>
                </li>
              ))}
              {(!leaderboard || leaderboard.length === 0) && (
                <li className="py-3 text-gray-500 italic">
                  No scores yet — be the first!
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* --- RIGHT SECTION (Game Canvas) --- */}
        <div className="flex flex-col items-center gap-6 order-1 lg:order-2 w-full">
          <h1 className="text-4xl font-extrabold text-sky-700 drop-shadow-sm tracking-wide">
            Flappy Face
          </h1>

          <div className="relative w-full max-w-[500px] aspect-square border border-slate-900 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-b from-sky-100 to-green-100">
            <GameCanvas
              birdPosition={birdPosition}
              pipePosition={pipePosition}
              pipeHeight={pipeHeight}
              score={score}
              gameState={gameState}
            />
          </div>

          <p className="text-gray-500 text-sm italic text-center">
            🎮 Flap using your face — keep flying, break your best score!
          </p>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
