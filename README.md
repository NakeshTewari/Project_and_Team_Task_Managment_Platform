# Project and Team Task Management Platform

A full-stack web application designed for teams to seamlessly manage projects, assign tasks, collaborate through comments, and track activity.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js & React
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (configured with interceptors for auth)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (Hosted on Aiven)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## ✨ Features

- **Secure Authentication:** User registration and login using JWT.
- **Project Management:** Create and manage distinct projects.
- **Task Tracking:** Assign tasks, update statuses, and monitor progress.
- **Team Collaboration:** Built-in comment system on tasks and projects.
- **Activity Logs:** Track recent activities and changes across the platform.

---

## 🛠️ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL Database (local or cloud-hosted)

### 1. Clone the Repository
```bash
git clone https://github.com/NakeshTewari/Project_and_Team_Task_Managment_Platform.git
cd Project_and_Team_Task_Managment_Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend server:
```bash
npm run dev
```

The application will now be running at `http://localhost:3000`.

---

## 🌐 Deployment (Vercel)

This repository is configured as a monorepo and can be deployed directly to Vercel as two separate projects.

### Backend Deployment
1. Import the repository into Vercel.
2. Set the **Root Directory** to `backend`.
3. Add all your database environment variables (and `JWT_SECRET`).
4. Click Deploy. Vercel will automatically run it as a Serverless Function thanks to the `vercel.json` configuration.

### Frontend Deployment
1. Import the repository into Vercel again.
2. Set the **Root Directory** to `frontend`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable, pointing to your live backend URL (make sure to append `/api` at the end).
4. Click Deploy.