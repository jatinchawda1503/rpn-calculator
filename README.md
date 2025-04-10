# RPN Calculator

A full-stack application for Reverse Polish Notation (RPN) calculations with enhanced mathematical capabilities.

## Quick Start Guide

### For Users
1. **Launch the application**:
   ```bash
   docker-compose up
   ```

2. **Access the calculator**:
   - Open your browser to http://localhost:3000
   
3. **Use the RPN calculator**:
   - Enter a number (e.g., `5`)
   - Press `Enter` to push it to the stack
   - Enter another number (e.g., `3`)
   - Press `Enter` again
   - Press an operator button (e.g., `+`)
   - The result will be calculated (8)

4. **Advanced calculations**:
   - Toggle to Advanced mode for functions like `sqrt`, `sin`, and more
   - Example: To calculate `√(3² + 4²)`, enter:
     ```
     3 Enter 2 ^ 4 Enter 2 ^ + sqrt
     ```
   - Result: 5

### For Developers
1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd rpn-calculator
   ```

2. **Choose your development mode**:
   - **Docker-based**: `docker-compose up`
   - **Local development**:
     ```bash
     cd core && pip install -e .
     cd ../backend && uvicorn main:app --reload &
     cd ../frontend && npm install && npm run dev
     ```

3. **Make frontend changes**:
   - Edit files in `frontend/src/`
   - Changes will auto-reload in development mode
   - If changes don't appear, try:
     ```bash
     docker-compose restart frontend
     # or
     docker-compose down && docker-compose up
     ```

4. **Make backend changes**:
   - Edit files in `backend/` or `core/`
   - Backend will auto-reload with the `--reload` flag

5. **Switch to production mode**:
   ```bash
   docker-compose -f docker-compose.prod.yml up
   ```

## Project Overview

This project consists of:

- **Core**: Self-contained Python package for RPN calculator logic with advanced mathematical functions
- **Backend**: FastAPI service that provides a REST API for calculations
- **Frontend**: Next.js web application with an interactive calculator interface
- **Database**: PostgreSQL for persisting calculation history

## Features

- Perform calculations using Reverse Polish Notation
- Advanced mathematical functions (trigonometry, logarithms, factorial, etc.)
- Interactive stack visualization to understand RPN calculations
- Toggle between basic and advanced calculator modes
- View detailed steps of each calculation
- Save calculation history in a database
- Upload CSV files with multiple expressions to calculate
- View calculation history by user

## Supported Operations

### Basic Operations
- Addition (`+`)
- Subtraction (`-`)
- Multiplication (`*`)
- Division (`/`)
- Power (`^`)
- Modulo (`%`)

### Advanced Operations
- Square Root (`sqrt`)
- Sine (`sin`) - in degrees
- Cosine (`cos`) - in degrees
- Tangent (`tan`) - in degrees
- Logarithm base 10 (`log`)
- Natural Logarithm (`ln`)
- Factorial (`!`)

### Constants
- Pi (`pi`)
- Euler's number (`e`)

## Project Structure

```
rpn-calculator/
│
├── core/                # Self-contained core calculator package
│   ├── rpn/             # RPN implementation
│   ├── db/              # Database models and connections
│   ├── tests/           # Core unit tests
│   │   ├── test_rpn.py           # Pytest tests for RPN functionality
│   │   ├── test_db.py            # Pytest tests for database models
│   │   ├── calculator_test.py    # Standalone calculator test script
│   │   ├── factorial_test.py     # Factorial function test script
│   │   └── run_all_tests.py      # Script to run all tests
│   ├── setup.py         # Package setup file
│   ├── requirements.txt # Core package dependencies
│   ├── MANIFEST.in      # Package manifest
│   └── README.md        # Core package documentation
│
├── backend/             # FastAPI server
│   ├── api/             # API routes
│   └── Dockerfile       # Backend container definition
│
├── frontend/            # Next.js frontend
│   ├── src/             # React components and pages
│   ├── Dockerfile       # Production container definition
│   └── Dockerfile.dev   # Development container definition
│
├── docker-compose.yml         # Development Docker Compose configuration
├── docker-compose.prod.yml    # Production Docker Compose configuration
├── run_tests.sh               # Main test runner script
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- Python 3.8+ (for local development)

### Setup and Running

1. Clone the repository:
   ```
   git clone <repository-url>
   cd rpn-calculator
   ```

2. Start the application:

   **For Development (with hot-reloading):**
   ```bash
   # Start development containers
   docker-compose up
   ```

   **For Production:**
   ```bash
   # Start production containers
   docker-compose -f docker-compose.prod.yml up
   ```

3. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Environment Configuration

The project uses environment variables for configuration. Sample `.env.sample` files are provided in the repository:

1. **Root Directory** (`.env.sample`): 
   - Contains variables used by Docker Compose
   - Database credentials and connection settings
   - Service URLs and ports

2. **Backend** (`backend/.env.sample`):
   - API configuration
   - Database connection details
   - CORS settings for the frontend

3. **Frontend** (`frontend/.env.sample`):
   - API URL configuration for connecting to the backend

4. **Core Module** (`core/.env.sample`):
   - Database settings for the core package when used standalone

To set up your environment:

```bash
# Copy all sample env files to their respective locations
cp .env.sample .env
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
cp core/.env.sample core/.env

# Edit each .env file to customize settings as needed
```

