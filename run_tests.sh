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

# Run backend tests if available
if [ -d "backend/tests" ]; then
    echo -e "\n${BLUE}Running backend tests...${NC}"
    echo "Building and running backend tests in Docker..."

    # Build the Docker image with the test stage
    docker build -t rpn-calculator-backend:test --target test -f backend/Dockerfile .

    # Run the tests inside the container
    docker run --rm rpn-calculator-backend:test

    echo -e "\n${GREEN}All tests completed successfully!${NC}"
    echo -e "${BLUE}========================================${NC}"
fi

# Run frontend tests if available
if [ -d "frontend/tests" ]; then
    echo -e "\n${BLUE}Running frontend tests...${NC}"
    cd frontend
    npm test
    cd ..
fi

echo -e "\n${GREEN}All tests completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}" 