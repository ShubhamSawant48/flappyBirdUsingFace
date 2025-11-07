// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaderboard';

export const fetchLeaderboard = async () => {
  // ... (no change)
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    return [];
  }
};

export const postScore = async (username, score) => {
  // --- RECOMMENDED CHANGE ---
  const playerName = username.trim() || "Guest"; // Set a fallback name

  if (score > 0) { // No need to check for username here anymore
    try {
      await axios.post(API_URL, { name: playerName, score });
    } catch (error) {
      console.error("Failed to post score", error);
    }
  }
};