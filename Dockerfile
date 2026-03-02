FROM node:25.7.0
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i 
CMD ["npm", "run", "start"]
