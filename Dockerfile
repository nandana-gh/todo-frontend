# Stage 1: Build the Angular application
FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install
COPY . .
RUN npx ng build --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/todo-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
