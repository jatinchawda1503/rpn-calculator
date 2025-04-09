# RPN Calculator Core

Core functionality package for the RPN Calculator application.

## Overview

This package provides the core calculator logic and database models for the RPN Calculator application. It's designed to be used as a standalone package or as part of the full-stack application.

## Features

- Reverse Polish Notation (RPN) calculator implementation
- Advanced mathematical functions (trigonometry, logarithms, factorial, etc.)
- Database models and utilities for storing calculation history
- Comprehensive testing suite

## Installation

```bash
# Install from the current directory
pip install -e .

# Or install from a specific source
pip install rpn_calculator_core
```

## Usage

```python
from core.rpn import RPNCalculator

# Create a calculator instance
calculator = RPNCalculator()

# Calculate an expression
result = calculator.calculate("3 4 +")
print(f"Result: {result['result']}")  # Output: Result: 7

# Access the operations log
for op in result['operations']:
    print(f"{op['operands'][0]} {op['operator']} {op['operands'][1]} = {op['result']}")
```

## Database Usage

```python
from core.db import get_db, User, Calculation

# Using the database
with get_db() as db:
    # Create a user
    user = User(id="user1")
    db.add(user)
    
    # Create a calculation record
    calc = Calculation(
        user_id="user1",
        expression="3 4 +",
        result=7
    )
    db.add(calc)
    db.commit()
```

## Running Tests

```bash
# Run all tests with the comprehensive test runner
python -m tests.run_all_tests

# Run specific tests using pytest
pytest tests/test_rpn.py
pytest tests/test_db.py

# Run individual test scripts directly
python tests/calculator_test.py
python tests/factorial_test.py
```

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

## Docker

To run the Docker container, use the following command:

```bash
docker-compose up
``` 

# Run core tests
cd core
python -m pytest

# Or use the standalone test scripts
python ../test_calculator.py 