const Team = require("../models/Team");
const mongoose = require("mongoose");



// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a team by ID
exports.getTeamById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create a new team
exports.createTeam = async (req, res) => {
  const { name, coach, stadium, points } = req.body;
  try {
    const newTeam = new Team({ name, coach, stadium, points });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTeam) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get team standings (sorted by points)
exports.getTeamStandings = async (req, res) => {
  try {
    const standings = await Team.find().sort({ points: -1 });
    res.status(200).json(standings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};