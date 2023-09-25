# generate node_modules + source code + dev packages
FROM "public.ecr.aws/docker/library/node:18-alpine" AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# RUN npm test
# dist directory is generated

FROM public.ecr.aws/docker/library/node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000

# this will be replaced for worker or web server
ENTRYPOINT ["node", "server.js"]
