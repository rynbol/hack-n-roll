# 🚀 AI Student Matching App - Setup Guide

## 📦 First-Time Setup (For New Team Members)

### Prerequisites
- Node.js (v18 or later)
- Docker Desktop (for Supabase)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd double
```

### 2. Install Dependencies
```bash
npm run install:all
```

This installs dependencies for root, frontend, and backend.

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys (optional for now):
- Get Anthropic API key: https://console.anthropic.com/
- Get OpenAI API key: https://platform.openai.com/api-keys

**Note:** Supabase credentials will be auto-generated in the next step.

### 4. Install Supabase CLI
```bash
# macOS
brew install supabase/tap/supabase

# Windows (with Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### 5. Start Supabase
```bash
cd backend
DOCKER_TLS_VERIFY=0 supabase start
```

**Note:** Use `DOCKER_TLS_VERIFY=0` if you're on a network with SSL interception (like NUS).

After starting, copy the `Publishable` key from the output and update your `.env` file:
```
BACKEND_API_KEY=sb_publishable_...
```

### 6. You're Ready!
```bash
cd ..
npm run dev
```

---

## Quick Start (After Setup)

### Option 1: Use the startup script (Easiest)
```bash
./start.sh
```

### Option 2: Manual startup

#### 1. Start Supabase (Backend Database)
```bash
cd backend
DOCKER_TLS_VERIFY=0 supabase start
```

**Important:** You need the `DOCKER_TLS_VERIFY=0` because you're on the NUS network which intercepts SSL certificates.

This will start:
- 📊 PostgreSQL database on port 54322
- 🔌 API server on port 54321
- 🎨 Supabase Studio (UI) on http://127.0.0.1:54323
- 📧 Email testing on http://127.0.0.1:54324

**Leave this terminal open** - Supabase needs to keep running.

#### 2. Start Development Servers (New Terminal)
```bash
npm run dev
```

This runs both frontend and backend:
- Backend: Node.js server
- Frontend: Expo (React Native)

Or run them separately:
```bash
npm run backend:dev    # Backend only
npm run frontend       # Frontend only
```

## 📱 Running the Frontend

After `npm run dev`, you'll see an Expo menu. Press:
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open in web browser
- Scan QR code with Expo Go app on your phone

## 🔍 Checking if Everything Works

### Supabase Status
```bash
supabase status
```

You should see all services running.

### Access Supabase Studio
Open http://127.0.0.1:54323 in your browser to:
- Browse database tables
- View authentication users
- Check storage files
- Run SQL queries

## 🛑 Stopping Everything

### Stop Supabase
```bash
cd backend
supabase stop
```

### Stop Dev Servers
Press `Ctrl+C` in the terminal running `npm run dev`

## 🔧 Important Files

- `/.env` - Environment variables (API keys, Supabase credentials)
- `/backend/supabase/config.toml` - Supabase configuration
- `/backend/supabase/migrations/` - Database schema migrations
- `/backend/server.js` - Backend server entry point
- `/frontend/src/app/` - Frontend screens/pages

## 🌐 URLs

| Service | URL |
|---------|-----|
| Supabase API | http://127.0.0.1:54321 |
| Supabase Studio | http://127.0.0.1:54323 |
| Email Testing | http://127.0.0.1:54324 |
| Frontend (Expo) | http://localhost:8081 |
| Database | postgresql://postgres:postgres@127.0.0.1:54322/postgres |

## 🔑 API Keys

Your Supabase credentials are in `/.env`:
- **BACKEND_URL:** http://127.0.0.1:54321
- **BACKEND_API_KEY:** sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

## ⚠️ Troubleshooting

### "Cannot connect to Supabase"
Make sure Supabase is running:
```bash
cd backend
DOCKER_TLS_VERIFY=0 supabase start
```

### "Port already in use"
Another service is using the port. Either:
1. Stop the other service
2. Or stop Supabase and restart: `supabase stop && DOCKER_TLS_VERIFY=0 supabase start`

### "npm run dev fails"
Make sure dependencies are installed:
```bash
npm install                 # Root
cd frontend && npm install  # Frontend
cd backend && npm install   # Backend
```

## 📝 Next Steps

1. Add your AI API keys to `/.env`:
   - `ANTHROPIC_API_KEY=sk-ant-your-key`
   - `OPENAI_API_KEY=sk-your-key`

2. Start implementing the AI profile generation features

3. Test the existing dating app features in Supabase Studio
