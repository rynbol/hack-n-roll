# Double - AI-Powered Student Matching Platform

## 🎯 Overview

Double is an AI-powered student matching platform that connects university students for studying, collaboration, and academic networking. The app uses AI (Claude/OpenAI) to generate fun, characteristic profiles from photos and matches students based on university, major, classes, and interests.

## 📱 Features Implemented

### ✅ **UI/UX (Dating App UI Adapted)**
- **Welcome Screen** - Onboarding with "Find Your Study Partner" messaging
- **Home/Discover Tab** - Swipeable profile cards with like/skip functionality
- **Chat Tab** - Matches carousel and conversation list
- **Profile Tab** - Student profile with education, classes, and interests
- **Chat Details** - Real-time messaging interface
- **Onboarding Flow** - Photo upload → AI generation → Student info form

### ✅ **AI Profile Generation**
- **Multi-Provider Support** - Claude (Anthropic) and OpenAI GPT-4 Vision
- **Photo Analysis** - AI extracts characteristics, vibes, traits, interests
- **Profile Generation** - Creates funny, authentic student bios
- **Regeneration** - Switch between AI providers for different results
- **Personality Traits** - AI-detected traits displayed as tags
- **Conversation Starters** - AI-generated ice breakers

### ✅ **Student Matching**
- **University-Based** - Only matches students from same university
- **Major Compatibility** - Similar or complementary majors boost priority
- **Shared Classes** - Common courses increase match score
- **Study Interests** - Overlapping academic interests
- **Geographic Proximity** - PostGIS-powered location matching
- **Smart Algorithm** - Weighted scoring system in `get_student_profiles()` function

### ✅ **Backend API**
- **Express Server** - RESTful API with comprehensive routes
- **Profile Routes** - Upload, generate, regenerate, activate profiles
- **Student Routes** - Setup info, get majors, manage classes
- **AI Routes** - Provider management, testing, status checks
- **File Upload** - Multer + Sharp for image processing
- **Supabase Integration** - Complete database operations

### ✅ **Database Schema**
- **ai_profiles** - AI-generated content (bio, traits, interests, starters)
- **student_profiles** - University, email, major, classes, interests
- **majors** - 31 seeded majors across STEM, Business, Arts, etc.
- **classes** - Course catalog
- **student_classes** - User-class relationships
- **RLS Policies** - Row-level security on all tables
- **PostGIS** - Geographic matching capabilities

### ✅ **React Native Hooks**
- **useAuth** - Authentication state, sign in/out with OTP
- **useProfiles** - Fetch swipeable profiles, like/skip actions
- **useMatches** - Mutual matches, unmatch functionality
- **useChat** - Chat channels with realtime subscriptions
- **useMessages** - Messages per channel, send functionality

## 🏗️ Architecture

### Frontend (React Native + Expo)
```
frontend/
├── src/
│   ├── app/                        # Expo Router file-based routing
│   │   ├── index.tsx              # Welcome screen
│   │   ├── _layout.tsx            # Root layout with fonts
│   │   ├── (tabs)/                # Tab navigation group
│   │   │   ├── _layout.tsx       # Tab bar config
│   │   │   ├── home.tsx          # Discover/swipe screen
│   │   │   ├── chat.tsx          # Chat list
│   │   │   └── profile.tsx       # User profile
│   │   ├── chat/
│   │   │   └── [id].tsx          # Chat details (dynamic route)
│   │   └── (onboarding)/          # Onboarding flow
│   │       ├── photo-upload.tsx  # Photo selection
│   │       ├── preview.tsx       # AI profile preview
│   │       └── student-info.tsx  # Student form
│   ├── components/
│   │   ├── DatesCard.tsx         # Profile card component
│   │   └── MatchesList.tsx       # Matches carousel
│   ├── hooks/
│   │   ├── useAuth.ts            # Authentication
│   │   ├── useProfiles.ts        # Profile fetching/actions
│   │   ├── useMatches.ts         # Matches management
│   │   └── useChat.ts            # Chat/messages
│   └── lib/
│       └── supabase.ts           # Supabase client config
```

### Backend (Node.js + Express)
```
backend/
├── routes/
│   ├── profile.js                # Profile generation API
│   ├── student.js                # Student info API
│   └── ai.js                     # AI management API
├── services/
│   └── ai/
│       ├── providers/
│       │   ├── claude.js         # Claude Vision API
│       │   ├── openai.js         # OpenAI GPT-4 Vision
│       │   └── factory.js        # Provider factory
│       └── profileGenerator.js   # Profile orchestration
├── config/
│   └── supabaseClient.js         # Supabase config
└── supabase/
    └── migrations/                # Database migrations
        └── 20260117000000_add_ai_student_features.sql
```

## 🔧 Tech Stack

**Frontend:**
- React Native 0.79.3
- Expo ~53 (SDK 53)
- Expo Router v5 (file-based routing)
- NativeWind v4 (Tailwind for RN)
- TypeScript
- Supabase JS Client
- Expo Image Picker/Camera

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL + PostGIS)
- Anthropic Claude API
- OpenAI GPT-4 Vision API
- Multer (file uploads)
- Sharp (image processing)

**Database:**
- PostgreSQL with PostGIS
- Supabase Auth (SMS OTP)
- Supabase Storage
- Row Level Security (RLS)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase CLI
- iOS Simulator (for testing)
- Anthropic API Key (optional)
- OpenAI API Key (optional)

### Installation

