const Joi = require('joi');

const tournamentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  teams: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectIds
  matches: Joi.array().items(Joi.string().hex().length(24)),
  bracket: Joi.object().optional()
});

module.exports = tournamentSchema;