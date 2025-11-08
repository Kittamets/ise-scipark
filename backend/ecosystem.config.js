module.exports = {
  apps: [
    {
      name: 'scipark-api',
      script: './index.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Cluster mode for load balancing
      watch: false, // Disable watch in production
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000, // 4 seconds delay between restarts
      
      // Advanced options
      exp_backoff_restart_delay: 100,
      listen_timeout: 3000,
      kill_timeout: 5000,
      
      // Graceful shutdown
      wait_ready: true,
      shutdown_with_message: true,
      
      // Process monitoring
      instance_var: 'INSTANCE_ID',
      
      // Resource limits
      cron_restart: '0 0 * * *', // Restart daily at midnight
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/scipark.git',
      path: '/var/www/scipark',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
