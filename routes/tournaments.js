const express = require("express");
const router = express.Router();
const tournamentsController = require("../controllers/tournamentsController");
const auth = require("../middleware/auth");

// Public routes (fans/users)
router.get("/", tournamentsController.getTournaments);
router.get("/:id", tournamentsController.getTournamentById);

// Protected routes (coaches/admins only)
router.post(
  "/",
  auth(["coach", "admin"]),
  tournamentsController.createTournament
);
router.put(
  "/:id",
  auth(["coach", "admin"]),
  tournamentsController.updateTournament
);
router.delete("/:id", auth(["admin"]), tournamentsController.deleteTournament);

module.exports = router;
