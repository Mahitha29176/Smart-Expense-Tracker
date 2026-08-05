# 💰 Expense Tracker (MERN Stack) — User & Admin Panel

A complete full-stack Expense Tracker application built with MongoDB, Express, React (Vite), and Node.js.
Includes a **User panel** (track income/expenses, categories, charts, profile) and an **Admin panel**
(platform-wide stats, manage users, view all transactions).

## Project Structure

```
expense-tracker/
├── backend/     Express + MongoDB REST API
└── frontend/    React (Vite) client
```

## Features
- User Authentication (JWT)
- Add/Edit/Delete Income
- Add/Edit/Delete Expenses
- Expense Categories
- Dashboard Charts
- Monthly reports
- User Profile
- Admin Dashboard
- User Management
- Responsive Design

## Prerequisites

- Node.js v18+ installed
- MongoDB running locally (or a MongoDB Atlas connection string)
- VS Code (or any editor)

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` and a `JWT_SECRET` (any long random string).

Start MongoDB locally if you haven't already, then run:

```bash
npm run dev
```

The API will start on **http://localhost:5000**.

### (Optional) Create a demo admin account

```bash
npm run seed:admin
```

This creates an admin login: `admin@example.com` / `admin123`.

## 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will start on **http://localhost:5173**.

## 3. Using the App

1. Go to http://localhost:5173
2. Register a new account (this becomes a regular **user**), or log in as the seeded **admin**.
3. As a user: add income/expense transactions, create categories, view charts on the dashboard.
4. As an admin: view platform-wide stats, manage users (activate/deactivate/delete), and browse all transactions.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT auth, bcryptjs
- **Frontend:** React 18, Vite, React Router, Axios, Recharts

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET/PUT | /api/auth/me | Get/update profile |
| GET/POST | /api/categories | List/create categories |
| PUT/DELETE | /api/categories/:id | Update/delete category |
| GET/POST | /api/expenses | List/create expenses (filters + pagination) |
| GET/PUT/DELETE | /api/expenses/:id | Get/update/delete expense |
| GET | /api/expenses/stats/summary | User's totals, by-category, by-month stats |
| GET | /api/admin/stats | Platform-wide dashboard stats (admin) |
| GET | /api/admin/users | List users (admin) |
| PUT | /api/admin/users/:id/status | Activate/deactivate user (admin) |
| DELETE | /api/admin/users/:id | Delete user (admin) |
| GET | /api/admin/expenses | All transactions across users (admin) |

## Troubleshooting

- **"MongoDB Connected" doesn't appear / connection error:** Make sure MongoDB is running (`mongod`) and `MONGO_URI` in `backend/.env` is correct.
- **CORS errors:** Confirm `CLIENT_URL` in `backend/.env` matches the frontend URL (default `http://localhost:5173`).
- **401 errors after login:** Make sure `JWT_SECRET` is set in `backend/.env` and the backend was restarted after editing `.env`.


