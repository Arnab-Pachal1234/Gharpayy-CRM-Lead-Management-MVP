# 🏢 Gharpayy CRM - Lead Management MVP

A **full-stack Minimum Viable Product (MVP)** built to solve
**real-estate lead leakage**.\
This CRM centralizes lead capture, automates agent assignment based on
workload, provides **role-based access control**, and enables
**real-time team communication**.

------------------------------------------------------------------------

## 🚀 Tech Stack

  Layer                         Technologies
  ----------------------------- ---------------------------------------
  **Frontend**                  React.js (Vite), Tailwind CSS
  **Backend**                   Node.js, Express.js
  **Database**                  MongoDB, Mongoose
  **Real-Time Communication**   Socket.io
  **Security**                  JSON Web Tokens (JWT), bcryptjs
  **Automation**                Node-Cron (Daily Follow-up Reminders)

------------------------------------------------------------------------

## ✨ Core Features

### 1️⃣ Automated Lead Assignment

-   New leads are **automatically assigned** to the agent with the
    **lowest active workload (`currentLoad`)**.
-   Ensures balanced lead distribution among agents.

### 2️⃣ Role-Based Access Control (RBAC)

#### 👑 Admin Capabilities

-   View **all leads** across the organization.
-   **Manually reassign** leads using a dropdown selector.
-   Access the **Team Directory**.
-   Monitor team activity.

#### 👨‍💼 Agent Capabilities

-   View **only leads assigned to them**.
-   Update **lead status** and follow-ups.
-   Track progress through the sales pipeline.

### 3️⃣ Kanban Pipeline

-   Visual **lead tracking board**.
-   Status-based workflow:
    -   New
    -   Contacted
    -   Qualified
    -   Visit Scheduled
    -   Negotiation
    -   Booked

### 4️⃣ Real-Time Team Chat

-   Built with **WebSockets (Socket.io)**.
-   Instant communication between **admins and agents**.
-   No page refresh required.

### 5️⃣ Automated Follow-up Reminders

-   **Node-Cron job** runs daily.
-   Flags leads that **haven't been contacted in 24 hours**.
-   Prevents **lead leakage**.

------------------------------------------------------------------------

## 📂 Project Structure

    gharpayy-crm/
    │
    ├── backend/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── sockets/
    │   └── server.js
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── hooks/
    │   │   └── App.jsx
    │
    └── README.md

------------------------------------------------------------------------

## 🛠️ How to Run Locally

### 1️⃣ Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file inside the **backend** folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

Start the backend server:

``` bash
npm run dev
```

------------------------------------------------------------------------

### 2️⃣ Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

The frontend will start on:

    http://localhost:5173

------------------------------------------------------------------------

## 📝 Test Credentials

To test the **Role-Based Access Control** features, use the following
accounts:

  Role        Email                Password
  ----------- -------------------- -------------
  **Admin**   admin@gharpayy.com   password123
  **Agent**   rahul@gharpayy.com   password123

------------------------------------------------------------------------

## 📸 Key Highlights

-   ⚡ **Real-time lead management**
-   👥 **Team collaboration via chat**
-   🔐 **Secure authentication with JWT**
-   📊 **Kanban-style lead pipeline**
-   🤖 **Automated follow-up reminders**
-   ⚖️ **Smart workload-based lead assignment**

------------------------------------------------------------------------

## 🌟 Future Improvements

-   Lead analytics dashboard
-   Email/SMS notifications for follow-ups
-   Calendar integration for site visits
-   AI-based lead scoring
-   Mobile app version

------------------------------------------------------------------------

## 👨‍💻 Author

**Arnab Pachal**\
Full Stack Developer

------------------------------------------------------------------------

## 📜 License

This project is built for **demonstration and MVP purposes**.
