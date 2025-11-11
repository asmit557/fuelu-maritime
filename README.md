# ⚓ FuelEU Maritime Compliance Platform

A production-ready web platform for monitoring and managing maritime GHG emissions compliance under the **FuelEU Maritime Regulation (EU) 2023/1805**.

## 🎯 Features

- **JWT-Based Authentication**: Secure login and authorization using JSON Web Tokens (HTTP-only cookies)
- **Routes Management**: Track vessel routes with GHG intensity, fuel consumption, and emissions data  
- **Compliance Comparison**: Compare actual emissions against FuelEU targets (2025-2050)  
- **Banking System**: Bank surplus compliance balance for future use  
- **Pooling Arrangements**: Create multi-ship pooling with automatic validation  

## 🏗️ Architecture

Built using **Hexagonal Architecture (Ports & Adapters)** for maximum testability and maintainability.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm  
- PostgreSQL 14+  
- Git  

### Backend Setup

Backend runs on `http://localhost:3000`

### Frontend Setup

Frontend runs on `http://localhost:5173`

---

# 🚀 Complete Setup and Run Instructions

## 🧰 Prerequisites
Before starting, ensure you have:

- **Node.js 18+ and npm**
- **PostgreSQL 14+ installed and running**
- **Git installed**
- **A terminal/command prompt**

---

## 📦 Step 1: Clone or Navigate to Project
```bash
# If you already have the project
cd fueleu-maritime-platform

# If cloning from repository
git clone <your-repo-url>
cd fueleu-maritime-platform
```

---

## 🗄️ Step 2: Database Setup

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fueleu_maritime;

# Grant privileges (optional)
GRANT ALL PRIVILEGES ON DATABASE fueleu_maritime TO postgres;

# Exit
\q
```

### Run Migrations (Create Tables)
```bash
cd backend
psql -U postgres -d fueleu_maritime -f src/infrastructure/db/schema.sql
psql -U postgres -d fueleu_maritime -f src/infrastructure/db/auth-schema.sql

# OR
npm run db:migrate
```

### Seed Database
```bash
# Still in backend
psql -U postgres -d fueleu_maritime -f src/infrastructure/db/seeds.sql

# OR
npm run db:seed
```

### Verify Database Setup
```bash
psql -U postgres -d fueleu_maritime
\dt
SELECT route_id, vessel_type, is_baseline FROM routes;
SELECT email, role FROM users;
\q
```

---

## ⚙️ Step 3: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Create Environment File
```bash
touch .env
# OR (Windows)
type nul > .env
```

### Configure Environment Variables
In `backend/.env`:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_maritime
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your-minimum-32-character-random-secret-key-here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

⚠️ Replace `your_postgres_password_here` with your actual PostgreSQL password.

### Start Backend Server
```bash
npm run dev
```

Expected Output:
```
✓ Database connected successfully
✓ Server running on port 3000
✓ API available at http://localhost:3000/api
```
Keep this terminal open — the backend runs continuously.

---

## 🎨 Step 4: Frontend Setup

### Open New Terminal
Keep backend running.

### Install Dependencies
```bash
cd frontend
npm install
npm install framer-motion
```

### (Optional) Create Environment File
```bash
touch .env
# OR (Windows)
type nul > .env
```

### Configure Frontend `.env`
```bash
VITE_API_URL=http://localhost:3000/api
```

### Start Frontend Server
```bash
npm run dev
```

Expected Output:
```
VITE v5.0.7  ready in 523 ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Step 5: Access the Application

Open browser → `http://localhost:5173`

### Login Options
- **Quick Demo Access:** "Quick Demo Access" → logs in as guest  
- **Admin Account:**  
  `admin@fueleu.com / admin123`  
- **Demo User Account:**  
  `demo@fueleu.com / demo123`  
- **Register New Account:** Sign up manually  

---

## 🎯 Step 6: Explore the Application

### 1. Routes Tab
View routes, filter by vessel/fuel/year, set baselines, inspect emissions.

### 2. Compare Tab
Compare actual vs target GHG intensity, see compliance %, view charts.

### 3. Banking Tab
Fetch compliance balance, bank surpluses, apply banked values, view history.

### 4. Pooling Tab
Create multi-ship pools, balance CBs, validate conservation automatically.

---

## 🛑 Stopping the Application

**Frontend:**
```bash
Ctrl + C
```

**Backend:**
```bash
Ctrl + C
```

---

## 🔄 Restarting

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📊 Database Schema

## 🔗 API Endpoints

### Routes
- `GET /api/routes`
- `POST /api/routes/:id/baseline`
- `GET /api/routes/comparison`

### Compliance
- `GET /api/compliance/cb`
- `GET /api/compliance/adjusted-cb`

### Banking
- `GET /api/banking/records`
- `POST /api/banking/bank`
- `POST /api/banking/apply`

### Pooling
- `POST /api/pools`

---

## 📚 Technology Stack

**Backend:** Node.js, Express.js, PostgreSQL, TypeScript  
**Frontend:** React 18, TailwindCSS, Vite  
**Testing:** Jest, Vitest, Supertest  

---

## 🤝 AI-Assisted Development
Developed with AI tools (Claude, Copilot). See `AGENT_WORKFLOW.md` for detailed AI usage logs.

---

## 📄 License
MIT License

---

**Built with ⚓ for maritime sustainability**
