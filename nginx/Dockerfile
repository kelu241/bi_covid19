# Etapa 1: build com Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY vite.config.js ./
COPY . .
RUN npm install && npm run build

# Etapa 2: servir com Nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 9090
CMD ["nginx", "-g", "daemon off;"]
