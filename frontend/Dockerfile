# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .
ENV NODE_ENV=production

# Build your Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://shortie-api.kutaybekleric.com/
ENV HOSTNAME="0.0.0.0"

# Start the app
CMD ["npm", "start"]