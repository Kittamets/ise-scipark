# PM2 Deployment Guide - SciPark API

## 📦 Installation

### Install PM2 globally:
```bash
npm install -g pm2
```

### Verify installation:
```bash
pm2 --version
```

---

## 🚀 Quick Start

### 1. Start the application (Development):
```bash
cd backend
npm run pm2:start
```

### 2. Start the application (Production):
```bash
npm run pm2:start:prod
```

### 3. Check status:
```bash
npm run pm2:status
# or
pm2 status
```

---

## 📊 Monitoring

### Real-time monitoring:
```bash
npm run pm2:monit
# or
pm2 monit
```

### View logs:
```bash
npm run pm2:logs
# or
pm2 logs scipark-api

# View error logs only
pm2 logs scipark-api --err

# View specific number of lines
pm2 logs scipark-api --lines 100
```

### Flush logs:
```bash
pm2 flush
```

---

## 🔄 Management Commands

### Stop the application:
```bash
npm run pm2:stop
# or
pm2 stop scipark-api
```

### Restart the application:
```bash
npm run pm2:restart
# or
pm2 restart scipark-api
```

### Reload (zero-downtime restart):
```bash
npm run pm2:reload
# or
pm2 reload scipark-api
```

### Delete from PM2:
```bash
npm run pm2:delete
# or
pm2 delete scipark-api
```

### Restart all applications:
```bash
pm2 restart all
```

### Stop all applications:
```bash
pm2 stop all
```

---

## 📈 Performance & Metrics

### Show detailed metrics:
```bash
pm2 show scipark-api
```

### Get process list with details:
```bash
pm2 list
```

### Display dashboard:
```bash
pm2 plus
```

---

## 🔧 Configuration

### Current configuration (ecosystem.config.js):

- **Instances**: `max` (uses all CPU cores)
- **Exec Mode**: `cluster` (load balancing)
- **Memory Restart**: `1GB` (restart if memory exceeds)
- **Auto Restart**: `true`
- **Watch**: `false` (disabled in production)
- **Logs**: `./logs/out.log` and `./logs/err.log`
- **Cron Restart**: `0 0 * * *` (daily at midnight)

### Modify configuration:
Edit `ecosystem.config.js` and reload:
```bash
pm2 reload ecosystem.config.js
```

---

## 🌐 Startup Script (Auto-start on boot)

### Generate startup script:
```bash
pm2 startup
```

Follow the instructions provided by PM2.

### Save current process list:
```bash
pm2 save
```

### Remove startup script:
```bash
pm2 unstartup
```

---

## 🔍 Debugging

### Show environment variables:
```bash
pm2 env 0
```

### Describe process:
```bash
pm2 describe scipark-api
```

### Show process metadata:
```bash
pm2 prettylist
```

---

## 🧹 Cleanup

### Clear all logs:
```bash
pm2 flush
```

### Kill PM2 daemon:
```bash
pm2 kill
```

### Resurrect saved processes:
```bash
pm2 resurrect
```

---

## 📊 Cluster Mode Benefits

### Load Balancing:
- Distributes incoming connections across all CPU cores
- Increases application throughput
- Better resource utilization

### Zero-Downtime Reload:
```bash
pm2 reload scipark-api
```
Reloads application without downtime by restarting instances one by one.

### Health Checks:
PM2 automatically restarts crashed processes.

---

## 🎯 Production Checklist

### Before deployment:

- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure proper MongoDB connection string
- [ ] Set secure JWT secret
- [ ] Configure CORS for production domain
- [ ] Set Redis URL if using caching
- [ ] Review memory limits
- [ ] Enable log rotation
- [ ] Set up monitoring alerts
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting

### Start production:
```bash
npm run pm2:start:prod
pm2 save
```

---

## 🚨 Common Issues

### Issue: Port already in use
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: PM2 not starting
```bash
# Check PM2 logs
pm2 logs

# Reset PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Issue: High memory usage
```bash
# Check memory
pm2 monit

# Adjust max_memory_restart in ecosystem.config.js
# Restart
pm2 reload ecosystem.config.js
```

---

## 📞 Support

### PM2 Documentation:
https://pm2.keymetrics.io/docs/usage/quick-start/

### PM2 GitHub:
https://github.com/Unitech/pm2

---

## 🎉 Quick Reference

```bash
# Essential commands
pm2 start ecosystem.config.js    # Start app
pm2 stop scipark-api             # Stop app
pm2 restart scipark-api          # Restart app
pm2 reload scipark-api           # Zero-downtime restart
pm2 delete scipark-api           # Remove from PM2
pm2 logs scipark-api             # View logs
pm2 monit                        # Monitor resources
pm2 status                       # Check status
pm2 save                         # Save process list
pm2 startup                      # Auto-start on boot
```

---

**SciPark API - Production Ready with PM2** 🚀
