#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}Stopping Clothes Shop Application...${NC}"

# Find and kill Node.js processes for the project components
echo "Stopping backend server..."
pkill -f "node.*be/.*start" || echo "Backend server not running"

echo "Stopping frontend portal..."
pkill -f "node.*fe-portal/.*dev" || echo "Frontend portal not running"

echo "Stopping frontend landing..."
pkill -f "node.*fe-landing/.*dev" || echo "Frontend landing not running"

echo -e "${GREEN}All applications have been stopped!${NC}"