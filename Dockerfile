# ==== Build Phase ====
FROM node:18-alpine AS build

# ==== PREP ======
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .

# ==== BUILD =====
RUN npx vite build

# ==== Publish Phase ====
FROM nginx AS publish
RUN sed -i 's/index  index\.html index\.htm;/try_files $uri \/index.html;/' /etc/nginx/conf.d/default.conf

# ==== DOCKER ====
RUN apt-get update && apt-get install -y curl
HEALTHCHECK CMD curl --fail http://localhost:80 || exit 1

# ==== RUN =======
COPY --from=build /app/dist/ /usr/share/nginx/html/
