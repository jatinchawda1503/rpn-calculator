#!/bin/bash

# Stop on errors
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       RPN Calculator Test Suite        ${NC}"
echo -e "${BLUE}========================================${NC}"

# Run core tests (moved to core/tests)
echo -e "\n${BLUE}Running core package tests...${NC}"
cd core
python -m tests.run_all_tests
cd ..

# Run frontend linting if available
if [ -d "frontend" ]; then
    echo -e "\n${BLUE}Running frontend linting...${NC}"
    cd frontend
    npm run lint
    cd ..
fi

echo -e "\n${GREEN}All tests completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}" 