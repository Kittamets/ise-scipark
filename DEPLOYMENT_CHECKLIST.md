# 📋 SciPark Deployment Checklist

## ✅ Pre-Deployment Checklist

### 🗄️ Database Preparation
- [ ] MongoDB Atlas account created
- [ ] Production cluster created (M0 Free tier or higher)
- [ ] Database user with strong password created
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string obtained
- [ ] Test connection successful

### 🔐 Security Configuration
- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Update all environment variables with production values
- [ ] Verify .env files are in .gitignore
- [ ] Remove any hardcoded credentials from code
- [ ] Configure CORS with production frontend URL
- [ ] Enable Helmet security headers (already configured)
- [ ] Configure rate limiting (already configured)

### 📧 Email Configuration
- [ ] Brevo account created (or other SMTP provider)
- [ ] SMTP credentials obtained
- [ ] Test email sending functionality
- [ ] Update EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

### 🎯 Backend Preparation
- [ ] Review and update backend/.env with production values
- [ ] Test all API endpoints locally
- [ ] Run database seed script if needed: `node scripts/seed.js`
- [ ] Verify PM2 ecosystem.config.js configuration
- [ ] Test health check endpoint: GET /health
- [ ] Review CORS settings in index.js

### 🎨 Frontend Preparation
- [ ] Create frontend/.env with VITE_API_URL
- [ ] Update API URL to production backend
- [ ] Test build locally: `npm run build`
- [ ] Verify build output in dist/ folder
- [ ] Test production build: `npm run preview`
- [ ] Check for console errors in browser

### 🔧 Code Quality
- [ ] All lint errors fixed
- [ ] Remove console.log statements (or use proper logging)
- [ ] Remove commented code
- [ ] Update README.md with deployment instructions
- [ ] Verify all dependencies are in package.json

---

## 🚀 Deployment Steps

### Option 1: Vercel (Frontend) + Railway (Backend) - ⭐ RECOMMENDED

#### 🎨 Frontend Deployment (Vercel)
1. [ ] Push code to GitHub repository
2. [ ] Sign up for Vercel account
3. [ ] Import GitHub repository
4. [ ] Configure project:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. [ ] Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
6. [ ] Deploy project
7. [ ] Verify deployment successful
8. [ ] Test all pages and functionality
9. [ ] Copy production URL (e.g., scipark-app.vercel.app)

#### 🔧 Backend Deployment (Railway)
1. [ ] Sign up for Railway account
2. [ ] Create New Project → Deploy from GitHub
3. [ ] Select repository and backend folder
4. [ ] Configure deployment:
   - Root Directory: **backend**
   - Start Command: `npm start`
5. [ ] Add Environment Variables (all from .env.example):
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_production_secret
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your_user
   EMAIL_PASS=your_pass
   EMAIL_FROM=noreply@scipark.com
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=https://scipark-app.vercel.app
   ```
6. [ ] Deploy project
7. [ ] Wait for deployment to complete
8. [ ] Copy production URL (e.g., scipark-backend.railway.app)
9. [ ] Test health endpoint: `curl https://your-backend.railway.app/health`

#### 🔄 Connect Frontend to Backend
1. [ ] Go back to Vercel project settings
2. [ ] Update VITE_API_URL to Railway backend URL
3. [ ] Redeploy frontend
4. [ ] Test complete application flow

---

### Option 2: Render (Full Stack)

#### 🔧 Backend Deployment (Render)
1. [ ] Sign up for Render account
2. [ ] New → Web Service
3. [ ] Connect GitHub repository
4. [ ] Configure:
   - Name: scipark-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
5. [ ] Add Environment Variables (same as Railway)
6. [ ] Create Web Service
7. [ ] Wait for deployment
8. [ ] Test health endpoint

#### 🎨 Frontend Deployment (Render)
1. [ ] New → Static Site
2. [ ] Connect same GitHub repository
3. [ ] Configure:
   - Name: scipark-frontend
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Publish Directory: dist
4. [ ] Add Environment Variable:
   ```
   VITE_API_URL=https://scipark-backend.onrender.com/api
   ```
5. [ ] Create Static Site
6. [ ] Test application

---

## 🧪 Post-Deployment Testing

### API Testing
- [ ] Test authentication endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/user (with auth)
  - POST /api/auth/logout
