
FROM public.ecr.aws/docker/library/node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY . .

# RUN npm test

EXPOSE 3000

ENTRYPOINT ["node", "app.js"]
