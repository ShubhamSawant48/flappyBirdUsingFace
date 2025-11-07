import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import GamePage from "./components/GamePage.jsx";
import Home from "./components/pages/Home.jsx";
import Games from "./components/pages/Games.jsx";

function App() {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{ paddingTop: 60 }}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </div>
  );
}

export default App;
