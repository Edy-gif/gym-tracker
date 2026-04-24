const Workout = require('../models/Workout');
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// GET /api/workouts  — supports ?userId=...
const getAllWorkouts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    // Relational endpoint: populate user name and exercise details
    const workouts = await Workout.find(filter)
      .populate('userId', 'name email')
      .populate('entries.exerciseId', 'name muscleGroup')
      .sort({ date: -1 });

    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

// GET /api/workouts/:id
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('entries.exerciseId', 'name muscleGroup equipment');

    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
};

// POST /api/workouts
const createWorkout = async (req, res) => {
  try {
    const { userId, date, notes, entries } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!entries || entries.length === 0) {
      return res.status(400).json({ error: 'At least one exercise entry is required' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify every exerciseId exists
    for (const entry of entries) {
      if (!entry.exerciseId || entry.sets == null || entry.reps == null || entry.weightKg == null) {
        return res.status(400).json({ error: 'Each entry needs exerciseId, sets, reps and weightKg' });
      }
      const exercise = await Exercise.findById(entry.exerciseId);
      if (!exercise) {
        return res.status(404).json({ error: `Exercise ${entry.exerciseId} not found` });
      }
    }

    const workout = await Workout.create({ userId, date, notes, entries });
    res.status(201).json(workout);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create workout' });
  }
};

// PUT /api/workouts/:id
const updateWorkout = async (req, res) => {
  try {
    const { date, notes, entries } = req.body;

    if (entries !== undefined && entries.length === 0) {
      return res.status(400).json({ error: 'Entries cannot be empty' });
    }

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { date, notes, entries },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('entries.exerciseId', 'name muscleGroup');

    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update workout' });
  }
};

// DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};

// GET /api/workouts/user/:userId  — relational: workouts for a specific user with full details
const getWorkoutsByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const workouts = await Workout.find({ userId: req.params.userId })
      .populate('entries.exerciseId', 'name muscleGroup equipment difficulty')
      .sort({ date: -1 });

    res.json({ user, workouts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
};

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutsByUser,
};
