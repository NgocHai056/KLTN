FROM node:18
WORKDIR "/app"
COPY ["src", "src"]
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env .env
RUN npm install --force
RUN npm install dotenv --force
RUN npm run build
CMD ["npm", "run", "start:dev"]