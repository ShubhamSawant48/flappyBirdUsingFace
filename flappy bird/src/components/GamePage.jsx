import React, { useEffect, useState, useRef } from "react";
import { useGameLogic } from "../hooks/useGameLogic.js";
import { useFaceApi } from "../hooks/useFaceApi.js";
import GameCanvas from "./GameCanvas.jsx";
import WebcamView from "./WebcamView.jsx";
import GameUI from "./GameUI.jsx";

function GamePage() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState("");
  const [highScore, setHighScore] = useState(0);

  const streamRef = useRef(null);

  const {
    gameState,
    score,
    birdPosition,
    pipePosition,
    pipeHeight,
    leaderboard,
    startGame,
    jump,
    level,
  } = useGameLogic();

  const { modelsLoaded, videoRef, faceBoxCanvasRef } = useFaceApi(
    jump,
    isDetecting
  );

  // Only stops hardware tracks — does NOT null out srcObject
  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      console.log("🎥 Flappy camera stream released.");
    }
  };

  const handleStart = async (stream) => {
    // Step 1 — kill old stream's hardware tracks first
    stopCurrentStream();

    // Step 2 — store new stream
    streamRef.current = stream;

    if (!videoRef.current) return;

    // Step 3 — assign new stream directly (no null gap)
    videoRef.current.srcObject = stream;

    // Step 4 — wait for metadata before play() to avoid black screen
    await new Promise((resolve) => {
      if (videoRef.current.readyState >= 1) {
        resolve();
        return;
      }
      const timeout = setTimeout(resolve, 3000);
      videoRef.current.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve();
      };
    });

    // Step 5 — safe to play now
    try {
      await videoRef.current.play();
      console.log("▶️ Flappy camera playing.");
    } catch (e) {
      console.warn("Video play caught:", e.message);
    }

    // Step 6 — start game and detection after camera is confirmed live
    startGame(username);
    setIsDetecting(true);
  };

  // Stop camera and detection on game over — same safe pattern as Dino
  useEffect(() => {
    if (gameState === "over") {
      setIsDetecting(false);
      stopCurrentStream();
    }
  }, [gameState]);

  // Release camera when user navigates away from this page
  useEffect(() => {
    const stopOnUnload = () => {
      setIsDetecting(false);
      stopCurrentStream();
    };
    window.addEventListener("beforeunload", stopOnUnload);
    return () => {
      stopOnUnload();
      window.removeEventListener("beforeunload", stopOnUnload);
    };
  }, []);

  useEffect(() => {
    if (score > 0 && score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const leaderboardMax = Math.max(...(leaderboard || []).map((l) => l.score), 0);
    setHighScore((prev) => Math.max(prev, leaderboardMax));
  }, [leaderboard]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
      <div className="container mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 items-start">

        {/* LEFT SECTION */}
        <div className="flex py-10 flex-col items-center justify-between gap-6 order-2 lg:order-1 w-full">

          {/* Camera Feed */}
          <div className="relative w-full max-w-[420px] aspect-video bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
            <WebcamView ref={videoRef} faceBoxCanvasRef={faceBoxCanvasRef} />
          </div>

          {/* Game Controls */}
          <div className="w-full max-w-[420px]">
            <GameUI
              gameState={gameState}
              modelsLoaded={modelsLoaded}
              username={username}
              setUsername={setUsername}
              onStart={handleStart}
              loadingText="Loading Face Detection..."
            />
          </div>

          {/* Score Cards */}
          <div className="w-full max-w-[420px] grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-700 bg-gray-900/60 shadow-lg shadow-black/20 p-5 text-center">
              <p className="text-gray-400 text-sm">Current Score</p>
              <h3 className="text-3xl font-bold text-blue-400">{score}</h3>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-900/60 shadow-lg shadow-black/20 p-5 text-center">
              <p className="text-gray-400 text-sm">Best Score</p>
              <h3 className="text-3xl font-bold text-emerald-400">{highScore}</h3>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="w-full max-w-[420px] rounded-2xl border border-gray-700 bg-gray-900/60 p-5 shadow-lg shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              🏆 Flappy Leaderboard
            </h2>
            <ul className="divide-y divide-gray-800">
              {(leaderboard || []).slice(0, 10).map((entry, idx) => (
                <li key={entry._id || idx} className="flex justify-between py-2 text-gray-300">
                  <span>{idx + 1}. {entry.name}</span>
                  <span className="font-semibold text-blue-400">{entry.score}</span>
                </li>
              ))}
              {(!leaderboard || leaderboard.length === 0) && (
                <li className="py-3 text-gray-500 italic">No scores yet — be the first!</li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-center gap-6 order-1 lg:order-2 w-full">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
            Flappy Face
          </h1>

          <div className="relative w-full max-w-[500px] aspect-square border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-linear-to-b from-slate-900 to-slate-800">
            <GameCanvas
              birdPosition={birdPosition}
              pipePosition={pipePosition}
              pipeHeight={pipeHeight}
              score={score}
              gameState={gameState}
            />
          </div>

          <p className="text-gray-400 text-sm italic text-center">
            🎮 Flap using your face — keep flying, break your best score!
          </p>
        </div>

      </div>
    </div>
  );
}

export default GamePage;