FROM python:3.10-slim AS base

WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy Python and Node.js dependencies files
COPY requirements.txt ./
COPY package.json package-lock.json* ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN npm ci

# Copy the rest of the application
COPY . .

# Build frontend assets if needed
RUN npm run build

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"] 