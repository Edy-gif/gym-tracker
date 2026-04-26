import React, { useEffect, useState, useCallback } from 'react';
import WorkoutRow from './WorkoutRow';
import { fetchWorkouts, deleteWorkout, updateWorkout } from '../api/workoutApi';

// WorkoutList is responsible for fetching, displaying, filtering, and managing workouts.
// It uses setInterval to auto-refresh every 30 seconds and cleans up on unmount.
function WorkoutList({ refreshSignal }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // load is wrapped in useCallback so we can use it both in useEffect and manually
  const load = useCallback(async () => {
    try {
      setError('');
      const data = await fetchWorkouts();
      if (data.error) throw new Error(data.error);
      setWorkouts(data);
    } catch (err) {
      setError('Failed to load workouts: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      load();
    }, 30000);

    // Cleanup: clear interval when component unmounts to avoid memory leaks
    return () => clearInterval(interval);
  }, [load, refreshSignal]);

  const handleDelete = async (id) => {
    const result = await deleteWorkout(id);
    if (result.error) {
      alert('Delete failed: ' + result.error);
    } else {
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    }
  };

  const handleUpdate = async (id, data) => {
    const result = await updateWorkout(id, data);
    if (result.error) {
      alert('Update failed: ' + result.error);
    } else {
      setWorkouts((prev) => prev.map((w) => (w._id === id ? result : w)));
    }
  };

  // Client-side search: filter by user name
  const filtered = workouts.filter((w) =>
    (w.userId?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading workouts...</p>;
  if (error) return (
    <div>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={load}>Retry</button>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <label>Filter by user name: </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. Erik"
        />
      </div>

      {filtered.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Exercises</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <WorkoutRow
                key={w._id}
                workout={w}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkoutList;
