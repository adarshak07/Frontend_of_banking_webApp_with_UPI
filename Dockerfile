# ---- Build Stage ----
# Use a Node.js image to build the static files
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Serve Stage ----
# Use an Nginx image to serve the built files
FROM nginx:stable-alpine
# Copy the built files from the 'build' stage
COPY --from=build /app/build /usr/share/nginx/html
# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]