import React, { useState } from 'react';

// WorkoutForm is responsible only for rendering the "create workout" form.
// It receives users and exercises as props (fetched by the parent).
// On submit it calls onSubmit(formData) and resets itself.
function WorkoutForm({ users, exercises, onSubmit }) {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [takenToFailure, setTakenToFailure] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!userId || !exerciseId || !sets || !reps || weightKg === '') {
      setError('Please fill in all required fields.');
      return;
    }

    const data = {
      userId,
      date,
      notes,
      entries: [
        {
          exerciseId,
          sets: Number(sets),
          reps: Number(reps),
          weightKg: Number(weightKg),
          takenToFailure,
        },
      ],
    };

    onSubmit(data);

    // Reset form
    setUserId('');
    setDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setExerciseId('');
    setSets('');
    setReps('');
    setWeightKg('');
    setTakenToFailure(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '12px', border: '1px solid #ccc' }}>
      <h3>Log New Workout</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>User: </label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">-- select user --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Date: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label>Exercise: </label>
        <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} required>
          <option value="">-- select exercise --</option>
          {exercises.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name} ({ex.muscleGroup})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Sets: </label>
        <input type="number" min="1" max="20" value={sets} onChange={(e) => setSets(e.target.value)} required />
      </div>

      <div>
        <label>Reps: </label>
        <input type="number" min="1" max="100" value={reps} onChange={(e) => setReps(e.target.value)} required />
      </div>

      <div>
        <label>Weight (kg): </label>
        <input type="number" min="0" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={takenToFailure}
            onChange={(e) => setTakenToFailure(e.target.checked)}
          />{' '}
          Taken to failure
        </label>
      </div>

      <div>
        <label>Notes: </label>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} />
      </div>

      <br />
      <button type="submit">Add Workout</button>
    </form>
  );
}

export default WorkoutForm;
