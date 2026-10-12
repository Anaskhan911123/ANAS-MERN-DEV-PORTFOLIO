# Student Management System

A MERN stack app for managing student records, courses and results.

## Features
- Student records: add, view, update, delete
- Search and filter students
- Course / class management
- Attendance and results tracking
- Authentication with role-based access
- Reports

## Tech Stack
MongoDB · Express · React (Vite) · Node.js

## Setup

**BACKEND**
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

**FRONTEND**
```bash
cd client
npm install
npm run dev
```

## Author
Muhammad Anas Khan