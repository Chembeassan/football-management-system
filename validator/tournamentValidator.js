const Joi = require("joi");

const tournamentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  // Array of MongoDB ObjectIds for teams
  teams: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .message("Each team ID must be a valid ObjectId")
    )
    .default([]),

  // Array of MongoDB ObjectIds for matches
  matches: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .message("Each match ID must be a valid ObjectId")
    )
    .default([]),

  // Flexible bracket object
  bracket: Joi.object().default({}),
});

// Middleware for validation
const validateTournament = (req, res, next) => {
  const { error, value } = tournamentSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: messages });
  }
  req.body = value; // sanitized body
  next();
};

module.exports = validateTournament;
