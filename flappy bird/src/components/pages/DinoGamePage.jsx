import React, { useState, useEffect, useRef } from "react";
import { useDinoLogic } from "../../hooks/useDinoLogic";
import { useHandpose } from "../../hooks/useHandpose";
import DinoCanvas from "../DinoCanvas";
import GameUI from "../GameUI";

function DinoGamePage() {
  // 🛡️ THE SAFE CLEANER — only runs once on mount, prevents faceapi memory leak
  useEffect(() => {
    if (window.faceapi) {
      if (!sessionStorage.getItem("memory_cleaned")) {
        console.log("Face API detected. Refreshing memory ONCE...");
        sessionStorage.setItem("memory_cleaned", "true");
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem("memory_cleaned");
    }
  }, []);

  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState("");
  const [highScore, setHighScore] = useState(0);

  const streamRef = useRef(null);

  const { gameState, score, dinoY, cactusX, leaderboard, startGame, jump } = useDinoLogic();
  const { modelsLoaded, videoRef, canvasRef } = useHandpose(jump, isDetecting);

  // Stops hardware camera tracks only. Does NOT touch videoRef.current.srcObject
  // so there is no null-gap that could crash play().
  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      console.log("🎥 Camera stream released.");
    }
  };

  const handleStart = async (stream) => {
    // Step 1 — kill old hardware tracks before claiming new ones
    stopCurrentStream();

    // Step 2 — store the new stream reference
    streamRef.current = stream;

    if (!videoRef.current) return;

    // Step 3 — assign stream directly (overwrites old srcObject, no null gap)
    videoRef.current.srcObject = stream;

    // Step 4 — wait for the browser to process the stream before calling play()
    // Using a timeout fallback in case loadedmetadata already fired or never fires
    await new Promise((resolve) => {
      // readyState >= 1 means HAVE_METADATA — already ready
      if (videoRef.current.readyState >= 1) {
        resolve();
        return;
      }
      // Otherwise wait for it, with a 3s safety timeout so we never hang
      const timeout = setTimeout(resolve, 3000);
      videoRef.current.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve();
      };
    });

    // Step 5 — now safe to play
    try {
      await videoRef.current.play();
      console.log("▶️ Camera video playing.");
    } catch (err) {
      console.warn("Video play caught:", err.message);
    }

    // Step 6 — start game logic and detection AFTER camera is confirmed live
    startGame(username);
    setIsDetecting(true);
  };

  // ✅ FIXED: Only clean up on 'over' — NOT on 'waiting'.
  // 
  // The previous version also triggered cleanup on 'waiting' (the initial state).
  // This meant: user clicks Start → getUserMedia succeeds → handleStart assigns
  // srcObject → useEffect fires because gameState is still 'waiting' →
  // stopCurrentStream() KILLS the stream we just started → black screen.
  //
  // 'waiting' is the initial idle state before any game has been played.
  // We must NOT release the camera on 'waiting' because the user may be
  // in the middle of starting their first game.
  useEffect(() => {
    if (gameState === "over") {
      setIsDetecting(false);
      stopCurrentStream();
    }
  }, [gameState]);

  // 🛑 Release camera when user navigates away from the page
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
    const leaderboardMax = Math.max(...(leaderboard || []).map((l) => l.score), 0);
    setHighScore((prev) => Math.max(prev, leaderboardMax));
  }, [leaderboard]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
      <div className="container mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 items-start">

        <div className="flex py-10 flex-col items-center justify-between gap-6 order-2 lg:order-1 w-full">

          {/* CAMERA FEED */}
          <div className="relative w-full max-w-[420px] aspect-video bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width="640"
              height="480"
              className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1] z-10"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1] pointer-events-none z-20"
            />
            {!modelsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60 z-30 font-bold">
                Loading Hand Model...
              </div>
            )}
          </div>

          <div className="w-full max-w-[420px]">
            <GameUI
              gameState={gameState}
              modelsLoaded={modelsLoaded}
              username={username}
              setUsername={setUsername}
              onStart={handleStart}
              loadingText="Loading Hand Tracking Model..."
            />
          </div>

          <div className="w-full max-w-[420px] rounded-2xl border border-gray-700 bg-gray-900/60 p-5 shadow-lg shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">🏆 Dino Leaderboard</h2>
            <ul className="divide-y divide-gray-800">
              {(leaderboard || []).slice(0, 10).map((entry, idx) => (
                <li key={entry._id || idx} className="flex justify-between py-2 text-gray-300">
                  <span>{idx + 1}. {entry.name}</span>
                  <span className="font-semibold text-emerald-400">{entry.score}</span>
                </li>
              ))}
              {(!leaderboard || leaderboard.length === 0) && (
                <li className="py-3 text-gray-500 italic">No scores yet — be the first!</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 order-1 lg:order-2 w-full">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
            Gesture Dino
          </h1>
          <div className="relative w-full max-w-[500px] h-[300px] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-slate-100">
            <DinoCanvas dinoY={dinoY} cactusX={cactusX} score={score} gameState={gameState} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default DinoGamePage;