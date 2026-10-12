# LibraSys: Library Management System

A MERN stack app for managing a library's books, members and borrowing.

## Features
- Dashboard with library overview
- Books and Members management
- Issue Book and Return Book flows
- Reports
- Authentication with separate **admin** and **member** logins
- Members can see their own borrowed books and due dates

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
