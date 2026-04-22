const Exercise = require('../models/Exercise');

// GET /api/exercises  — supports ?muscleGroup=chest and ?difficulty=beginner
const getAllExercises = async (req, res) => {
  try {
    const filter = {};
    if (req.query.muscleGroup) filter.muscleGroup = req.query.muscleGroup;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

// GET /api/exercises/:id
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
};

// POST /api/exercises
const createExercise = async (req, res) => {
  try {
    const { name, muscleGroup, equipment, difficulty } = req.body;

    if (!name || !muscleGroup || !equipment) {
      return res.status(400).json({ error: 'Name, muscleGroup and equipment are required' });
    }

    const existing = await Exercise.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Exercise with this name already exists' });
    }

    const exercise = await Exercise.create({ name, muscleGroup, equipment, difficulty });
    res.status(201).json(exercise);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};

// PUT /api/exercises/:id
const updateExercise = async (req, res) => {
  try {
    const { name, muscleGroup, equipment, difficulty } = req.body;

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { name, muscleGroup, equipment, difficulty },
      { new: true, runValidators: true }
    );

    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update exercise' });
  }
};

// DELETE /api/exercises/:id
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
};

module.exports = {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
};
