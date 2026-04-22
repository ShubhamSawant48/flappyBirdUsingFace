const router = require("express").Router();
let Score = require("../models/Score");

// GET: Fetch top 10 scores for a specific game
// Usage: GET /api/leaderboard?game=dino  or  GET /api/leaderboard?game=flappy
router.route("/").get((req, res) => {
  const game = req.query.game; // ✅ FIX: read ?game= from query string

  // Build filter — if no game param somehow, return nothing to avoid mixing
  const filter = game ? { game } : {};

  Score.find(filter)
    .sort({ score: -1 })
    .limit(10)
    .then((scores) => res.json(scores))
    .catch((err) => res.status(400).json("Error: " + err));
});

// POST: Add a new score with game identifier
// Usage: POST /api/leaderboard  body: { name, score, game }
router.route("/").post((req, res) => {
  const name = req.body.name;
  const score = Number(req.body.score);
  const game = req.body.game; // ✅ FIX: receive game from request body

  // ✅ FIX: Validate on the backend too — reject Guest names and zero scores
  if (!name || name.trim().toLowerCase() === 'guest' || score <= 0 || !game) {
    return res.status(400).json("Invalid score submission.");
  }

  const newScore = new Score({
    name: name.trim(),
    score,
    game
  });

  newScore
    .save()
    .then(() => res.json("Score added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;