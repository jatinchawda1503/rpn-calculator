FROM python:3.10-slim as base

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy core package first for installation
COPY core/ /app/core/

# Install the core package
RUN cd /app/core && pip install -e .

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend package
COPY backend/ /app/backend/

# Build stage for testing
FROM base as test
RUN pip install pytest fastapi-testclient

# Create a directory for test results if needed
RUN mkdir -p /app/test-results

# Create an entrypoint for running tests
COPY backend/tests/ /app/backend/tests/
# Run tests as the default command for this stage
CMD ["pytest", "-v", "/app/backend/tests"]

# Final production stage
FROM base as production
# Copy the test scripts if any
COPY run_tests.sh /app/

# Command to run on container start
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
