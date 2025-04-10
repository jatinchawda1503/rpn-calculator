# CI/CD Workflow for RPN Calculator

This document explains how the Continuous Integration (CI) and Continuous Deployment (CD) workflow is set up for the RPN Calculator project.

## Overview

The project uses GitHub Actions to automate testing and building of the application. The workflow is defined in `.github/workflows/main.yml` and automatically runs when:

- A pull request is created or updated targeting the `main` branch
- Code is pushed to the `main` branch

## Workflow Details

### 1. Testing Phase

The workflow first runs tests for all components of the application:

- **Core Package Tests**: Runs all tests for the core calculator functionality
- **Backend Tests**: Runs FastAPI backend tests
- **Frontend Tests**: Runs Next.js frontend tests

For testing, the workflow:
- Sets up a PostgreSQL test database
- Creates necessary environment files
- Installs dependencies for each component
- Runs the test suite for each component

### 2. Build Phase

If tests pass and the event is a push to `main`, the workflow:
- Builds the Docker images using the production Docker Compose file
- This verifies that the application can be properly built for production

### 3. Pull Request Approval

For pull requests, a special job runs to create a status check that can be used with branch protection rules to prevent merging unless tests pass.

## Development Workflow

As a developer, here's how to work with this CI/CD pipeline:

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**:
   - Implement your feature or fix
   - Write tests for your changes

3. **Test Locally Before Pushing**:
   ```bash
   # Test core changes
   cd core && python -m tests.run_all_tests
   
   # Test backend changes
   cd backend && pytest
   
   # Test frontend changes
   cd frontend && npm test
   ```

4. **Push Your Branch and Create a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```
   - Then create a Pull Request on GitHub targeting the `main` branch

5. **CI Pipeline Will Automatically Run**:
   - The GitHub Actions workflow will run all tests
   - Wait for the tests to complete
   - Fix any issues if tests fail

6. **Ready to Merge**:
   - Once all tests pass, the PR can be merged
   - Branch protection rules ensure tests must pass before merging is allowed

## Troubleshooting

If the CI pipeline fails:

1. Click on the failed workflow in GitHub to see the detailed error logs
2. Fix the identified issues in your branch
3. Push the changes to update the PR
4. The workflow will automatically run again

## Adding Custom Tests

If you add new components or functionality that needs testing:

1. Add your tests to the appropriate test directory
2. Ensure they are discovered by the testing framework
3. Consider updating the workflow if special setup is needed for your tests 