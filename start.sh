#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AI Student Matching App${NC}\n"

# Check if Supabase is running
if ! curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 Starting Supabase local server...${NC}"
    cd backend
    DOCKER_TLS_VERIFY=0 supabase start
    cd ..
    echo -e "${GREEN}✅ Supabase started!${NC}\n"
else
    echo -e "${GREEN}✅ Supabase is already running!${NC}\n"
fi

echo -e "${BLUE}🎯 Starting Development Servers...${NC}"
echo -e "${YELLOW}Backend: http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:8081${NC}"
echo -e "${YELLOW}Supabase Studio: http://127.0.0.1:54323${NC}\n"

# Start the app
npm run dev
