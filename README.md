

A full-stack MERN application built with Vite + TypeScript + Tailwind CSS + Redux Toolkit.

---

## 🗂 Project Structure

```
daily-submission/
├── backend/          Express + MongoDB + TypeScript API
└── frontend/         Vite + React + TypeScript + Tailwind + Redux
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env — set your MongoDB URI and JWT_SECRET

# Start development server (port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

### 3. Open the app

Visit **http://localhost:5173**

---

## 🔐 Creating Your First Users

Use any REST client (Postman, curl, etc.) or the Register form in the app:

**Create Admin:**
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "admin123",
  "role": "admin"
}
```

**Create Regular User:**
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "user123",
  "role": "user"
}
```

Or simply use the **Register** tab on the login page and select the role.

---

## 📋 Features

### Login Page
- Single page with Login / Register tabs
- Role selector (User / Admin)
- JWT-based authentication stored in localStorage
- Auto-redirect based on role after login

### User Dashboard
- Displays logged-in user's name
- Work Done textarea (5–1000 characters, word count live)
- Status dropdown: **Complete** / **Incomplete**
- Submit button → POST to API
- Submission history with full timestamps shown below the form

### Admin Dashboard
- Stats cards: Total, Completed, Incomplete, Completion Rate %
- Full submissions table with Name, Work Done, Status, Timestamp
- **Search** by name or work content
- **Filter** by All / Complete / Incomplete
- **Sort** by newest / oldest
- **Edit** any submission (modal with all fields)
- **Delete** any submission (inline confirm step)

---

## 🔌 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | JWT | Current user |
| POST | `/api/submissions` | User | Submit daily report |
| GET | `/api/submissions/my` | User | My submissions |
| GET | `/api/submissions` | Admin | All submissions |
| PUT | `/api/submissions/:id` | Admin | Update submission |
| DELETE | `/api/submissions/:id` | Admin | Delete submission |
| GET | `/api/users` | Admin | All users |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs password hashing
- TypeScript

**Frontend**
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit + React-Redux
- React Router v6
- Axios
- date-fns

---

## .env Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/daily-submission
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
```
