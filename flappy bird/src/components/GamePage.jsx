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
  const [countdown, setCountdown] = useState(null); 
  const [isWaitingForFace, setIsWaitingForFace] = useState(false); 

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

  const { modelsLoaded, detectionReady, videoRef, faceBoxCanvasRef } = useFaceApi(
    jump,
    isDetecting
  );

  // ✅ FIXED: Unified AI Model Tracker
  useEffect(() => {
    if (sessionStorage.getItem("active_ai_model") !== "faceapi") {
      sessionStorage.setItem("active_ai_model", "faceapi");
      window.location.reload(); // Micro-refresh to clear Handpose memory
    }
  }, []);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      // Do NOT set videoRef.current.srcObject = null here, it breaks face-api!
      console.log("🎥 Flappy camera stream released.");
    }
  };

  const handleStart = async (stream) => {
    stopCurrentStream();
    streamRef.current = stream;

    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;

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

    try {
      await videoRef.current.play();
    } catch (e) {
      console.warn("Video play caught:", e.message);
    }

    setIsDetecting(true);
    setIsWaitingForFace(true); 
  };

  useEffect(() => {
    if (isWaitingForFace && detectionReady) {
      setIsWaitingForFace(false); 
      setCountdown(3); 
    }
  }, [isWaitingForFace, detectionReady]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      startGame(username); 
      setCountdown(null);
    }
  }, [countdown, startGame, username]);

  useEffect(() => {
    if (gameState === "over") {
      setIsDetecting(false);
      stopCurrentStream();
      setIsWaitingForFace(false);
    }
  }, [gameState]);

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
            
            {/* ✅ SCANNING FOR FACE UI */}
            {isWaitingForFace && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-40 gap-4">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xl font-bold text-white tracking-widest animate-pulse">
                  Scanning Face...
                </span>
              </div>
            )}

            {/* ✅ COUNTDOWN OVERLAY UI */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
                <span className="text-6xl font-extrabold text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-pulse">
                  {countdown}
                </span>
              </div>
            )}
            {countdown === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent z-40">
                <span className="text-5xl font-extrabold text-white drop-shadow-lg animate-ping">
                  GO!
                </span>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="w-full max-w-[420px]">
            {/* Hide Start UI during scanning & countdown */}
            {!isWaitingForFace && countdown === null && (
              <GameUI
                gameState={gameState}
                modelsLoaded={modelsLoaded}
                username={username}
                setUsername={setUsername}
                onStart={handleStart}
                loadingText="Loading Face Detection..."
              />
            )}
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