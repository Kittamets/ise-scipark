# 🚀 SciPark Production Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Generate Production Secrets](#generate-production-secrets)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [DNS & Domain Setup](#dns--domain-setup)
7. [Testing Production](#testing-production)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Accounts
- [ ] GitHub account (for repository)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] Railway account (free trial, then $5-10/month)
- [ ] Brevo account (for email, free tier available)

### Required Software
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Text editor (VS Code recommended)
- [ ] Browser (Chrome/Firefox)

---

## 🔐 Generate Production Secrets

### 1. Generate Strong JWT Secret

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option B: Using PowerShell**
```powershell
# ใช้คำสั่งนี้
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

**Option C: Using OpenSSL** (if installed)
```bash
openssl rand -hex 64
```

**Save this secret!** You'll need it for backend deployment.

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### 2. Prepare Environment Variables

Create a file `PRODUCTION_ENV.txt` (DON'T commit this):

```env
# Backend Environment Variables
MONGO_URI=mongodb+srv://admin:NEW_SECURE_PASSWORD@production.qxi98tc.mongodb.net/scipark_production?retryWrites=true&w=majority
JWT_SECRET=<YOUR_GENERATED_SECRET_FROM_STEP_1>
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=<YOUR_BREVO_USER>
EMAIL_PASS=<YOUR_BREVO_API_KEY>
EMAIL_FROM=noreply@scipark.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.vercel.app

# Frontend Environment Variables
VITE_API_URL=https://scipark-backend.railway.app/api
```

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Production Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **M0 FREE** tier
5. Select **Singapore** region (closest to users)
6. Cluster Name: `scipark-production`
7. Click **"Create Cluster"**

### Step 2: Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
   - Username: `scipark_admin`
   - Password: Generate strong password (click AutoGenerate)
   - Save password securely!
4. Database User Privileges: **Atlas Admin**
5. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for cloud deployment)
   - IP: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy connection string:
   ```
   mongodb+srv://scipark_admin:<password>@scipark-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `/scipark_production`

Final connection string:
```
mongodb+srv://scipark_admin:YOUR_PASSWORD@scipark-production.xxxxx.mongodb.net/scipark_production?retryWrites=true&w=majority
```

### Step 5: Test Connection

```bash
# In your backend folder
cd backend

# Create temporary .env.production file
echo "MONGO_URI=<YOUR_CONNECTION_STRING>" > .env.production

# Test connection with seed script
node scripts/seed.js
```

If successful, you'll see:
```
✅ Connected to MongoDB: scipark-production.xxxxx.mongodb.net
✅ Database cleared
✅ 5 parking zones created
✅ 140 parking spots created
✅ Seed completed successfully!
```

---

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Repository

1. Make sure all code is committed:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. Verify backend/package.json has correct start script:
   ```json
   "scripts": {
     "start": "node index.js"
   }
   ```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Select your `ise-scipark` repository
6. Click **"Deploy Now"**

### Step 3: Configure Railway Settings

1. **Settings** tab:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: `npm install`

2. **Variables** tab - Add all environment variables:
   ```
   MONGO_URI=mongodb+srv://scipark_admin:PASSWORD@scipark-production.xxxxx.mongodb.net/scipark_production?retryWrites=true&w=majority
   JWT_SECRET=<YOUR_64_CHAR_SECRET>
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=<YOUR_BREVO_USER>
   EMAIL_PASS=<YOUR_BREVO_KEY>
   EMAIL_FROM=noreply@scipark.com
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=https://scipark-app.vercel.app
   ```

3. Click **"Deploy"**

### Step 4: Get Backend URL

1. Wait for deployment to complete (2-3 minutes)
2. Go to **Settings** tab
3. Find **"Domains"** section
4. Copy the generated URL: `https://scipark-backend-production.up.railway.app`
5. Save this URL!

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://YOUR_RAILWAY_URL/health

# Should return:
{
  "status": "ok",
  "timestamp": "2025-11-08T...",
  "uptime": 123.45,
  "database": "connected",
  "memory": { ... }
}
```

### Step 6: Seed Production Database

1. In Railway dashboard, go to your service
2. Click **"..."** menu → **"Run a Command"**
3. Enter: `node scripts/seed.js`
4. Click **"Run"**
5. Check logs to verify success

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create Frontend Environment File

Create `frontend/.env.production`:
```env
VITE_API_URL=https://YOUR_RAILWAY_URL/api
```

**Replace `YOUR_RAILWAY_URL` with your actual Railway backend URL!**

### Step 2: Test Production Build Locally

```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview
```

Open browser to `http://localhost:4173` and test:
- [ ] All pages load
- [ ] API calls work (use DevTools Network tab)
- [ ] No console errors
- [ ] Responsive design works

### Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `ise-scipark` repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR_RAILWAY_URL/api`

7. Click **"Deploy"**

### Step 4: Get Frontend URL

1. Wait for deployment (1-2 minutes)
2. Vercel will show your live URL: `https://scipark-app.vercel.app`
3. Click to open and test

### Step 5: Update Backend CORS

1. Go back to Railway dashboard
2. Update `CLIENT_URL` variable:
   ```
   CLIENT_URL=https://scipark-app.vercel.app
   ```
3. Railway will auto-restart backend

---

## 🌐 DNS & Domain Setup (Optional)

### Using Custom Domain with Vercel

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel project settings → **Domains**
3. Add your domain: `scipark.com`
4. Add DNS records at your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (5-30 minutes)

