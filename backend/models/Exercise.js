const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      unique: true,
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required'],
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'],
    },
    equipment: {
      type: String,
      required: [true, 'Equipment is required'],
      enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell'],
    },
    // Custom domain field: difficulty level so beginners know what to pick
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
