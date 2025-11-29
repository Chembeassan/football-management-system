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

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateMatch,
  validate
};