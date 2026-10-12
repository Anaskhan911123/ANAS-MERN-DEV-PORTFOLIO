# ExamPulse: Online Examination System

 A platform for conducting online exams, from sign-in to graded results.

## Features
- Sign-in and role-based access
- Overview dashboard with stat cards
- Distraction-free exam-taking view with a countdown timer
- Automatic grading
- Results page with a circular score ring

## Tech Stack
MongoDB · Express · React (Vite) · Node.js · plain CSS with a shared design-token stylesheet

## Setup

**Server**
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```
```bash
npm run dev
```

**Client**
```bash
cd client
npm install
npm run dev
```

## Author
Muhammad Anas Khan