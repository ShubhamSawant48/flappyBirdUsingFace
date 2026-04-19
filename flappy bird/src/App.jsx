import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import GamePage from "./components/GamePage.jsx";
import DinoGamePage from "./components/pages/DinoGamePage.jsx";
import Home from "./components/pages/Home.jsx";
import Games from "./components/pages/Games.jsx";

// Import our new preload function
import { preloadHandposeModel } from "./hooks/useHandpose.js";

function App() {
  
  // Start downloading the heavy AI models in the background immediately
  useEffect(() => {
    preloadHandposeModel();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900" style={{ paddingTop: 60 }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/play-dino" element={<DinoGamePage />} />
      </Routes>
    </div>
  );
}

export default App;