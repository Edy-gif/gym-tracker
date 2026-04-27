# Gym Tracker

**Problem this app solves:** Gym-goers have no simple way to log workouts, track sets/reps/weight over time, and see which muscle groups they train most — this app provides that in a clean fullstack interface.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Dev tooling:** concurrently, nodemon

---

## Project Structure

```
gym-tracker/
├── backend/
│   ├── controllers/    ← business logic
│   ├── models/         ← Mongoose schemas
│   ├── routes/         ← Express routers
│   ├── seed.js         ← database seeder
│   └── server.js       ← app entry point
├── frontend/
│   └── src/
│       ├── api/        ← fetch helpers
│       ├── components/ ← React components
│       └── App.jsx
└── package.json        ← root (concurrently)
```

---

## Setup (under 5 minutes)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd gym-tracker
```

### 2. Install all dependencies

```bash
# Root (concurrently)
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 3. Configure environment variables

Create a file called `.env` inside the `backend/` folder and add these two lines:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/gym-tracker?retryWrites=true&w=majority
PORT=5000
```

Replace `<username>`, `<password>` and the cluster address with your real MongoDB Atlas values.

> **How to get a MongoDB Atlas URI:**
> 1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
> 2. Create a free M0 cluster.
> 3. Under **Database Access**, add a user with a password.
> 4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs).
> 5. Click **Connect → Drivers** and copy the connection string.

### 4. Seed the database

```bash
cd backend
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing data
Seeded 5 users
Seeded 12 exercises
Seeded 6 workouts
Database seeded successfully
```

### 5. Run the app

From the **root** directory:

```bash
npm run dev
```

This starts both servers at once:
- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:5173](http://localhost:5173)

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/workouts` | Get all workouts (supports `?userId=`) |
| GET | `/api/workouts/:id` | Get one workout with populated data |
| POST | `/api/workouts` | Create a new workout |
| PUT | `/api/workouts/:id` | Update a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |
| GET | `/api/workouts/user/:userId` | All workouts for a user (relational) |
| GET | `/api/exercises` | Get all exercises (supports `?muscleGroup=`, `?difficulty=`) |
| POST | `/api/exercises` | Create a new exercise |
| PUT | `/api/exercises/:id` | Update an exercise |
| DELETE | `/api/exercises/:id` | Delete an exercise |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/api/stats/summary` | Aggregated stats (volume, top muscle group) |

---

## Collections (MongoDB)

| Collection | Description |
|------------|-------------|
| `users` | People who track workouts |
| `exercises` | Exercise catalogue (bench press, squat, etc.) |
| `workouts` | Logged workout sessions referencing users and exercises |

### Relationships

```
workout.userId      → users._id
workout.entries[].exerciseId → exercises._id
```

---

## Custom Domain Fields

- `Exercise.difficulty` — beginner / intermediate / advanced (helps users pick appropriate exercises)
- `WorkoutEntry.takenToFailure` — boolean flag indicating if the last set was pushed to muscular failure (important for strength training context)

---

## ERD (Entity Relationship Diagram)

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ _id              │
│ name             │
│ email            │
│ fitnessGoal      │
└────────┬─────────┘
│ has
│ (1 to many)
▼
┌──────────────────┐
│    workouts      │
├──────────────────┤
│ _id              │
│ userId           │
│ date             │
│ notes            │
└────────┬─────────┘
│ contains
│ (1 to many)
▼
┌──────────────────┐
│     entries      │
├──────────────────┤
│ exerciseId       │
│ sets             │
│ reps             │
│ weightKg         │
│ takenToFailure   │
└────────┬─────────┘
│ references
│ (many to 1)
▼
┌──────────────────┐
│    exercises     │
├──────────────────┤
│ _id              │
│ name             │
│ muscleGroup      │
│ equipment        │
│ difficulty       │
└──────────────────┘
```
