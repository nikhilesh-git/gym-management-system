
# 🏋️ Gym Management System

A full-stack web application for managing gym operations such as member records, billing, notifications, supplements, and diet plans.

---

## 📦 Tech Stack

* **Frontend:** React
* **Backend:** Node.js with Express
* **Database:** SQLite

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/nikhilesh-git/gym-management-system.git
cd gym-management-system
```

---

### 2. **Setup Backend**

```bash
cd backend
npm install
```

#### Start Backend Server

```bash
node index.js
```

> Make sure your SQLite database file (`gym.db`) exists or is created on first run.

---

### 3. **Setup Frontend**

```bash
cd ../frontend
npm install
```

#### Start Frontend Server

```bash
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder with:

```
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 📂 Folder Structure

```
gym-management-system/
│
├── frontend/       ← React JS frontend
└── backend/        ← Node.js + Express API
```

---

## ✅ Features

* Admin and Member login
* Member management
* Bill generation and view
* Fee reminders via notifications
* Supplement stock and diet plan control

---

## 📌 Notes

* Uses `js-cookie` for token management.
* SQLite is used for simplicity (easy to switch to PostgreSQL/MySQL).
* Basic role-based access handled in frontend and backend.

---

Let me know if you'd like a version with badges (build status, license, etc.) or setup as a GitHub template.
