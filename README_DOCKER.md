# 🐳 Docker Setup for EchoPub Frontend

## 📋 Overview

This document explains how to containerize and deploy the EchoPub frontend application using Docker. The setup includes a multi-stage build process that builds the Vue.js application and serves it with Nginx.

## 🚀 Quick Start

### **1. Build the Docker Image**

```bash
# Build the production image
docker build -t echopub-frontend .

# Build with a specific tag
docker build -t echopub-frontend:v1.0.0 .
```

### **2. Run with Docker Compose**

```bash
# Start the frontend service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### **3. Run Individual Container**

```bash
# Start Frontend
docker run -d \
  --name echopub-frontend \
  -p 80:80 \
  echopub-frontend
```

## 🔧 Dockerfile Features

### **Multi-Stage Build**
- **Stage 1**: Node.js build environment with all dependencies
- **Stage 2**: Nginx production server with built application

### **Build Process**
- Installs all dependencies (including devDependencies for build tools)
- Builds Vue.js application using `vue-cli-service build`
- Copies built files to Nginx server

### **Production Server**
- Lightweight Nginx Alpine image
- Non-root user for security
- Optimized Nginx configuration
- Health checks built-in

## 📁 File Structure

```
frontend-echopub/
├── Dockerfile              # Main Docker configuration
├── .dockerignore          # Files to exclude from build
├── docker-compose.yml     # Production orchestration
├── nginx.conf             # Nginx configuration
├── packages/              # Application packages
│   └── vue-admin/        # Main Vue.js application
└── package.json           # Root dependencies
```

## 🌍 Environment Variables

### **Build Time Variables**
```bash
NODE_ENV=production
```

### **Runtime Variables**
The frontend application can be configured through environment variables during build time or through the Nginx configuration.

## 🐳 Docker Commands

### **Build Commands**
```bash
# Build image
docker build -t echopub-frontend .

# Build with no cache
docker build --no-cache -t echopub-frontend .

# Build for specific platform
docker build --platform linux/amd64 -t echopub-frontend .
```

### **Run Commands**
```bash
# Run container
docker run -d -p 80:80 --name echopub-frontend echopub-frontend

# Run with custom nginx config
docker run -d \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  --name echopub-frontend \
  echopub-frontend
```

### **Management Commands**
```bash
# View running containers
docker ps

# View logs
docker logs echopub-frontend

# Execute commands in container
docker exec -it echopub-frontend sh

# Stop container
docker stop echopub-frontend

# Remove container
docker rm echopub-frontend

# Remove image
docker rmi echopub-frontend
```

## 🔍 Health Checks

The Dockerfile includes a health check that:
- Runs every 30 seconds
- Checks the `/health` endpoint
- Times out after 3 seconds
- Retries 3 times before marking unhealthy

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' echopub-frontend
```

## 📊 Monitoring

### **Container Stats**
```bash
# Real-time stats
docker stats echopub-frontend

# Resource usage
docker stats --no-stream echopub-frontend
```

### **Logs**
```bash
# Follow logs
docker logs -f echopub-frontend

# Last 100 lines
docker logs --tail 100 echopub-frontend

# Since specific time
docker logs --since "2024-01-01T00:00:00" echopub-frontend
```

## 🚀 Production Deployment

### **1. Build Production Image**
```bash
docker build -t echopub-frontend:latest .
```

### **2. Tag for Registry**
```bash
docker tag echopub-frontend:latest your-registry/echopub-frontend:latest
```

### **3. Push to Registry**
```bash
docker push your-registry/echopub-frontend:latest
```

### **4. Deploy**
```bash
docker pull your-registry/echopub-frontend:latest
docker run -d \
  --name echopub-frontend-prod \
  -p 80:80 \
  --restart unless-stopped \
  your-registry/echopub-frontend:latest
```

## 🔧 Nginx Configuration

### **Features**
- **Client-side routing**: Handles Vue Router routes
- **Static asset caching**: Optimized caching for JS/CSS/images
- **Gzip compression**: Reduces file sizes
- **Security headers**: XSS protection, content type sniffing
- **API proxy**: Routes `/api/*` to backend service
- **Health check endpoint**: `/health` for monitoring

### **Customization**
```bash
# Mount custom nginx config
docker run -d \
  -p 80:80 \
  -v $(pwd)/custom-nginx.conf:/etc/nginx/nginx.conf:ro \
  echopub-frontend
```

## 🔧 Development Setup

### **1. Development Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY packages/vue-admin/package*.json ./packages/vue-admin/
RUN npm install

COPY . .
WORKDIR /app/packages/vue-admin
EXPOSE 8080

CMD ["npm", "run", "serve"]
```

### **2. Development Compose**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - ./packages/vue-admin/src:/app/packages/vue-admin/src
    environment:
      - NODE_ENV=development
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Build Fails - vue-cli-service not found**
   ```bash
   # Ensure all dependencies are installed
   npm install
   # Check if vue-cli-service is in devDependencies
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 80
   sudo lsof -i :80
   
   # Kill process
   sudo kill -9 <PID>
   ```

3. **Permission Denied**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod -R 755 .
   ```

4. **Container Won't Start**
   ```bash
   # Check container logs
   docker logs echopub-frontend
   
   # Check container status
   docker inspect echopub-frontend
   ```

### **Debug Commands**
```bash
# Interactive shell
docker run -it --rm echopub-frontend sh

# Check nginx configuration
docker exec echopub-frontend nginx -t

# Check file permissions
docker exec echopub-frontend ls -la /usr/share/nginx/html
```

## 📚 Best Practices

### **Security**
- Use non-root user
- Scan images for vulnerabilities
- Keep base images updated
- Use specific image tags

### **Performance**
- Multi-stage builds
- Optimize layer caching
- Use .dockerignore
- Minimize image size

### **Monitoring**
- Implement health checks
- Use proper logging
- Monitor resource usage
- Set up alerts

## 🔮 Future Enhancements

- [ ] **Multi-architecture builds** (ARM64, AMD64)
- [ ] **Automated security scanning**
- [ ] **CI/CD pipeline integration**
- [ ] **Kubernetes deployment**
- [ ] **Load balancing setup**
- [ ] **SSL/TLS configuration**
- [ ] **CDN integration**

## 📖 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Vue.js Docker Guide](https://vuejs.org/guide/deployment.html)
- [Nginx Docker Guide](https://hub.docker.com/_/nginx)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Vue CLI Build](https://cli.vuejs.org/guide/build-targets.html)
