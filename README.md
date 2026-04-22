# AI Diet Planner (MERN)

Full-stack AI Diet Planner built with MongoDB, Express.js, React.js, and Node.js.

## Features

- JWT authentication with secure bcrypt password hashing
- Profile setup with age, gender, height, weight, activity level, diet preference, goal, allergies
- Automatic BMI, BMR, TDEE, and daily calorie calculations
- AI-like rule-based meal recommendation engine using `indian_food.csv`
- Daily, weekly, and monthly diet plans with alternatives
- Recipe book with veg/non-veg filtering, search, and favorites
- Meal tracker with calories and macro logging
- Progress tracker with charts (weight and BMI trend)
- Smart dashboard with weekly calorie chart and latest plan summary
- Tailwind CSS responsive UI with dark/light mode

## Folder Structure

```text
Ai diet/
  indian_food.csv
  backend/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
  frontend/
    src/
      components/
      context/
      pages/
      services/
      api/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB local server or MongoDB Atlas

## Environment Configuration

### Backend: `backend/.env`

Use `backend/.env.example` as reference:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_diet_planner
JWT_SECRET=replace_with_a_secure_secret
FRONTEND_URL=http://localhost:5173
INDIAN_FOOD_CSV_PATH=../../indian_food.csv
```

### Frontend: `frontend/.env`

Use `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Installation

```powershell
cd "c:\Users\tejas\OneDrive\Documents\Ai diet\backend"
npm install

cd "c:\Users\tejas\OneDrive\Documents\Ai diet\frontend"
npm install
```

## Run Application

Open two terminals.

### Terminal 1: Backend

```powershell
cd "c:\Users\tejas\OneDrive\Documents\Ai diet\backend"
npm run dev
```

### Terminal 2: Frontend

```powershell
cd "c:\Users\tejas\OneDrive\Documents\Ai diet\frontend"
npm run dev
```

Frontend URL: `http://localhost:5173` (or next free port)

## Seed Sample Data

After login, call this API with Bearer token to seed foods and recipes:

`POST /api/seed/sample-data`

This loads:
- food records derived from `indian_food.csv`
- sample veg/non-veg recipes

## REST API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile
- `GET /api/profile/me`
- `PUT /api/profile/me`

### Diet Plans
- `POST /api/diet-plans/generate` with `{ "planType": "daily|weekly|monthly" }`
- `GET /api/diet-plans/dashboard`
- `GET /api/diet-plans/mine`
- `GET /api/diet-plans/:id`

### Foods
- `GET /api/foods?q=&category=&dietType=`

### Recipes
- `GET /api/recipes?q=&dietType=&tag=`
- `POST /api/recipes`
- `GET /api/recipes/favorites`
- `POST /api/recipes/:id/favorite`

### Meal Tracking
- `GET /api/meal-logs?date=YYYY-MM-DD`
- `POST /api/meal-logs`
- `GET /api/meal-logs/summary?days=7`

### Progress Tracking
- `GET /api/progress?days=30`
- `POST /api/progress`

## Diet Recommendation Logic

- Meal-type aware filtering: breakfast, lunch, evening snack, dinner
- Calorie bands per meal
- Goal-aware filtering (weight-loss avoids high sugar and dessert-like foods)
- Diet preference filtering (veg, non-veg, eggetarian)
- Allergy keyword exclusion
- Alternative food suggestions for each generated day

## Notes

- `Cannot GET /` at backend root is normal API behavior; use `/api/health`.
- `npm run dev` in backend auto-clears port 5000 before start.


