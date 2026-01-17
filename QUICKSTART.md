# 🚀 Quick Start Guide - Double

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase CLI installed
- [ ] Xcode (for iOS Simulator)
- [ ] AI API keys (Anthropic or OpenAI)

## Start in 3 Commands

```bash
# 1. Start Supabase
cd "/Users/a737/Documents/double copy/backend" && supabase start

# 2. Add your AI keys to .env
# Edit /.env and add:
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# 3. Start everything
cd "/Users/a737/Documents/double copy" && npm run dev --localhost
```

## What Just Happened?

✅ **Supabase** started on http://127.0.0.1:54321

- Studio: http://127.0.0.1:54323
- Database with 20 migrations applied
- Storage bucket `profiles` ready

✅ **Backend API** started on http://localhost:3001

- Express server with AI integration
- Gemini AI provider initialized
- Profile/Student/AI routes active

✅ **Frontend** started on http://localhost:8081

- Expo dev server running
- iOS Simulator should open automatically
- Hot reload enabled

## Test It Out

### 1. Check Backend is Running

```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","message":"Double API is running"}`

### 2. Test AI Providers

```bash
curl http://localhost:3001/api/ai/providers
```

Should list available providers (gemini)

### 3. Check Database

Open Supabase Studio: http://127.0.0.1:54323

Navigate to:

- **Table Editor** → See all tables
- **SQL Editor** → Run queries
- **Storage** → View `profiles` bucket

### 4. Navigate the App

On iOS Simulator:

1. You'll see "Find Your Study Partner" welcome screen
2. Tap "Get Started"
3. Navigate through 3 tabs:
   - **Discover** - Swipe on profiles (currently empty, needs real data)
   - **Chats** - View matches and conversations
   - **Profile** - Your student profile

## Common Issues

### "icon.png not found"

✅ **FIXED** - All references updated to use `HeartIcon.png`

### Port 3001 already in use

```bash
lsof -ti:3001 | xargs kill -9
```

### Simulator not connecting to backend

Make sure `/frontend/.env` has:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3001
```

Then reload: Shake device → Press "Reload"

### No AI providers available

Check backend logs - you should see:

```
✓ Gemini AI provider initialized
```

If not, add your GEMINI_API_KEY to `/.env`

## What to Test Next

### 1. Create Test Profiles (Manual)

Use Supabase Studio SQL Editor:

```sql
-- Create a test user profile
INSERT INTO profiles (user_id, name, age, city, country, location)
VALUES (
  gen_random_uuid(),
  'Test Student',
  20,
  'Boston',
  'USA',
  ST_SetSRID(ST_MakePoint(-71.0589, 42.3601), 4326)
);

-- Create student profile
INSERT INTO student_profiles (user_id, university, email, major)
VALUES (
  (SELECT user_id FROM profiles ORDER BY created_at DESC LIMIT 1),
  'Boston University',
  'test@bu.edu',
  'Computer Science'
);
```

### 2. Test Photo Upload Flow

1. Navigate to `/(onboarding)/photo-upload`
2. Select a photo
3. Watch AI generate profile
4. Preview generated content
5. Fill student info

### 3. Test Matching

1. Create 2+ test profiles with same university
2. Open Discover tab
3. Swipe right (like) or left (skip)
4. Check interactions table in Supabase

### 4. Test Chat

1. Create a match (mutual likes)
2. Navigate to Chats tab
3. Open conversation
4. Send a message
5. Check real-time updates

## Development Workflow

### Making Changes

**Frontend:**

- Edit files in `/frontend/src/`
- Auto-reloads with hot reload
- Check Metro bundler logs

**Backend:**

- Edit files in `/backend/`
- Server auto-restarts with `--watch` flag
- Check terminal logs

**Database:**

- Create migration: `supabase migration new name`
- Apply: `supabase db reset`
- Or use Studio UI

### Debugging

**Frontend:**

- Shake device → Debug Menu
- Enable Remote JS Debugging
- Console logs appear in Chrome DevTools

**Backend:**

- Check terminal output
- Add `console.log()` statements
- Use `curl` to test endpoints

**Database:**

- Supabase Studio → SQL Editor
- Run queries directly
- Check table contents

## Key Files Reference

### Configuration

- `/.env` - Main environment variables
- `/frontend/.env` - Frontend-specific vars
- `/backend/server.js` - Express server entry

### Routes

- `/backend/routes/profile.js` - Photo upload, AI generation
- `/backend/routes/student.js` - Student info management
- `/backend/routes/ai.js` - AI provider management

### Screens

- `/frontend/src/app/index.tsx` - Welcome screen
- `/frontend/src/app/(tabs)/home.tsx` - Discover/swipe
- `/frontend/src/app/(tabs)/chat.tsx` - Chat list
- `/frontend/src/app/(tabs)/profile.tsx` - User profile
- `/frontend/src/app/chat/[id].tsx` - Chat details

### Hooks

- `/frontend/src/hooks/useAuth.ts` - Authentication
- `/frontend/src/hooks/useProfiles.ts` - Profile fetching/actions
- `/frontend/src/hooks/useMatches.ts` - Matches
- `/frontend/src/hooks/useChat.ts` - Chat/messages

## Next Steps

1. **Add Real Authentication**
   - Implement OTP flow in welcome screen
   - Connect to Supabase Auth

2. **Test AI Generation**
   - Get Anthropic or OpenAI API key
   - Upload a photo
   - Verify profile generation

3. **Create Seed Data**
   - Add test users with photos
   - Populate student profiles
   - Add classes and interests

4. **Deploy**
   - Set up remote Supabase project
   - Deploy backend to Heroku/Railway
   - Build iOS/Android apps

## Need Help?

- Check full docs: `IMPLEMENTATION.md`
- Review plan: Original plan from chat
- Supabase logs: `supabase logs`
- Backend logs: Terminal output
- Frontend logs: Metro bundler

## Useful Commands

```bash
# Restart Supabase
supabase stop && supabase start

# Reset database (reapply migrations)
cd backend && supabase db reset

# Clear Expo cache
cd frontend && npx expo start -c

# View Supabase logs
supabase logs

# Check running processes
lsof -ti:3001  # Backend
lsof -ti:8081  # Expo

# Kill processes
lsof -ti:3001 | xargs kill -9
```

---

**You're all set! Happy coding! 🎉**
