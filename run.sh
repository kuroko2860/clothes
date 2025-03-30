#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Clothes Shop Application...${NC}"

# Kill processes on specific ports
echo -e "${RED}Killing processes on ports 8080, 3000, and 3001...${NC}"
# For Windows, use netstat and taskkill
netstat -ano | findstr :8080 | awk '{print $5}' | xargs -r taskkill //PID //F
netstat -ano | findstr :3000 | awk '{print $5}' | xargs -r taskkill //PID //F
netstat -ano | findstr :3001 | awk '{print $5}' | xargs -r taskkill //PID //F
echo -e "${GREEN}Ports cleared!${NC}"

# Check if concurrently is installed
if ! command -v concurrently &> /dev/null; then
    echo -e "${BLUE}Installing concurrently...${NC}"
    npm install -g concurrently
fi

# Run all applications concurrently
concurrently \
    --names "BE,FE-PORTAL,FE-LANDING" \
    --prefix-colors "yellow,blue,green" \
    "cd be && npm run start" \
    "cd fe-portal && npm run dev" \
    "cd fe-landing && npm run dev"

echo -e "${GREEN}All applications have been started! Press Ctlr+C to stop.${NC}"

# Keep the terminal window open
echo "Press any key to exit..."
read -n 1 -s