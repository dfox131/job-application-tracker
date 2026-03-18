# Job Application Tracker

A full-stack job application tracker built with React, Node.js, Express, PostgreSQL, and Prisma.

This project helps track job applications across the search process, including company, role, status, source, salary, location, application date, job link, and notes. It includes a polished dashboard, filtering, sorting, and detailed application views.

## Live Demo

- Frontend: https://job-application-tracker-zeta-murex.vercel.app
- Backend API: https://job-application-tracker-v9kr.onrender.com/health

## Features

- Create, read, update, and delete job applications
- Track application status, source, salary, location, and notes
- Search by company, role, source, or location
- Filter by application status
- Sort by date, company, and status
- View full application details on a dedicated page
- Responsive frontend with a clean dashboard UI
- Deployed frontend and backend

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios

### Backend

- Node.js
- Express
- Prisma ORM

### Database

- PostgreSQL (Prisma Postgres)

### Deployment

- Vercel (frontend)
- Render (backend)

## Project Structure

```text
job-tracker/
├── client/   # React frontend
└── server/   # Express + Prisma backend
```

## API Endpoints

### Health

- GET /health

### Applications

- GET /api/applications

- GET /api/applications/:id

- POST /api/applications

- PUT /api/applications/:id

- DELETE /api/applications/:id

## Data Model

Each application includes:

- company

- role

- status

- source

- salary

- location

- dateApplied

- link

- notes

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
VITE_API_BASE_URL=http://localhost:4000/api/applications
```

Run the frontend:

```bash
npm run dev
```

## Screenshots

Add screenshots here later, for example:

- Dashboard
- Add Application form
- Application Details page

## Future Improvements

- User authentication

- User-specific application data

- AI-powered job description analysis

- Resume/job match insights

- Cover letter generation

## Author

Daniel Fox
