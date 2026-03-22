const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: false
  },
  bodyWeight: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: false
  },
  laps: {
    type: Number,
    required: false
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
