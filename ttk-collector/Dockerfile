FROM node:23.10.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
