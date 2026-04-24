const Workout = require('../models/Workout');

// GET /api/stats/summary
// Returns total workouts, total volume (sets * reps * weight), and most-used muscle group
const getSummary = async (req, res) => {
  try {
    const workouts = await Workout.find().populate('entries.exerciseId', 'muscleGroup');

    let totalWorkouts = workouts.length;
    let totalVolumeKg = 0;
    const muscleGroupCount = {};

    for (const workout of workouts) {
      for (const entry of workout.entries) {
        // Volume = sets × reps × weight
        totalVolumeKg += entry.sets * entry.reps * entry.weightKg;

        // Count muscle groups
        const mg = entry.exerciseId?.muscleGroup;
        if (mg) {
          muscleGroupCount[mg] = (muscleGroupCount[mg] || 0) + 1;
        }
      }
    }

    // Find most-trained muscle group
    const topMuscleGroup = Object.entries(muscleGroupCount).sort((a, b) => b[1] - a[1])[0];

    res.json({
      totalWorkouts,
      totalVolumeKg: Math.round(totalVolumeKg),
      topMuscleGroup: topMuscleGroup ? topMuscleGroup[0] : 'N/A',
      muscleGroupBreakdown: muscleGroupCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
};

module.exports = { getSummary };
