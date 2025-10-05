const router = require('express').Router();
let Score = require('../models/Score');

// GET: Fetch top 10 scores
router.route('/').get((req, res) => {
  Score.find()
    .sort({ score: -1 }) // Sort by score descending
    .limit(10) // Limit to top 10
    .then(scores => res.json(scores))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new score
router.route('/').post((req, res) => {
  const name = req.body.name;
  const score = Number(req.body.score);

  const newScore = new Score({
    name,
    score,
  });

  newScore.save()
    .then(() => res.json('Score added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

