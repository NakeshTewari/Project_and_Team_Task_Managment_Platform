# Project and Team Task Management Platform

A full-stack web application designed for teams to seamlessly manage projects, assign tasks, collaborate through comments, and track activity.

### 🔗 Live Demo
- **Frontend (Web App):** [Link](https://project-and-team-task-managment-pla-beta.vercel.app/)
- **Backend (API):** [Link](https://project-and-team-task-managment-pla-git-807d34-nakeshs-projects.vercel.app)

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

## 🔒 Roles & Access Control

The platform implements robust Role-Based Access Control (RBAC) to ensure users only see and modify what they are allowed to.

### Roles
1. **ADMIN**
   - Has full control over the platform.
   - Can manage (CRUD) all Users.
   - Can view system-wide Activity Logs.
   - Can create, edit, and delete any Projects and Tasks.
   
2. **PROJECT_MANAGER**
   - Can create, edit, and delete Projects and Tasks.
   - Can add or remove members from specific projects.

3. **MEMBER / USER**
   - Can view projects they are assigned to.
   - Can view and update the status of their assigned tasks.
   - Can add comments to tasks to communicate with the team.

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

## 🌐 Deployment (Vercel)

This repository is configured as a monorepo and is natively compatible with Vercel.

### Backend Deployment
1. Import the repository into Vercel.
2. Set the **Root Directory** to `backend`.
3. Add all your database environment variables.
4. Click Deploy. Vercel will automatically run it as a Serverless Function thanks to the `vercel.json` configuration.

### Frontend Deployment
1. Import the repository into Vercel again.
2. Set the **Root Directory** to `frontend`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable, pointing to your live backend URL (make sure to append `/api` at the end).
4. Click Deploy.
