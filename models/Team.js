const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coach: { type: String, required: true },
  stadium: { type: String, required: true },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);