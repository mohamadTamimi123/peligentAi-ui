#!/bin/bash

# Deployment script for Peligent
# Usage: ./scripts/deploy.sh [docker|pm2]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/peligent"
BACKUP_DIR="/root/backups"
LOG_DIR="/root/logs"
DEPLOYMENT_TYPE=${1:-pm2}

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
fi

# Create necessary directories
log "Creating necessary directories..."
mkdir -p $BACKUP_DIR
mkdir -p $LOG_DIR

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    if [ -d "$PROJECT_DIR" ]; then
        BACKUP_NAME="peligent-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r $PROJECT_DIR $BACKUP_DIR/$BACKUP_NAME
        success "Backup created: $BACKUP_NAME"
    fi
}

# Deploy with PM2
deploy_pm2() {
    log "Deploying with PM2..."
    
    cd $PROJECT_DIR
    
    # Pull latest changes
    log "Pulling latest changes from git..."
    git pull origin main || error "Failed to pull from git"
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci || error "Failed to install dependencies"
    
    # Build application
    log "Building application..."
    npm run build || error "Build failed"
    
    # Restart PM2 processes
    log "Restarting PM2 processes..."
    pm2 restart all || pm2 start ecosystem.config.js || error "Failed to restart PM2"
    
    # Save PM2 configuration
    pm2 save
    
    success "PM2 deployment completed successfully"
}

# Deploy with Docker
deploy_docker() {
    log "Deploying with Docker..."
    
    cd $PROJECT_DIR
    
    # Pull latest changes
    log "Pulling latest changes from git..."
    git pull origin main || error "Failed to pull from git"
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down || warning "No existing containers to stop"
    
    # Build and start new containers
    log "Building and starting containers..."
    docker-compose up -d --build || error "Docker deployment failed"
    
    # Wait for health check
    log "Waiting for health check..."
    sleep 30
    
    # Check container status
    if docker-compose ps | grep -q "Up"; then
        success "Docker deployment completed successfully"
    else
        error "Docker deployment failed - containers not running"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        # Docker health check
        if docker-compose ps | grep -q "Up"; then
            success "Docker containers are healthy"
        else
            error "Docker containers are not healthy"
        fi
    else
        # PM2 health check
        if pm2 status | grep -q "online"; then
            success "PM2 processes are healthy"
        else
            error "PM2 processes are not healthy"
        fi
    fi
}

# Rollback function
rollback() {
    log "Rolling back to previous deployment..."
    
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR)" ]; then
        LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -1)
        log "Rolling back to: $LATEST_BACKUP"
        
        # Stop current deployment
        if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
            docker-compose down
        else
            pm2 stop all
        fi
        
        # Restore backup
        rm -rf $PROJECT_DIR
        cp -r $BACKUP_DIR/$LATEST_BACKUP $PROJECT_DIR
        
        # Restart deployment
        if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
            docker-compose up -d
        else
            pm2 start all
        fi
        
        success "Rollback completed successfully"
    else
        error "No backup available for rollback"
    fi
}

# Main deployment logic
main() {
    log "Starting deployment process..."
    log "Deployment type: $DEPLOYMENT_TYPE"
    
    # Check if project directory exists
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Project directory $PROJECT_DIR does not exist"
    fi
    
    # Create backup
    backup_current
    
    # Deploy based on type
    case $DEPLOYMENT_TYPE in
        "docker")
            deploy_docker
            ;;
        "pm2")
            deploy_pm2
            ;;
        *)
            error "Invalid deployment type. Use 'docker' or 'pm2'"
            ;;
    esac
    
    # Health check
    health_check
    
    # Cleanup old backups (keep last 5)
    log "Cleaning up old backups..."
    cd $BACKUP_DIR
    ls -t | tail -n +6 | xargs -r rm -rf
    
    success "Deployment process completed successfully!"
}

# Handle command line arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "docker"|"pm2"|"")
        main
        ;;
    *)
        echo "Usage: $0 [docker|pm2|rollback|health]"
        echo "  docker   - Deploy using Docker Compose"
        echo "  pm2      - Deploy using PM2 (default)"
        echo "  rollback - Rollback to previous deployment"
        echo "  health   - Check deployment health"
        exit 1
        ;;
esac
