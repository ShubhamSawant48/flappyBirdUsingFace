import React, { useState, useEffect, useRef } from "react";
import { useDinoLogic } from "../../hooks/useDinoLogic";
import { useHandpose } from "../../hooks/useHandpose";
import DinoCanvas from "../DinoCanvas";
import GameUI from "../GameUI";

function DinoGamePage() {
  useEffect(() => {
    if (window.faceapi) {
      if (!sessionStorage.getItem("memory_cleaned")) {
        sessionStorage.setItem("memory_cleaned", "true");
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem("memory_cleaned");
    }
  }, []);

  const [isDetecting, setIsDetecting] = useState(false);
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("easy"); // ✅ difficulty state

  const streamRef = useRef(null);

  const { gameState, score, dinoY, cactusX, leaderboard, startGame, jump, currentLevel } =
    useDinoLogic(difficulty); // ✅ pass difficulty

  const { modelsLoaded, videoRef, canvasRef } = useHandpose(jump, isDetecting);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleStart = async (stream) => {
    stopCurrentStream();
    streamRef.current = stream;
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;

    await new Promise((resolve) => {
      if (videoRef.current.readyState >= 1) { resolve(); return; }
      const timeout = setTimeout(resolve, 3000);
      videoRef.current.onloadedmetadata = () => { clearTimeout(timeout); resolve(); };
    });

    try { await videoRef.current.play(); } catch (err) { console.warn(err.message); }

    startGame(username);
    setIsDetecting(true);
  };

  useEffect(() => {
    if (gameState === "over") {
      setIsDetecting(false);
      stopCurrentStream();
    }
  }, [gameState]);

  useEffect(() => {
    const stopOnUnload = () => { setIsDetecting(false); stopCurrentStream(); };
    window.addEventListener("beforeunload", stopOnUnload);
    return () => { stopOnUnload(); window.removeEventListener("beforeunload", stopOnUnload); };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
      <div className="container mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 items-start">

        <div className="flex py-10 flex-col items-center justify-between gap-6 order-2 lg:order-1 w-full">

          {/* Camera */}
          <div className="relative w-full max-w-[420px] aspect-video bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
            <video ref={videoRef} autoPlay muted playsInline width="640" height="480"
              className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1] z-10" />
            <canvas ref={canvasRef} width="640" height="480"
              className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1] pointer-events-none z-20" />
            {!modelsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60 z-30 font-bold">
                Loading Hand Model...
              </div>
            )}
          </div>

          {/* ✅ Difficulty Selector — only show when not playing */}
          {gameState !== "running" && (
            <div className="w-full max-w-[420px]">
              <p className="text-gray-400 text-sm mb-2 font-medium">Select Difficulty</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "easy",   label: "🟢 Easy",   desc: "Slow & wide" },
                  { key: "medium", label: "🟡 Medium", desc: "Balanced"    },
                  { key: "hard",   label: "🔴 Hard",   desc: "Fast & tight"},
                ].map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                      difficulty === key
                        ? "border-emerald-400 bg-emerald-400/20 text-white"
                        : "border-gray-600 bg-gray-800/60 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {/* Leaderboard */}
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
            {/* ✅ pass currentLevel to canvas for badge display */}
            <DinoCanvas dinoY={dinoY} cactusX={cactusX} score={score} gameState={gameState} currentLevel={currentLevel} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default DinoGamePage;