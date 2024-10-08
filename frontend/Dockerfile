# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Ensure Bun is in the PATH
ENV BUN_INSTALL=/root/.bun
ENV PATH=$BUN_INSTALL/bin:$PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of your app's source code
COPY . .

# Set the environment to production
ENV NODE_ENV=production

# Build your Next.js app
RUN bun run build

# Expose the port Next.js runs on
EXPOSE 3000

# Environment variables
ENV NEXT_PUBLIC_API_URL=http://backend:8080
ENV HOSTNAME="0.0.0.0"

# Start the app using Bun
CMD ["bun", "start"]