1. **Clone and Install Dependencies**
```bash
cd "/Users/a737/Documents/double copy"
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

2. **Configure Environment Variables**

Create/update `/.env`:
```env
# Supabase (auto-populated from supabase start)
BACKEND_URL=http://127.0.0.1:54321
BACKEND_API_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

# AI Providers (add your keys)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
AI_DEFAULT_PROVIDER=claude
```

Update `/frontend/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

3. **Start Supabase**
```bash
cd backend
supabase start
```

4. **Run Development Servers**

From root directory:
```bash
npm run dev --localhost
```

This starts:
- **Frontend** (Expo): http://localhost:8081
- **Backend** (Express): http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323

## 📡 API Endpoints

### Profile Generation
```
POST   /api/profile/generate          # Upload photo, generate AI profile
POST   /api/profile/regenerate        # Regenerate with different AI
GET    /api/profile/:userId           # Get active profile
GET    /api/profile/:userId/all       # Get all profiles
PUT    /api/profile/:userId/activate/:profileId  # Set active profile
```

### Student Information
```
POST   /api/student/setup             # Create/update student info
GET    /api/student/:userId           # Get student profile
GET    /api/student/majors/list       # List all majors
GET    /api/student/majors/:category  # Majors by category
POST   /api/student/classes/add       # Add class to schedule
GET    /api/student/:userId/classes   # Get student's classes
```

### AI Management
```
GET    /api/ai/providers              # List available providers
POST   /api/ai/test                   # Test provider functionality
GET    /api/ai/status                 # AI service health
```

## 🎨 UI Components

### DatesCard
Profile card with image, name, age, location, major, and bio. Used in swipe carousel.

```tsx
<DatesCard
  item={profile}
  handleClick={(profile) => console.log(profile)}
/>
```

### MatchesList
Horizontal scrolling carousel of match avatars.

```tsx
<MatchesList
  data={matches}
  onMatchPress={(match) => navigateToChat(match)}
/>
```

## 🔐 Authentication Flow

1. User enters phone number
2. SMS OTP sent via Twilio (Supabase Auth)
3. User verifies OTP
4. Redirected to photo upload onboarding
5. AI generates profile
6. Student fills university/major info
7. Access to main app

## 🤖 AI Profile Generation Flow

```
1. User uploads photo
   ↓
2. Photo uploaded to Supabase Storage
   ↓
3. Backend calls AI provider (Claude or OpenAI)
   ↓
4. AI analyzes photo → extracts characteristics
   ↓
5. AI generates bio, traits, interests, conversation starters
   ↓
6. Saved to ai_profiles table
   ↓
7. User previews, can regenerate with different AI
   ↓
8. Profile activated and linked to main profile
```

## 💬 Chat System

- **Channels**: Created when users match
- **Realtime**: Supabase realtime subscriptions for live updates
- **Messages**: Stored in `chat.messages` table
- **Typing Indicators**: Can be added via presence
- **Read Receipts**: Timestamp-based

## 🔍 Matching Algorithm

Implemented in `get_student_profiles()` PostgreSQL function:

1. **Same University** (Required)
2. **Shared/Complementary Majors** (Boost score)
3. **Common Classes** (Boost score)
4. **Study Interests Overlap** (Boost score)
5. **Geographic Proximity** (PostGIS distance calculation)
6. **Age Range** (Configurable filtering)
7. **Exclude Already Interacted** (Liked/skipped users filtered out)

## 📊 Database Tables

### Core Tables
- **profiles** - Basic user info, location (PostGIS point)
- **interactions** - Likes, skips, matches
- **preferences** - User preferences

### AI/Student Tables (New)
- **ai_profiles** - AI-generated content
- **student_profiles** - University, major, email, classes
- **majors** - 31 seeded majors
- **classes** - Course catalog
- **student_classes** - User-class relationships

### Chat Tables
- **chat.channels** - Chat channels
- **chat.messages** - Messages
- **chat.channel_participants** - Channel members

## 🧪 Testing

### Backend API Testing
```bash
# Health check
curl http://localhost:3000/health

# List AI providers
curl http://localhost:3000/api/ai/providers

# Get majors
curl http://localhost:3000/api/student/majors/list
```

### Frontend Testing
1. Open iOS simulator
2. Shake device → Reload
3. Navigate through tabs
4. Test swipe functionality
5. Upload photo and generate profile

## 🐛 Troubleshooting

### "Failed to compile" - icon.png not found
**Fixed**: All references updated to `HeartIcon.png` which exists in assets.

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Supabase not running
```bash
cd backend
supabase start
```

### Frontend not connecting to backend
Ensure backend URL in `/frontend/.env` is correct:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

## 📝 Next Steps

### To Implement
- [ ] Real authentication (complete OTP flow)
- [ ] Photo upload test with real AI generation
- [ ] Match notification system
- [ ] Push notifications (Expo Notifications)
- [ ] Profile editing
- [ ] Report/block users
- [ ] Admin dashboard
- [ ] Analytics

### Enhancements
- [ ] Multiple photos per profile
- [ ] Video profiles
- [ ] Study group creation
- [ ] Event matching (study sessions)
- [ ] Calendar integration
- [ ] GPA/academic achievement display
- [ ] Verified student badges

## 📚 Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **NativeWind**: https://www.nativewind.dev/v4/overview
- **Claude API**: https://docs.anthropic.com/
- **OpenAI API**: https://platform.openai.com/docs

## 👥 Contributing

This is a student project. For collaboration:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ by the Double team**
