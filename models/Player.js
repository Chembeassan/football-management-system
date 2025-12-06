const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',   // Reference to Teams collection
    required: true
  },
  jerseyNumber: {
    type: Number,
    required: true
  },
  stats: {
    goals: {
      type: Number,
      default: 0
    },
    assists: {
      type: Number,
      default: 0
    },
    matchesPlayed: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: Boolean,
    default: true // true = active, false = inactive
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);