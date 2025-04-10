# Contributing to RPN Calculator

Thank you for considering contributing to the RPN Calculator project! This document outlines the process for contributing to this project.

## Development Workflow

1. **Fork the repository** (if you're an external contributor).
2. **Create a feature branch** from `main`:
   ```
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and write tests for them.
4. **Test your changes** locally:
   ```
   # Run core tests
   cd core
   python -m pytest
   
   # Run backend tests
   cd backend
   python -m pytest
   
   # Run frontend tests
   cd frontend
   npm test
   ```
5. **Commit your changes** with descriptive commit messages.
6. **Push your branch** to GitHub.
7. **Create a Pull Request** to the `main` branch.

## Branch Protection Rules

The `main` branch is protected with the following rules:

- All commits must be made via pull requests
- Pull requests require at least one approval
- All required CI checks must pass before merging
- Force pushes to the `main` branch are not allowed
- Branch must be up to date before merging

These rules ensure code quality and prevent accidental breaking changes.

## Code Style and Standards

- **Python code** should follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines.
- **JavaScript/TypeScript code** should follow the project's ESLint configuration.
- **Documentation** is required for all new features and public APIs.
- **Tests** are required for all new features and bug fixes.

## Commit Messages

Write clear and meaningful commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or fewer
- Reference issues and pull requests after the first line

## Pull Request Process

1. Update the README.md or documentation with details of changes where appropriate.
2. The PR should be reviewed by at least one maintainer.
3. Once approved, the PR can be merged by a project maintainer.

## Setting Up Development Environment

Please refer to the README.md file for detailed setup instructions. 