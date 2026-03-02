# Use official Nginx image
FROM nginx:alpine

# Set maintainer label
LABEL maintainer="Ham Matage <kiplangathamman@gmail.com>"
LABEL description="Portfolio website for Ham Matage - DevOps Engineer"

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy static files to nginx's web directory
COPY php.html /usr/share/nginx/html/index.html
COPY PHP.css /usr/share/nginx/html/
COPY php.js /usr/share/nginx/html/
COPY Images/ /usr/share/nginx/html/Images/
COPY pdf/ /usr/share/nginx/html/pdf/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]