### Using Custom Domain with Railway

1. In Railway project → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter: `api.scipark.com`
4. Add CNAME record at your registrar:
   ```
   Type: CNAME
   Name: api
   Value: YOUR-PROJECT.up.railway.app
   ```

---

## 🧪 Testing Production

### API Testing Checklist

```bash
# Set your backend URL
$API_URL = "https://YOUR_RAILWAY_URL"

# 1. Test health check
Invoke-RestMethod -Uri "$API_URL/health"

# 2. Test parking zones
Invoke-RestMethod -Uri "$API_URL/api/parking/zones"

# 3. Test register
$registerBody = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    password = "Test1234"
    studentId = "650000000"
    phoneNumber = "0812345678"
    licensePlate = "ABC1234"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"

# 4. Test login
$loginBody = @{
    email = "test@example.com"
    password = "Test1234"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -SessionVariable session

# 5. Test authenticated endpoint
Invoke-RestMethod -Uri "$API_URL/api/auth/user" -WebSession $session
```

### Frontend Testing Checklist

Visit your Vercel URL and test:

- [ ] **Homepage**
  - [ ] All parking zones display
  - [ ] Availability numbers correct
  - [ ] Auto-refresh works (wait 30 seconds)
  - [ ] Click zone opens detail page

- [ ] **Authentication**
  - [ ] Register new account
  - [ ] Receive OTP email
  - [ ] Login successful
  - [ ] Logout works

- [ ] **Booking Flow**
  - [ ] View parking spots
  - [ ] Select available spot
  - [ ] Create booking
  - [ ] View active booking
  - [ ] Finish parking
  - [ ] Make payment

- [ ] **Vehicle Management**
  - [ ] Add vehicle
  - [ ] View vehicles
  - [ ] Delete vehicle

- [ ] **Responsive Design**
  - [ ] Test on mobile (DevTools)
  - [ ] Test on tablet
  - [ ] Test on desktop

---

## 🔍 Monitoring & Maintenance

### Railway Monitoring

1. **Metrics** tab shows:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

2. **Logs** tab shows:
   - Application logs
   - Error messages
   - API requests

3. Set up alerts:
   - Go to **Settings** → **Notifications**
   - Enable email notifications for errors

### Vercel Monitoring

1. **Analytics** (optional paid feature):
   - Page views
   - Load times
   - Error rates

2. **Deployments** tab:
   - Build logs
   - Deploy history
   - Rollback options

### MongoDB Monitoring

1. Go to MongoDB Atlas dashboard
2. **Metrics** tab shows:
   - Operations per second
   - Connection count
   - Network traffic
   - Storage usage

3. Set up alerts:
   - **Alerts** → **Add Alert**
   - Alert on high connections (> 100)
   - Alert on slow queries (> 100ms)

---

## 🚨 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Check Railway logs
# Look for errors like:
- "Error connecting to MongoDB" → Check MONGO_URI
- "Port 3000 already in use" → Railway handles this automatically
- "JWT_SECRET is required" → Check environment variables
```

**Problem**: Database connection failed
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify database user credentials

**Problem**: CORS errors
- Verify CLIENT_URL matches your Vercel URL exactly
- Check if Railway backend is running
- Look for mixed content (http vs https)

### Frontend Issues

**Problem**: API calls failing
- Check VITE_API_URL is correct Railway URL
- Verify Railway backend is running
- Check browser console for CORS errors
- Test API directly with curl/Postman

**Problem**: Build fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check for syntax errors in code
- Review Vercel build logs

**Problem**: Pages show 404
- Verify vercel.json has rewrite rules
- Check Vercel configuration for SPA support

### Common Errors

**401 Unauthorized**
- JWT token expired or invalid
- Login again to get fresh token
- Check JWT_SECRET is same on backend

**500 Internal Server Error**
- Check Railway backend logs
- Verify database is connected
- Look for unhandled promise rejections

**502 Bad Gateway**
- Railway service is down or restarting
- Wait 1-2 minutes for auto-recovery
- Check Railway status page

---

## 📊 Performance Optimization

### Backend Optimization

1. Enable Redis caching (optional):
   ```bash
   # In Railway, add:
   REDIS_URL=redis://your-redis-url
   REDIS_ENABLED=true
   ```

2. Add database indexes:
   ```javascript
   // In models
   schema.index({ field: 1 })
   ```

3. Enable compression:
   ```javascript
   // Already configured in backend/index.js
   app.use(compression())
   ```

### Frontend Optimization

1. Code splitting (already configured with React.lazy)
2. Image optimization (use WebP format)
3. Enable Vercel Analytics for insights

---

## ✅ Deployment Complete!

Congratulations! Your SciPark application is now live! 🎉

### Final URLs
- **Frontend**: https://scipark-app.vercel.app
- **Backend**: https://scipark-backend.railway.app
- **Health Check**: https://scipark-backend.railway.app/health

### Next Steps
1. Share URLs with users
2. Monitor logs for first 24 hours
3. Fix any issues that arise
4. Plan for feature updates

### Support
- Railway Support: https://railway.app/help
- Vercel Support: https://vercel.com/support
- MongoDB Support: https://www.mongodb.com/cloud/atlas/support

---

**Deployed By**: AI Assistant  
**Deployment Date**: November 8, 2025  
**Version**: 1.0.0  
**Status**: 🟢 Production Ready
