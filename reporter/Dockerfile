FROM node:23.10.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 6000

CMD ["node", "dist/main"]
