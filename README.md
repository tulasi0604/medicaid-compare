# Medicaid Compare

A simple comparison dashboard for Medicaid payors built with a FastAPI backend and a React + Vite frontend.

## Project structure

- `backend/`
  - `main.py` - FastAPI app exposing `/api/compare`
  - `scoring.py` - composite scoring logic
  - `seed.py` - initializes and seeds SQLite database
- `frontend/`
  - `src/App.jsx` - React UI that fetches backend data
  - `src/main.jsx` - React entrypoint
  - `src/index.css` - global styles
  - `package.json` - frontend dependencies and scripts
  - `vite.config.js` - Vite configuration
- `cmd_strt.txt` - launch instructions for backend and frontend

## Overview

The backend reads cached Medicaid payor metrics from `backend/medicaid_cache.db`, computes weighted composite scores for Molina Healthcare and Centene (WellCare), and returns structured metric and scoring data.

The frontend fetches data from the backend and renders:
- composite score summary
- winner highlight
- side-by-side metric comparison
- source citations and fetch dates

## Setup

### Backend

1. Open a terminal and go to the backend folder:
   ```sh
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```sh
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install required packages:
   ```sh
   pip install fastapi uvicorn
   ```

4. Seed the database:
   ```sh
   python seed.py
   ```

5. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

The backend will run at `http://127.0.0.1:8000`.

### Frontend

1. Open a terminal and go to the frontend folder:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the Vite development server:
   ```sh
   npm run dev
   ```

The frontend will typically run at `http://127.0.0.1:5173`.

## Usage

- Make sure the backend is running at `http://127.0.0.1:8000`
- Start the frontend dev server
- Open the Vite URL in your browser
- The app fetches data from `http://127.0.0.1:8000/api/compare`

## Notes

- The backend uses SQLite via `backend/medicaid_cache.db`
- If the database does not exist or you want fresh data, run `backend/seed.py`
- The frontend is configured to call the backend API directly from `src/App.jsx`

## Useful commands

- Backend: `uvicorn main:app --reload`
- Frontend: `npm run dev`
- Seed DB: `python seed.py`

