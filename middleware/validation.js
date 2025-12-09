const { body, param, validationResult } = require('express-validator');

// Validation rules for matches
const validateMatch = [
  body('teamA').isMongoId().withMessage('Team A must be a valid ID'),
  body('teamB').isMongoId().withMessage('Team B must be a valid ID'),
  body('date').isISO8601().withMessage('Date must be a valid date'),
  body('venue').notEmpty().withMessage('Venue is required'),
  body('status').isIn(['scheduled', 'live', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('score').optional().isString().withMessage('Score must be a string')
];

// Validation rules for players
const validatePlayer = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim(),

  body('position')
    .notEmpty().withMessage('Position is required')
    .isString().withMessage('Position must be a string')
    .trim(),

  body('teamId')
    .isMongoId().withMessage('Team ID must be a valid Mongo ObjectId'),

  body('jerseyNumber')
    .isInt({ min: 1 }).withMessage('Jersey number must be a positive integer'),

  body('stats.goals')
    .optional()
    .isInt({ min: 0 }).withMessage('Goals must be a non-negative integer'),

  body('stats.assists')
    .optional()
    .isInt({ min: 0 }).withMessage('Assists must be a non-negative integer'),

  body('stats.matchesPlayed')
    .optional()
    .isInt({ min: 0 }).withMessage('Matches played must be a non-negative integer'),

  body('status')
    .optional()
    .isBoolean().withMessage('Status must be true (active) or false (inactive)')
];

// Validation rules for tournaments
const validateTournament = [
  body('name')
    .notEmpty()
    .withMessage('Tournament name is required'),

  body('teams')
    .optional()
    .isArray()
    .withMessage('Teams must be an array of IDs'),

  body('teams.*')
    .optional()
    .isMongoId()
    .withMessage('Each team must be a valid Mongo ID'),

  body('matches')
    .optional()
    .isArray()
    .withMessage('Matches must be an array of IDs'),

  body('matches.*')
    .optional()
    .isMongoId()
    .withMessage('Each match must be a valid Mongo ID'),

  body('bracket')
    .optional()
    .isObject()
    .withMessage('Bracket must be an object'),
];

// Validation rules for teams
const validateTeam = [
  body("name")
    .notEmpty()
    .withMessage("Team name is required")
    .isString()
    .withMessage("Team name must be a string"),

  body("coach")
    .notEmpty()
    .withMessage("Coach name is required")
    .isString()
    .withMessage("Coach name must be a string"),

  body("stadium")
    .notEmpty()
    .withMessage("Stadium is required")
    .isString()
    .withMessage("Stadium must be a string"),

  body("points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points must be a non-negative integer"),
];




// Validation rule for :id params
const validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateMatch,
  validatePlayer,
  validateTournament,
  validateTeam,
  validateIdParam,
  validate,
};