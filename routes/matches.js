const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const { validateMatch, validateIdParam, validate} = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Football matches management
 */

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Get all matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: List of all matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
router.get('/', matchesController.getAllMatches);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Get a specific match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match not found
 */
router.get('/:id', validateIdParam, validate, matchesController.getMatchById);

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Create a new match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Match'
 *     responses:
 *       201:
 *         description: Match created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', validateMatch, validate, matchesController.createMatch);

/**
 * @swagger
 * /api/matches/{id}:
 *   put:
 *     summary: Update a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, live, completed, cancelled]
 *     responses:
 *       200:
 *         description: Match updated successfully
 *       404:
 *         description: Match not found
 */
router.put('/:id', validateMatch, validateIdParam, validate, matchesController.updateMatch);

/**
 * @swagger
 * /api/matches/{id}:
 *   delete:
 *     summary: Delete a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match deleted successfully
 *       404:
 *         description: Match not found
 */
router.delete('/:id', matchesController.deleteMatch);

module.exports = router;
