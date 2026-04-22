const mongoose = require('mongoose');

// Each entry in a workout session references an exercise + logs sets/reps/weight
const setSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Must have at least 1 set'],
    max: [20, 'Cannot exceed 20 sets'],
  },
  reps: {
    type: Number,
    required: [true, 'Number of reps is required'],
    min: [1, 'Must have at least 1 rep'],
    max: [100, 'Cannot exceed 100 reps'],
  },
  weightKg: {
    type: Number,
    required: [true, 'Weight in kg is required'],
    min: [0, 'Weight cannot be negative'],
  },
  // Custom domain field: whether the last set was taken to failure
  takenToFailure: {
    type: Boolean,
    default: false,
  },
});

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: Date,
      required: [true, 'Workout date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    entries: {
      type: [setSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'A workout must have at least one exercise entry',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
