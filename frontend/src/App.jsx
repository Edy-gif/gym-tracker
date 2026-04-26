import React, { useEffect, useState } from 'react';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import StatsBar from './components/StatsBar';
import { fetchUsers, fetchExercises, createWorkout, fetchStats } from './api/workoutApi';

// App is the root component. Its job is to:
// 1. Load the data needed by child components (users, exercises, stats)
// 2. Pass those down as props
// 3. Handle the "new workout submitted" event so WorkoutList refreshes
function App() {
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
    fetchExercises().then(setExercises).catch(console.error);
    fetchStats().then(setStats).catch(console.error);
  }, [refreshSignal]);

  const handleNewWorkout = async (data) => {
    setFormError('');
    const result = await createWorkout(data);
    if (result.error) {
      setFormError(result.error);
    } else {
      // Increment signal so WorkoutList and stats both re-fetch
      setRefreshSignal((n) => n + 1);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Gym Tracker</h1>
      <p>Track your workouts, exercises, and progress.</p>

      <StatsBar stats={stats} />

      {formError && <p style={{ color: 'red' }}>Error: {formError}</p>}

      <WorkoutForm users={users} exercises={exercises} onSubmit={handleNewWorkout} />

      <h2>All Workouts</h2>
      <WorkoutList refreshSignal={refreshSignal} />
    </div>
  );
}

export default App;
