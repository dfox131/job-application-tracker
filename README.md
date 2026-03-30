# Job Application Tracker

A full-stack job application tracker built with React, Node.js, Express, PostgreSQL, and Prisma, featuring an AI-powered resume analyzer to help users evaluate job fit and improve applications.

This project was built to demonstrate full-stack development, authentication, database design, and AI integration in a real-world product I actively use during my job search.

---

## Live Demo

- Frontend: https://job-application-tracker-zeta-murex.vercel.app
- Backend API: https://job-application-tracker-v9kr.onrender.com/health

---

## Features

### Core Application Tracking

- User registration and login with JWT authentication
- Protected routes with user-specific data
- Full CRUD for job applications
- Track:
  - Company, role, and status
  - Source, salary, and location
  - Application date and job link
  - Notes and additional details
- Search by company, role, source, or location
- Filter by application status
- Sort by date, company, and status
- Dedicated application details page
- Clean, responsive dashboard UI

---

### AI Resume Match Analyzer (NEW)

- Compare a resume against a job description
- Generate:
  - Match score (0–100)
  - Summary of alignment
  - Matching skills
  - Missing skills
  - Actionable suggestions
- Powered by OpenAI (Responses API)
- Integrated into the full-stack app with secure backend API handling

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios

### Backend

- Node.js
- Express
- Prisma ORM

### Database

- PostgreSQL (Prisma Postgres)

### AI

- OpenAI API (Responses API)
- Model: gpt-5.4-mini

### Deployment

- Vercel (frontend)
- Render (backend)

---

## Project Structure

```text
job-tracker/
├── client/   # React frontend
└── server/   # Express + Prisma backend
```

## API Endpoints

### Health

- GET /health

### Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Applications (protected)

- GET /api/applications
- GET /api/applications/:id
- POST /api/applications
- PUT /api/applications/:id
- DELETE /api/applications/:id

### AI

- POST /api/ai/job-match

---

## Data Model

### User

- id
- email
- passwordHash

### Application

- company
- role
- status
- source
- salary
- location
- dateApplied
- link
- notes
- userId

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/dfox131/job-application-tracker.git
cd job-application-tracker
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a .env file in server/:

```bash
DATABASE_URL="your_database_url_here"
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET="your_jwt_secret_here"
OPENAI_API_KEY="your_openai_api_key_here"
```

Run the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create a .env file in client/:

```bash
VITE_API_URL=http://localhost:4000
```

Run the frontend:

```bash
npm run dev
```

## Screenshots

Add screenshots here later, for example:

- Dashboard
- Application form
- Application details
- Resume Match Analyzer

## Future Improvements

- Attach AI analysis to applications
- Persist AI results in database
- Resume PDF upload and parsing
- Cover letter generation
- Dashboard analytics and charts
- Export applications to CSV

## Author

Daniel Fox