- [ ] Test parking endpoints:
  - GET /api/parking/zones
  - GET /api/parking/zones/:id
  - GET /api/parking/spots
- [ ] Test booking endpoints:
  - POST /api/booking/create
  - GET /api/booking/active
  - PATCH /api/booking/:id/finish
- [ ] Test vehicle endpoints:
  - POST /api/vehicle
  - GET /api/vehicle
  - DELETE /api/vehicle/:id

### Frontend Testing
- [ ] Test user registration flow
- [ ] Test user login/logout
- [ ] Test parking zone viewing
- [ ] Test spot booking
- [ ] Test active booking display
- [ ] Test finish parking & payment
- [ ] Test booking history
- [ ] Test vehicle management
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test QR code generation and display

### Performance Testing
- [ ] Check API response times (should be < 500ms)
- [ ] Check frontend load time (should be < 3s)
- [ ] Test with multiple concurrent users
- [ ] Monitor memory usage
- [ ] Check database query performance

---

## 🛠️ Database Seeding (Production)

After backend is deployed, seed the production database:

1. [ ] SSH into backend server or use Railway CLI
2. [ ] Run seed script:
   ```bash
   node scripts/seed.js
   ```
3. [ ] Verify data in MongoDB Atlas:
   - 5 parking zones created
   - 140 parking spots created
   - 5 promo codes created
   - 3 test users created (optional)

---

## 📊 Monitoring Setup

### Backend Monitoring
- [ ] Set up Railway/Render monitoring dashboard
- [ ] Configure alerts for:
  - High CPU usage (> 80%)
  - High memory usage (> 80%)
  - API errors (5xx responses)
  - Database connection failures
- [ ] Test health check endpoint: `/health`
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

### Database Monitoring
- [ ] Enable MongoDB Atlas monitoring
- [ ] Set up alerts for:
  - High connection count
  - Slow queries (> 100ms)
  - High storage usage (> 80%)
- [ ] Review performance metrics weekly

### Frontend Monitoring
- [ ] Set up Vercel Analytics (optional)
- [ ] Monitor build times
- [ ] Check for build errors
- [ ] Review deployment logs

---

## 🔒 Security Checklist

- [ ] All environment variables secured
- [ ] No sensitive data in Git history
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)
- [ ] CORS configured with specific origins (not *)
- [ ] Rate limiting enabled
- [ ] JWT tokens use httpOnly cookies
- [ ] Helmet security headers enabled
- [ ] MongoDB sanitization enabled
- [ ] XSS protection enabled
- [ ] Input validation on all endpoints

---

## 📝 Documentation

- [ ] Update README.md with:
  - Production URLs
  - API documentation
  - Environment variables guide
  - Deployment instructions
- [ ] Create API documentation (Postman/Swagger)
- [ ] Document troubleshooting steps
- [ ] Create runbook for common issues

---

## 🚨 Rollback Plan

In case of deployment issues:

### Frontend Rollback
1. [ ] Go to Vercel deployments
2. [ ] Find last working deployment
3. [ ] Click "Promote to Production"

### Backend Rollback
1. [ ] Go to Railway/Render deployments
2. [ ] Redeploy previous working version
3. [ ] Or push previous commit to GitHub

### Database Rollback
1. [ ] Restore from MongoDB Atlas backup
2. [ ] Or re-run seed script with correct data

---

## ✅ Final Verification

Before going live:
- [ ] All checklist items completed
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Rollback plan tested
- [ ] Team trained on monitoring

---

## 📞 Support Information

### Platform Support
- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/support

### Useful Commands

```bash
# Backend (Railway CLI)
railway logs
railway restart
railway run node scripts/seed.js

# Frontend (Vercel CLI)
vercel logs
vercel redeploy
vercel env ls

# Database (MongoDB)
mongosh "mongodb+srv://cluster.mongodb.net/database" --username admin
```

---

## 📈 Post-Launch Tasks

Week 1:
- [ ] Monitor error rates daily
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Fix critical bugs immediately

Week 2-4:
- [ ] Analyze usage patterns
- [ ] Optimize slow queries
- [ ] Add missing features (if any)
- [ ] Plan next sprint

---

**Status**: 🟢 Ready for Deployment  
**Last Updated**: November 8, 2025  
**Version**: 1.0.0
