const Match = require('../models/Match');

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('teamA', 'name coach stadium')
      .populate('teamB', 'name coach stadium')
      .populate('tournament', 'name');
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single match by ID
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('teamA', 'name coach stadium')
      .populate('teamB', 'name coach stadium')
      .populate('tournament', 'name');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get matches by tournament
// @route   GET /api/matches/tournament/:tournamentId
// @access  Public
const getMatchesByTournament = async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.tournamentId })
      .populate('teamA', 'name coach stadium')
      .populate('teamB', 'name coach stadium');
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new match
// @route   POST /api/matches
// @access  Private (Coach/Admin)
const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    const savedMatch = await match.save();
    
    // Populate the saved match with team details
    await savedMatch.populate('teamA', 'name coach stadium');
    await savedMatch.populate('teamB', 'name coach stadium');
    
    res.status(201).json(savedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update match
// @route   PUT /api/matches/:id
// @access  Private (Coach/Admin)
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('teamA', 'name coach stadium')
    .populate('teamB', 'name coach stadium')
    .populate('tournament', 'name');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete match
// @route   DELETE /api/matches/:id
// @access  Private (Coach/Admin)
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  getMatchesByTournament,
  createMatch,
  updateMatch,
  deleteMatch
};