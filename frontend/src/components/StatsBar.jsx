import React from 'react';

// StatsBar receives a stats object as a prop and displays key metrics
function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '16px', borderRadius: '4px' }}>
      <strong>Stats: </strong>
      Total workouts: <strong>{stats.totalWorkouts}</strong> &nbsp;|&nbsp;
      Total volume: <strong>{stats.totalVolumeKg} kg</strong> &nbsp;|&nbsp;
      Top muscle group: <strong>{stats.topMuscleGroup}</strong>
    </div>
  );
}

export default StatsBar;
