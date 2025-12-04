const express = require('express');
const router = express.Router();
const tournamentsController = require('../controllers/tournamentsController');
const validateTournament = require('../validator/tournamentValidator');
const auth = require("../tournamentsAuth/auth");

// Dummy controllers for

/**
 * @swagger
 * tags:
 *   name: Tournaments
 *   description: Football tournaments management
 */

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: Get all tournaments
 *     tags: [Tournaments]
 *     responses:
 *       200:
 *         description: List of all tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tournament'
 */
router.get('/', tournamentsController.getTournaments);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     summary: Get a specific tournament by ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Tournament not found
 */
router.get('/:id', tournamentsController.getTournamentById);

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Create a new tournament
 *     tags: [Tournaments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       201:
 *         description: Tournament created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', auth(['admin','coach']), validateTournament,  tournamentsController.createTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     summary: Update a tournament
 *     tags: [Tournaments]
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
 *         description: Tournament updated successfully
 *       404:
 *         description: Tournament not found
 */
router.put(
  "/:id",
  auth(["admin", "coach"]),
  validateTournament,
  tournamentsController.updateTournament
);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     summary: Delete a tournament
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament deleted successfully
 *       404:
 *         description: Tournament not found
 */
router.delete('/:id', tournamentsController.deleteTournament);

module.exports = router;
