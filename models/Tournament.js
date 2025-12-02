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
        default: []
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
