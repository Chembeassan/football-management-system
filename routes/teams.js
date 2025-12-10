const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");
const {
  validateTeam,
  validateIdParam,
  validate,
} = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/authenticate");

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Football teams management
 */

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of all teams
 */
router.get("/", teamsController.getAllTeams);

/**
 * @swagger
 * /api/teams/standings:
 *   get:
 *     summary: Get team standings (sorted by points)
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Team standings
 */
router.get("/standings", teamsController.getTeamStandings);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - googleOAuth: [profile, email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               coach:
 *                 type: string
 *               stadium:
 *                 type: string
 *               points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", isAuthenticated, validateTeam, validate,   teamsController.createTeam);


/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team data
 *       404:
 *         description: Team not found
 */
router.get("/:id", validateIdParam, validate, teamsController.getTeamById);


/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     security:
 *       - googleOAuth: [profile, email]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 */
router.put(
  "/:id",
  isAuthenticated,
  validateIdParam,
  validateTeam,
  validate,
  teamsController.updateTeam
);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - googleOAuth: [profile, email]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 */
router.delete("/:id", isAuthenticated, teamsController.deleteTeam);

module.exports = router;