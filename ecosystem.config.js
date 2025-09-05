module.exports = {
  apps: [
    {
      name: 'agent-ui',
      script: 'npm',
      args: 'start',
      cwd: '/home/dev/app/ui',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: '/home/dev/logs/agent-ui.log',
      out_file: '/home/dev/logs/agent-ui-out.log',
      error_file: '/home/dev/logs/agent-ui-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Performance
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Process management
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Metrics
      pmx: true,
      
      // Merge logs
      merge_logs: true
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'dev',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/Pariant/agent-ui.git',
      path: '/home/dev/app/ui',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
