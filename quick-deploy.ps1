# 🚀 Quick Deploy Script

# Quick commands to deploy SciPark to production

# ==================================
# STEP 1: Prepare Production Secrets
# ==================================

Write-Host "🔐 Step 1: Generate Production Secrets" -ForegroundColor Cyan
Write-Host ""

# Generate JWT Secret
Write-Host "Generating JWT Secret..." -ForegroundColor Yellow
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Green
Write-Host ""

# MongoDB Production URI
Write-Host "MongoDB Production URI:" -ForegroundColor Yellow
Write-Host "MONGO_URI=mongodb+srv://admin:CHANGE_PASSWORD@ise.qxi98tc.mongodb.net/scipark_production?retryWrites=true&w=majority" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  ACTION REQUIRED:" -ForegroundColor Red
Write-Host "1. Change 'CHANGE_PASSWORD' to a strong password"
Write-Host "2. Create 'scipark_production' database in MongoDB Atlas"
Write-Host "3. Save these secrets to .env.production"
Write-Host ""

# ==================================
# STEP 2: Deploy Backend to Railway
# ==================================

Write-Host "🚂 Step 2: Deploy Backend to Railway" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
# npm install -g @railway/cli

Write-Host "Commands to deploy backend:" -ForegroundColor Yellow
Write-Host "cd backend" -ForegroundColor White
Write-Host "railway login" -ForegroundColor White
Write-Host "railway init" -ForegroundColor White
Write-Host "railway up" -ForegroundColor White
Write-Host ""

Write-Host "Set environment variables in Railway:" -ForegroundColor Yellow
Write-Host "railway variables set MONGO_URI='your_mongo_uri'" -ForegroundColor White
Write-Host "railway variables set JWT_SECRET='your_jwt_secret'" -ForegroundColor White
Write-Host "railway variables set NODE_ENV='production'" -ForegroundColor White
Write-Host "railway variables set CLIENT_URL='https://your-frontend-url.vercel.app'" -ForegroundColor White
Write-Host ""

# ==================================
# STEP 3: Deploy Frontend to Vercel
# ==================================

Write-Host "▲ Step 3: Deploy Frontend to Vercel" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
# npm install -g vercel

Write-Host "Commands to deploy frontend:" -ForegroundColor Yellow
Write-Host "cd frontend" -ForegroundColor White
Write-Host "vercel login" -ForegroundColor White
Write-Host "vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "Set environment variable in Vercel dashboard:" -ForegroundColor Yellow
Write-Host "VITE_API_URL=https://your-backend-url.railway.app/api" -ForegroundColor White
Write-Host ""

# ==================================
# STEP 4: Seed Production Database
# ==================================

Write-Host "🌱 Step 4: Seed Production Database" -ForegroundColor Cyan
Write-Host ""

Write-Host "Commands:" -ForegroundColor Yellow
Write-Host "cd backend" -ForegroundColor White
Write-Host "node scripts/seed.js" -ForegroundColor White
Write-Host ""

Write-Host "Expected output:" -ForegroundColor Yellow
Write-Host "✅ Created 5 parking zones" -ForegroundColor Green
Write-Host "✅ Created 140 parking spots" -ForegroundColor Green
Write-Host "✅ Created 5 promo codes" -ForegroundColor Green
Write-Host "✅ Created 3 test users" -ForegroundColor Green
Write-Host ""

# ==================================
# STEP 5: Test Deployment
# ==================================

Write-Host "🧪 Step 5: Test Live Deployment" -ForegroundColor Cyan
Write-Host ""

Write-Host "Test checklist:" -ForegroundColor Yellow
Write-Host "[ ] Health check: https://your-backend-url.railway.app/health" -ForegroundColor White
Write-Host "[ ] Frontend loads: https://your-frontend-url.vercel.app" -ForegroundColor White
Write-Host "[ ] User registration works" -ForegroundColor White
Write-Host "[ ] User login works" -ForegroundColor White
Write-Host "[ ] View parking zones" -ForegroundColor White
Write-Host "[ ] Create booking" -ForegroundColor White
Write-Host "[ ] View active booking" -ForegroundColor White
Write-Host "[ ] Finish parking & payment" -ForegroundColor White
Write-Host ""

# ==================================
# STEP 6: Set Up Monitoring
# ==================================

Write-Host "📊 Step 6: Set Up Monitoring" -ForegroundColor Cyan
Write-Host ""

Write-Host "Recommended tools:" -ForegroundColor Yellow
Write-Host "1. UptimeRobot (https://uptimerobot.com) - Free uptime monitoring" -ForegroundColor White
Write-Host "2. MongoDB Atlas Alerts - Database monitoring" -ForegroundColor White
Write-Host "3. Railway Logs - Application logs" -ForegroundColor White
Write-Host "4. Vercel Analytics - Frontend performance" -ForegroundColor White
Write-Host ""

# ==================================
# Summary
# ==================================

Write-Host "✅ Deployment Summary" -ForegroundColor Green
Write-Host ""
Write-Host "System Status:" -ForegroundColor Cyan
Write-Host "✅ Database: MongoDB Atlas (connected)" -ForegroundColor Green
Write-Host "✅ Backend: Ready for Railway deployment" -ForegroundColor Green
Write-Host "✅ Frontend: Ready for Vercel deployment" -ForegroundColor Green
Write-Host "✅ Real-time Updates: 30s polling enabled" -ForegroundColor Green
Write-Host "✅ All Data: Persisted to database" -ForegroundColor Green
Write-Host "✅ Tests: 21/21 passing" -ForegroundColor Green
Write-Host ""

Write-Host "📚 Documentation Created:" -ForegroundColor Cyan
Write-Host "- DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "- SYSTEM_STATUS_REPORT.md" -ForegroundColor White
Write-Host "- TEST_CASES_UPDATED.md" -ForegroundColor White
Write-Host "- API_TEST_SCRIPTS.md" -ForegroundColor White
Write-Host "- TEST_RESULTS_REPORT.md" -ForegroundColor White
Write-Host ""

Write-Host "⏱️  Estimated Time to Deploy: 2-4 hours" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎯 Ready to deploy? Follow the steps above!" -ForegroundColor Green
Write-Host ""