For Docker Compose, the environment variables will be loaded from the `.env` file in the project root and from the individual component `.env` files specified in the `env_file` section of the Docker Compose configuration.

### Development vs Production Setup

The project includes separate configurations for development and production:

#### Development Setup
- Uses `docker-compose.yml`
- Frontend runs with hot-reloading via `npm run dev`
- Volume mounts for live code updates
- Backend runs with `--reload` flag for auto-reloading
- Node modules are stored in a named volume to avoid host/container permission issues

#### Production Setup
- Uses `docker-compose.prod.yml`
- Frontend is built with `npm run build` and served with `npm start`
- Backend runs without reloading for better performance
- No volume mounts for source code

To rebuild containers after major changes:
```bash
# For development
docker-compose build --no-cache

# For production
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Local Development Setup

For local development without Docker, install the core package:

```bash
# Install the core package in development mode
cd core
pip install -e .

# Run the backend
cd ../backend
uvicorn main:app --reload

# Run the frontend
cd ../frontend
npm install
npm run dev
```

## API Usage

The API provides the following endpoints:

- `POST /api/calculate` - Calculate an RPN expression
  ```json
  {
    "expression": "3 4 +",
    "user_id": "user1"
  }
  ```

- `GET /api/history/{user_id}` - Get calculation history for a user
  - Optional query parameter: `limit` (default: 50) - Maximum number of records to return

- `POST /api/upload-csv` - Upload a CSV file with expressions to calculate

- `GET /api/supported-operations` - Get a list of all supported operations

## How To Use RPN Calculator

Reverse Polish Notation (RPN) is a mathematical notation where every operator follows all its operands. 

### Basic Usage
1. **Enter a number** - Type a number using the digit buttons
2. **Push to stack** - Press `Enter` to push the number to the stack
3. **Enter another number** - Type another number
4. **Push to stack** - Press `Enter` again to push the second number
5. **Apply operation** - Press an operator button (e.g., `+`, `-`, `*`)
6. **View result** - The result appears and is pushed to the stack

### Step-by-Step Examples

#### Example 1: Basic Addition (3 + 4)
1. Press `3`
2. Press `Enter`
3. Press `4`
4. Press `Enter`
5. Press `+`
6. Result: 7

#### Example 2: Nested Expression ((6 + 8) ^ 2) / (102 - 53)
1. Press `6`, then `Enter`
2. Press `8`, then `Enter`
3. Press `+` (Result: 14)
4. Press `2`, then `Enter`
5. Press `^` (Result: 196)
6. Press `102`, then `Enter`
7. Press `53`, then `Enter`
8. Press `-` (Result: 49)
9. Press `/` (Result: 4)

#### Example 3: Using Advanced Functions (sin(45°) * √16)
1. Press `45`, then `Enter`
2. Press `sin` (Result: 0.7071)
3. Press `16`, then `Enter`
4. Press `sqrt` (Result: 4)
5. Press `*` (Result: 2.8284)

### Special Operations
- **Swap**: Exchange the top two stack values
- **Undo**: Revert the last operation
- **Clear**: Reset the entire calculator

To see your calculation history, click the "History" tab at the top of the calculator interface.

## Running Tests

### Quick Test (Recommended for First-Time Users)

For a quick test of the calculator functionality without requiring Docker:

```bash
# Run the comprehensive test suite
cd core
python -m tests.run_all_tests

# Or run individual test scripts directly
python tests/calculator_test.py
python tests/factorial_test.py
```

These scripts will run several test cases and show the results directly in your terminal.

### Using Docker

To run all tests using Docker:

```bash
# Run the test service
docker-compose run test
```

### Running Tests Locally

If you prefer to run the formal tests directly on your machine:

```bash
# Ensure the core package is installed
cd core
pip install -e .

# Run core tests
python -m tests.run_all_tests
```

### Example Test Expressions

Here are some example expressions you can use to test the calculator:

- Basic: `3 4 +` (Result: 7)
- Chained: `5 6 + 2 *` (Result: 22)
- With advanced functions: `16 sqrt` (Result: 4)
- Complex: `3 4 + 5 * sqrt` (Result: ~5.916)
- Using constants: `pi 2 *` (Result: ~6.283)

## Development

For development purposes, you can run each component separately:

```bash
# Run backend only
cd backend
uvicorn main:app --reload

# Run frontend only
cd frontend
npm run dev
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:
1. Make sure the PostgreSQL container is running: `docker ps`
2. Check database logs: `docker-compose logs db`
3. If needed, reset the database: `docker-compose down -v && docker-compose up db -d`

### Frontend Development Issues

If your frontend changes aren't reflecting:
1. Make sure you're using the development setup: `docker-compose up`
2. Check container logs: `docker-compose logs -f frontend`
3. Sometimes you need to restart the container: `docker-compose restart frontend`
4. For Windows users, ensure proper line endings (LF not CRLF)

### Package Installation Issues

If you have issues with the core package:
1. Check if it's properly installed: `pip list | grep rpn_calculator_core`
2. Reinstall if needed: `cd core && pip install -e .`
3. Clear Python cache if needed: `find . -name "*.pyc" -delete && find . -name "__pycache__" -delete`

### Testing Issues

If you have issues with the test scripts:
1. Try running the standalone test first: `cd core && python tests/calculator_test.py`
2. Check if the core package is installed: `pip list | grep rpn_calculator_core`
3. Verify all dependencies are installed: `cd core && pip install -r requirements.txt`

## License

[MIT License](LICENSE) 
