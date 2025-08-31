# Peligent Deployment Guide

This document provides comprehensive instructions for deploying the Peligent application to production.

## Prerequisites

- Node.js 18+ and npm
- Git
- PM2 (for PM2 deployment)
- Docker and Docker Compose (for Docker deployment) - Optional
- Nginx (for reverse proxy and SSL) - Optional
- SSL certificates - Optional

**Note:** This is a frontend-only application. No database, authentication server, or external services are required.

## Environment Variables

Create a `.env` file in the project root with the following variable:

```bash
# API Configuration (Required for frontend)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

**Note:** This is the only environment variable needed. The application will work without it, but API calls may fail if not configured correctly.

## Deployment Options

### Option 1: PM2 Deployment (Recommended)

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Clone the repository:**
   ```bash
   cd /root
   git clone https://github.com/yourusername/peligent.git
   cd peligent
   ```

3. **Create environment file:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/api" > .env
   # Edit .env with your actual API URL
   nano .env
   ```

4. **Install dependencies:**
   ```bash
   npm ci
   ```

5. **Build the application:**
   ```bash
   npm run build
   ```

6. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

7. **Monitor the application:**
   ```bash
   pm2 status
   pm2 logs peligent-app
   ```

### Option 2: Docker Deployment

1. **Build and start containers:**
   ```bash
   docker-compose up -d --build
   ```

2. **Check container status:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

3. **Stop containers:**
   ```bash
   docker-compose down
   ```

## Automated Deployment

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:

1. Builds and tests the application
2. Deploys to production on push to main/master branch
3. Restarts PM2 processes

**Required GitHub Secrets:**
- `SERVER_HOST`: Your server IP address
- `SERVER_USERNAME`: SSH username (usually root)
- `SERVER_SSH_KEY`: Private SSH key for server access
- `SERVER_PORT`: SSH port (usually 22)

**Note:** The workflow now uses `npm ci` instead of `pnpm install --frozen-lockfile` for faster, more reliable installations.

### Manual Deployment Script

Use the provided deployment script for manual deployments:

```bash
# Deploy with PM2 (default)
./scripts/deploy.sh

# Deploy with Docker
./scripts/deploy.sh docker

# Check deployment health
./scripts/deploy.sh health

# Rollback to previous deployment
./scripts/deploy.sh rollback
```

## Nginx Configuration (Optional)

If you want to use Nginx as a reverse proxy:

1. **Copy Nginx configuration:**
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
   ```

2. **Create SSL directory (if using SSL):**
   ```bash
   sudo mkdir -p /etc/nginx/ssl
   ```

3. **Add your SSL certificates (if using SSL):**
   ```bash
   sudo cp your-cert.pem /etc/nginx/ssl/cert.pem
   sudo cp your-key.pem /etc/nginx/ssl/key.pem
   ```

4. **Test and reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

**Note:** You can also run the app directly without Nginx on port 3000. Since this is a frontend-only app, you can access it directly at `http://your-server-ip:3000`.

## Monitoring and Logs

### PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs peligent-app

# Monitor resources
pm2 monit

# View detailed information
pm2 show peligent-app
```

### Docker Monitoring

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs -f app

# Monitor resources
docker stats
```

### Log Files

Logs are stored in `/root/logs/`:
- `peligent-app.log`: Application logs
- `peligent-app-out.log`: Standard output
- `peligent-app-error.log`: Error logs
- `nginx/`: Nginx access and error logs

## Health Checks

The application includes health check endpoints:

- **PM2 Health:** `http://localhost:3000/api/health`
- **Docker Health:** Built-in Docker health checks
- **Nginx Health:** `http://localhost/api/health`

## Backup and Rollback

### Automatic Backups

The deployment script automatically creates backups in `/root/backups/` before each deployment.

### Manual Rollback

```bash
# Rollback to previous deployment
./scripts/deploy.sh rollback

# Or manually restore from backup
cd /root/backups
ls -la  # List available backups
cp -r peligent-backup-YYYYMMDD-HHMMSS /root/peligent
cd /root/peligent
pm2 restart all  # or docker-compose up -d
```

## Security Considerations

1. **Environment Variables:** Never commit `.env` files to version control
2. **SSL Certificates:** Use valid SSL certificates for production (optional)
3. **Firewall:** Configure firewall to only allow necessary ports (3000 for direct access)
4. **Updates:** Regularly update dependencies and system packages
5. **Monitoring:** Set up monitoring and alerting for production issues (optional)

**Note:** Since this is a frontend-only application, security requirements are minimal. The main concern is protecting your server from unauthorized access.

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js and pnpm versions
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`

2. **PM2 Issues:**
   - Check PM2 status: `pm2 status`
   - View logs: `pm2 logs peligent-app`
   - Restart: `pm2 restart all`

3. **Docker Issues:**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f`
   - Rebuild: `docker-compose up -d --build`

4. **Nginx Issues:**
   - Test configuration: `nginx -t`
   - Check error logs: `tail -f /var/log/nginx/error.log`
   - Reload: `systemctl reload nginx`

### Performance Optimization

1. **PM2 Clustering:** Uses all available CPU cores
2. **Nginx Caching:** Static files cached for 1 year (if using Nginx)
3. **Gzip Compression:** Enabled for all text-based content (if using Nginx)
4. **Rate Limiting:** Basic protection (if using Nginx)

**Note:** Performance optimization is mainly handled by Next.js built-in optimizations and PM2 clustering.

## Support

For deployment issues:
1. Check the logs in `/root/logs/`
2. Verify environment variables
3. Check PM2/Docker status
4. Review Nginx configuration
5. Check server resources (CPU, memory, disk)
