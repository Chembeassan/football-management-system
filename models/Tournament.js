const mongoose = require("mongoose");

 const TournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
    bracket: {
      type: Object, // flexible structure for knockout/bracket data
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", TournamentSchema);




/* const isTestMode = process.env.TEST_MODE === "true";

const TournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teams: isTestMode
      ? [{ type: mongoose.Schema.Types.ObjectId }] // no ref in test mode
      : [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    bracket: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", TournamentSchema);
 */