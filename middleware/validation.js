const { body, validationResult } = require('express-validator');

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
  validate,
};