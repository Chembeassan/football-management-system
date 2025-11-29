const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const { validateMatch, validate } = require('../middleware/validation');

// GET all matches
router.get('/', matchesController.getAllMatches);

// GET specific match by ID
router.get('/:id', matchesController.getMatchById);

// GET matches by tournament
router.get('/tournament/:tournamentId', matchesController.getMatchesByTournament);

// POST create new match (protected - coaches/admins only)
router.post('/', validateMatch, validate, matchesController.createMatch);

// PUT update match results/info (protected - coaches/admins only)
router.put('/:id', validateMatch, validate, matchesController.updateMatch);

// DELETE cancel match (protected - coaches/admins only)
router.delete('/:id', matchesController.deleteMatch);

module.exports = router;