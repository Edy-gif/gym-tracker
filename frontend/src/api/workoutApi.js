const BASE = '/api';

// --- Workouts ---
export const fetchWorkouts = (userId = '') => {
  const url = userId ? `${BASE}/workouts?userId=${userId}` : `${BASE}/workouts`;
  return fetch(url).then((r) => r.json());
};

export const createWorkout = (data) =>
  fetch(`${BASE}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateWorkout = (id, data) =>
  fetch(`${BASE}/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteWorkout = (id) =>
  fetch(`${BASE}/workouts/${id}`, { method: 'DELETE' }).then((r) => r.json());

// --- Users ---
export const fetchUsers = () =>
  fetch(`${BASE}/users`).then((r) => r.json());

// --- Exercises ---
export const fetchExercises = () =>
  fetch(`${BASE}/exercises`).then((r) => r.json());

// --- Stats ---
export const fetchStats = () =>
  fetch(`${BASE}/stats/summary`).then((r) => r.json());
