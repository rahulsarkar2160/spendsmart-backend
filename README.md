# SpendSmart Backend 🧠

Backend API for **SpendSmart**, a full-stack expense tracking
application.

## 🚀 Live API

https://spendsmart-backend-lvhe.onrender.com

## 🧱 Tech Stack

-   Node.js
-   Express
-   MongoDB + Mongoose
-   JWT authentication
-   Zod validation
-   bcrypt password hashing

## ✨ Core Features

-   JWT-based authentication
-   Role-based access control (USER / ADMIN)
-   Expense CRUD with ownership enforcement
-   Pagination, filtering, and sorting
-   CSV export
-   Admin analytics & user management

## 📦 API Routes

### Auth

-   POST `/api/auth/register`
-   POST `/api/auth/login`
-   GET `/api/auth/me`

### Expenses

-   POST `/api/expenses`
-   GET `/api/expenses`
-   PUT `/api/expenses/:id`
-   DELETE `/api/expenses/:id`
-   GET `/api/expenses/export`

### Admin (ADMIN only)

-   GET `/api/admin/stats`
-   GET `/api/admin/users`
-   DELETE `/api/admin/users/:id`

## ⚙️ Local Setup

``` bash
git clone https://github.com/<your-username>/spendsmart-backend.git
cd spendsmart-backend
npm install
```

Create a `.env` file:

``` env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

Run locally:

``` bash
npm run dev
```

## 🧠 Design Notes

-   Backend-driven pagination & filtering
-   Defensive validation with Zod
-   Centralized error handling
-   Admin routes protected by role checks

## ⏭️ Future Improvements

-   Automated tests
-   Rate limiting
-   Swagger / OpenAPI documentation
