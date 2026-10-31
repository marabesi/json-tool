FROM node:26.12.1
RUN npm install -g pnpm@latest
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY ./ ./
RUN pnpm install
CMD ["pnpm", "run", "start"]
