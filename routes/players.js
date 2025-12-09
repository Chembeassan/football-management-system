const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const { validatePlayer, validate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Football players management
 */

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of all players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 */
router.get('/', playersController.getAllPlayers);

/**
 * @swagger
 * /api/players/{id}:
 *   get:
 *     summary: Get a specific player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 */
router.get('/:id', playersController.getPlayerById);

/**
 * @swagger
 * /api/players/team/{teamId}:
 *   get:
 *     summary: Get players by team ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: List of players in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 */
router.get('/team/:teamId', playersController.getPlayersByTeam);

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Player created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', validatePlayer, validate, playersController.createPlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   put:
 *     summary: Update a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Player updated successfully
 *       404:
 *         description: Player not found
 */
router.put('/:id', validatePlayer, validate, playersController.updatePlayer);

/**
 * @swagger
 * /api/players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player not found
 */
router.delete('/:id', playersController.deletePlayer);

module.exports = router;