require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Exercise = require('./models/Exercise');
const Workout = require('./models/Workout');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Exercise.deleteMany({});
  await Workout.deleteMany({});
  console.log('Cleared existing data');

  // Seed Users
  const users = await User.insertMany([
    { name: 'Erik Lindgren', email: 'erik.lindgren@example.com', fitnessGoal: 'muscle gain' },
    { name: 'Sara Nilsson', email: 'sara.nilsson@example.com', fitnessGoal: 'weight loss' },
    { name: 'Marcus Johansson', email: 'marcus.j@example.com', fitnessGoal: 'endurance' },
    { name: 'Lina Pettersson', email: 'lina.pettersson@example.com', fitnessGoal: 'general fitness' },
    { name: 'Johan Svensson', email: 'johan.svensson@example.com', fitnessGoal: 'muscle gain' },
  ]);
  console.log(`Seeded ${users.length} users`);

  // Seed Exercises
  const exercises = await Exercise.insertMany([
    { name: 'Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
    { name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate' },
    { name: 'Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
    { name: 'Barbell Deadlift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
    { name: 'Barbell Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced' },
    { name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
    { name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
    { name: 'Dumbbell Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner' },
    { name: 'Barbell Curl', muscleGroup: 'arms', equipment: 'barbell', difficulty: 'beginner' },
    { name: 'Tricep Pushdown', muscleGroup: 'arms', equipment: 'cable', difficulty: 'beginner' },
    { name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
    { name: 'Treadmill Run', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner' },
  ]);
  console.log(`Seeded ${exercises.length} exercises`);

  const [benchPress, inclinePress, pullUp, deadlift, squat, legPress, ohp, lateralRaise, curl, tricepPushdown, plank, treadmill] = exercises;

  // Seed Workouts (realistic, spread across time)
  const workouts = await Workout.insertMany([
    {
      userId: users[0]._id,
      date: new Date('2024-11-04'),
      notes: 'Felt strong today, hit a new PR on bench',
      entries: [
        { exerciseId: benchPress._id, sets: 4, reps: 6, weightKg: 90, takenToFailure: true },
        { exerciseId: inclinePress._id, sets: 3, reps: 10, weightKg: 60, takenToFailure: false },
        { exerciseId: curl._id, sets: 3, reps: 12, weightKg: 20, takenToFailure: false },
      ],
    },
    {
      userId: users[0]._id,
      date: new Date('2024-11-06'),
      notes: 'Leg day, knees felt fine',
      entries: [
        { exerciseId: squat._id, sets: 5, reps: 5, weightKg: 110, takenToFailure: false },
        { exerciseId: legPress._id, sets: 3, reps: 15, weightKg: 180, takenToFailure: false },
      ],
    },
    {
      userId: users[1]._id,
      date: new Date('2024-11-05'),
      notes: 'First time deadlifting with a coach',
      entries: [
        { exerciseId: deadlift._id, sets: 3, reps: 8, weightKg: 50, takenToFailure: false },
        { exerciseId: plank._id, sets: 3, reps: 1, weightKg: 0, takenToFailure: false },
        { exerciseId: treadmill._id, sets: 1, reps: 1, weightKg: 0, takenToFailure: false },
      ],
    },
    {
      userId: users[2]._id,
      date: new Date('2024-11-03'),
      notes: 'Long cardio session + upper body',
      entries: [
        { exerciseId: treadmill._id, sets: 1, reps: 1, weightKg: 0, takenToFailure: false },
        { exerciseId: pullUp._id, sets: 4, reps: 8, weightKg: 0, takenToFailure: true },
        { exerciseId: ohp._id, sets: 3, reps: 10, weightKg: 50, takenToFailure: false },
      ],
    },
    {
      userId: users[3]._id,
      date: new Date('2024-11-07'),
      notes: 'Full body routine',
      entries: [
        { exerciseId: squat._id, sets: 3, reps: 12, weightKg: 60, takenToFailure: false },
        { exerciseId: benchPress._id, sets: 3, reps: 10, weightKg: 55, takenToFailure: false },
        { exerciseId: lateralRaise._id, sets: 3, reps: 15, weightKg: 10, takenToFailure: false },
        { exerciseId: tricepPushdown._id, sets: 3, reps: 15, weightKg: 25, takenToFailure: false },
      ],
    },
    {
      userId: users[4]._id,
      date: new Date('2024-11-02'),
      notes: 'Back and biceps, classic split',
      entries: [
        { exerciseId: deadlift._id, sets: 4, reps: 5, weightKg: 140, takenToFailure: false },
        { exerciseId: pullUp._id, sets: 4, reps: 6, weightKg: 10, takenToFailure: false },
        { exerciseId: curl._id, sets: 4, reps: 10, weightKg: 25, takenToFailure: true },
      ],
    },
  ]);
  console.log(`Seeded ${workouts.length} workouts`);

  console.log('Database seeded successfully');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
