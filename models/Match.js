const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: {
    type: String,  
    required: true
  },
  teamB: {
    type: String,  
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  score: {
    type: String,
    default: null // "2-1" format when match is completed
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  tournament: {
    type: String,  
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);