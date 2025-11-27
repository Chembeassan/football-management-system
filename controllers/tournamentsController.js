const Tournament = require("../models/Tournament");

// Create new tournament
exports.createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tournaments
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("teams")
      .populate("matches");
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific tournament
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("teams")
      .populate("matches");
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update tournament (e.g., bracket)
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.json(tournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.json({ message: "Tournament deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
