const Player = require('../models/Player');

// @desc    Get all players
// @route   GET /api/players
// @access  Public
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate('teamId', 'name coach stadium');

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('teamId', 'name coach stadium');

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get players by team
// @route   GET /api/players/team/:teamId
// @access  Public
const getPlayersByTeam = async (req, res) => {
  try {
    const players = await Player.find({ teamId: req.params.teamId })
      .populate('teamId', 'name coach stadium');

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new player
// @route   POST /api/players
// @access  Private (Coach/Admin)
const createPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    const savedPlayer = await player.save();

    // Populate with team details
    await savedPlayer.populate('teamId', 'name coach stadium');

    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update player
// @route   PUT /api/players/:id
// @access  Private (Coach/Admin)
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teamId', 'name coach stadium');

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete player
// @route   DELETE /api/players/:id
// @access  Private (Coach/Admin)
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  getPlayersByTeam,
  createPlayer,
  updatePlayer,
  deletePlayer
};