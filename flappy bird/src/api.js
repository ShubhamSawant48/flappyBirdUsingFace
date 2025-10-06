import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaderboard';

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    return [];
  }
};

export const postScore = async (username, score) => {
  if (username && score > 0) {
    try {
      await axios.post(API_URL, { name: username, score });
    } catch (error) {
      console.error("Failed to post score", error);
    }
  }
};
