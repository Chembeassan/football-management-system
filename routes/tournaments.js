const express = require('express');
const router = express.Router();
const tournamentsController = require('../controllers/tournamentsController');
const { validateTournament, validateIdParam,  validate } = require('../middleware/validation');
const { isAuthenticated } = require("../middleware/authenticate");

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
router.get('/',   tournamentsController.getTournaments);

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
router.get("/:id", validateIdParam, validate, tournamentsController.getTournamentById);

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Create a new tournament
 *     tags: [Tournaments]
 *     security:
 *       - googleOAuth: [profile, email]
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
router.post('/', isAuthenticated, validateTournament, validate, tournamentsController.createTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     summary: Update a tournament
 *     tags: [Tournaments]
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
 *         description: Tournament updated successfully
 *       404:
 *         description: Tournament not found
 */
router.put(
    "/:id",
    isAuthenticated,
    validateIdParam,
  validateTournament,
  validate,
  tournamentsController.updateTournament
);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     summary: Delete a tournament
 *     tags: [Tournaments]
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
 *         description: Tournament deleted successfully
 *       404:
 *         description: Tournament not found
 */
router.delete('/:id', isAuthenticated, tournamentsController.deleteTournament);

module.exports = router;
