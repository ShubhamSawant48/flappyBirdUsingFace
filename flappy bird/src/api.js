import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaderboard';

// ✅ FIX: Pass game name so each game fetches only its own scores
// Usage: fetchLeaderboard('dino')  or  fetchLeaderboard('flappy')
export const fetchLeaderboard = async (game) => {
  try {
    const response = await axios.get(API_URL, { params: { game } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    return [];
  }
};

// ✅ FIX: Pass game name so scores go into the right leaderboard
// ✅ FIX: Reject "Guest" names on frontend too — don't even send the request
// Usage: postScore('Shub', 120, 'dino')  or  postScore('Shub', 80, 'flappy')
export const postScore = async (username, score, game) => {
  const playerName = username?.trim();

  // Block empty names, "Guest", and zero scores from being saved
  if (!playerName || playerName.toLowerCase() === 'guest' || score <= 0 || !game) {
    console.log("Score not saved: empty name, Guest, zero score, or missing game.");
    return;
  }

  try {
    await axios.post(API_URL, { name: playerName, score, game });
  } catch (error) {
    console.error("Failed to post score", error);
  }
};