FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./

# Use clean install for production builds
RUN npm ci

# Copy the rest of the application
COPY frontend/ ./

# Build the application for production
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
