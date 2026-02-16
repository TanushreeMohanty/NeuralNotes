# Change from 18 to 20
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 5173

# Start Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]