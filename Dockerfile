# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Set the working directory to the build folder
WORKDIR /app/build

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the application
CMD ["npm run start"]
