# Task Management App

 A productivity app that helps users manage tasks and deadlines.

## Features
- Create, view, update and delete tasks
- Deadlines
- Categories
- Reminders
- Progress tracking

## Tech Stack
MongoDB · Express · React (Vite) · Node.js

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