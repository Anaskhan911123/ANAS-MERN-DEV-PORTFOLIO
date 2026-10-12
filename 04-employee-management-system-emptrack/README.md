# EmpTrack: Employee Management System

 A MERN app for managing employee records, departments and reports.

## Features
- Employee records: create, view, update, delete
- Department management (employees reference real departments)
- Search and filter
- Reports generation
- JWT authentication with bcrypt password hashing
- Role-based access: only admins can delete employees
- Performance optimisation pass

## Tech Stack
MongoDB · Express · React (Vite) · Node.js · JWT · bcrypt

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