import React, { useState } from 'react';

// WorkoutRow is responsible for rendering a single workout row.
// It receives a workout object and callbacks for update and delete.
function WorkoutRow({ workout, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(workout.notes || '');

  const userName = workout.userId?.name || 'Unknown';

  // Summarise all entries into one readable string
  const entrySummary = workout.entries
    .map((e) => {
      const exName = e.exerciseId?.name || 'Unknown';
      return `${exName}: ${e.sets}×${e.reps} @ ${e.weightKg}kg${e.takenToFailure ? ' (failure)' : ''}`;
    })
    .join(' | ');

  const handleSave = () => {
    onUpdate(workout._id, { notes, entries: workout.entries, date: workout.date });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete this workout by ${userName}?`)) {
      onDelete(workout._id);
    }
  };

  return (
    <tr>
      <td>{userName}</td>
      <td>{new Date(workout.date).toLocaleDateString('sv-SE')}</td>
      <td style={{ maxWidth: '400px', wordBreak: 'break-word' }}>{entrySummary}</td>
      <td>
        {editing ? (
          <>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            {notes || '—'}
            <button onClick={() => setEditing(true)} style={{ marginLeft: '8px' }}>
              Edit
            </button>
          </>
        )}
      </td>
      <td>
        <button onClick={handleDelete} style={{ color: 'red' }}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default WorkoutRow;
