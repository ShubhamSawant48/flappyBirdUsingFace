import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import GamePage from "./components/GamePage.jsx";
import HomePage from "./components/HomePage.jsx";

function App() {
  return (
    <div style={{ paddingTop: 60 }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </div>
  );
}

export default App;
