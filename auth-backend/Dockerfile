# auth-backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000
CMD ["node", "index.js"]