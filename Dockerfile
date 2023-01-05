FROM node:18
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i --legacy-peer-deps
CMD ["npm", "run", "start"]
