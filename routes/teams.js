const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");
const auth = require("../middleware/auth"); // essential for when we implement JWT auth

// Public routes
router.get("/", teamsController.getAllTeams);
router.get("/:id", teamsController.getTeamById);
router.get("/standings", teamsController.getTeamStandings);

// Protected routes (admins/coaches only)
router.post("/", auth, teamsController.createTeam);
router.put("/:id", auth, teamsController.updateTeam);
router.delete("/:id", auth, teamsController.deleteTeam);

module.exports = router;