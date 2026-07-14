# Project and Team Task Management Platform

A full-stack web application designed for teams to seamlessly manage projects, assign tasks, collaborate through comments, and track activity.

### 🔗 Live Demo
- **Frontend (Web App):** [Link](https://project-and-team-task-managment-pla-beta.vercel.app/)
- **Backend (API):** [Link](https://project-and-team-task-managment-pla.vercel.app/)

---

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

---

## 🔒 Roles, Access Control & API Routes

The platform implements robust Role-Based Access Control (RBAC) to ensure users only see and modify what they are allowed to. 

### 1. ADMIN
Has full control over the entire platform, users, and logs.
- **Allowed Routes:**
  - `GET /api/users/` (List all users)
  - `POST /api/users/` (Create a user)
  - `PUT /api/users/:id` (Update a user)
  - `DELETE /api/users/:id` (Delete a user)
  - `GET /api/activity/` (View system-wide activity logs)
  - *Plus all routes available to PROJECT_MANAGER and MEMBER.*
   
### 2. PROJECT_MANAGER
Can manage projects, tasks, and the members assigned to them.
- **Allowed Routes:**
  - `POST /api/projects/` (Create a project)
  - `PUT /api/projects/:id` (Update a project)
  - `DELETE /api/projects/:id` (Delete a project)
  - `POST /api/projects/:id/members` (Add a member to a project)
  - `DELETE /api/projects/:id/members/:userId` (Remove a member)
  - `POST /api/tasks/` (Create a task)
  - `PUT /api/tasks/:id` (Update a task)
  - `DELETE /api/tasks/:id` (Delete a task)
  - *Plus all routes available to MEMBER.*

### 3. MEMBER / USER
Standard authenticated users who can view their assignments and collaborate.
- **Allowed Routes:**
  - `GET /api/projects/` (View their projects)
  - `GET /api/tasks/` (View their assigned tasks)
  - `GET /api/auth/me` (Fetch their profile)
  - `POST /api/auth/logout` (Logout)
  - *(Implicitly allowed to add comments depending on controller logic).*

### Public Routes
Accessible by anyone without a token.
- `POST /api/auth/register` (Create an account)
- `POST /api/auth/login` (Authenticate and get JWT)

---

## 🗄️ Database Architecture

The MySQL database is highly relational, ensuring data integrity across the platform. Here are the core tables:

- **`users`**: Stores user credentials, names, and their assigned `role`.
- **`projects`**: Stores high-level project details (name, description, deadlines).
- **`project_members`**: A join table mapping users to the projects they are allowed to access.
- **`tasks`**: Stores individual task details, linking to a specific `project_id` and assigned to a `user_id`.
- **`task_comments`**: Stores all comments made by users on specific tasks.
- **`activity_logs`**: An audit trail that logs significant actions (like task creation or status changes) performed by users across the platform.

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

## 🌐 Deployment (Vercel) & Frontend Connection

This repository is configured as a monorepo and is natively compatible with Vercel. 

### 1. Backend Deployment
1. Import the repository into Vercel.
2. Set the **Root Directory** to `backend`.
3. Add all your database environment variables.
4. Click Deploy. Vercel will automatically run it as a Serverless Function thanks to the `vercel.json` configuration.

### 2. Frontend Connection (Important!)
Your frontend uses an Axios instance (`frontend/lib/api.ts`) that relies on the `NEXT_PUBLIC_API_URL` environment variable to know where the backend lives.
To connect the live frontend to the live backend:
1. Import the repository into Vercel again to create the frontend project.
2. Set the **Root Directory** to `frontend`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable. 
4. **Crucial:** Set its value to your live backend URL and explicitly append `/api` at the end (e.g., `https://your-backend.vercel.app/api`).
5. Click Deploy. Vercel will statically bake this URL into the frontend build.
