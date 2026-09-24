# Stage 1: Build React application

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_TMDB_API_KEY

ENV VITE_TMDB_API_KEY=$VITE_TMDB_API_KEY

RUN npm run build


# Stage 2: Run with Nginx

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]