# 🚀 SciPark - Production Environment Variables

## 🔐 Backend Environment Variables (Railway/Render)

Copy these variables to your Railway/Render dashboard:

### Database Configuration
```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```
**Instructions:**
1. Create MongoDB Atlas account at https://mongodb.com/cloud/atlas
2. Create M0 FREE cluster (Singapore region recommended)
3. Create database user with strong password
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string and replace USERNAME, PASSWORD, CLUSTER, DATABASE

Example:
```
mongodb+srv://scipark_admin:Xy9Zk2#mP@scipark-prod.abc123.mongodb.net/scipark_production?retryWrites=true&w=majority
```

---

### JWT Secret
```env
JWT_SECRET=YOUR_64_CHARACTER_RANDOM_SECRET_HERE
```
**Generate using:**

**Option 1 - PowerShell (Windows):**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

**Option 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 3 - OpenSSL:**
```bash
openssl rand -hex 64
```

**Option 4 - Quick Deploy Script:**
```powershell
.\QUICK_DEPLOY.ps1  # Select option 1
```

Example output:
```
a1b2c3d4e5f6789012345678901234567890abcdefghijklmnopqrstuvwxyz1234
```

---

### Email Configuration (Brevo SMTP)
```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=YOUR_BREVO_LOGIN_EMAIL
EMAIL_PASS=YOUR_BREVO_SMTP_KEY
EMAIL_FROM=noreply@scipark.com
```

**Instructions:**
1. Sign up at https://www.brevo.com (FREE - 300 emails/day)
2. Go to Settings → SMTP & API
3. Create new SMTP key
4. Copy credentials

Example:
```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=abc123@smtp-brevo.com
EMAIL_PASS=xkeyAbc123XyZ789Def456
EMAIL_FROM=noreply@scipark.com
```

---

### Server Configuration
```env
PORT=3000
NODE_ENV=production
CLIENT_URL=https://YOUR_FRONTEND_URL.vercel.app
```

**Instructions:**
1. Keep PORT=3000 (Railway/Render will handle port mapping)
2. NODE_ENV must be "production"
3. CLIENT_URL: Your Vercel frontend URL (for CORS)
   - Deploy frontend first to get this URL
   - Or use temporary value and update later

Example:
```env
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.vercel.app
```

---

### Redis Configuration (Optional)
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_ENABLED=false
```

**Instructions:**
- Leave REDIS_ENABLED=false for initial deployment
- System will work without Redis (graceful degradation)
- Enable later if you need caching for high traffic

---

## 🎨 Frontend Environment Variables (Vercel)

Copy these variables to your Vercel project settings:

### API Configuration
```env
VITE_API_URL=https://YOUR_BACKEND_URL.railway.app/api
```

**Instructions:**
1. Deploy backend to Railway first
2. Copy the generated Railway URL
3. Add `/api` at the end
4. Paste into Vercel environment variables

Example:
```env
VITE_API_URL=https://scipark-backend-production.up.railway.app/api
```

**Important:** 
- Must include `/api` at the end
- Must use `https://` (not `http://`)
- No trailing slash after `/api`

---

## 📋 Complete Example Setup

### Backend (Railway) - All Variables:
```env
MONGO_URI=mongodb+srv://scipark_admin:SecurePass123@scipark-prod.xyz.mongodb.net/scipark_production?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdefghijklmnopqrstuvwxyz1234
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=abc123@smtp-brevo.com
EMAIL_PASS=xkeyAbc123XyZ789Def456
EMAIL_FROM=noreply@scipark.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.vercel.app
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_ENABLED=false
```

### Frontend (Vercel) - All Variables:
```env
VITE_API_URL=https://scipark-backend-production.up.railway.app/api
```

---

## ✅ Verification Checklist

### Before Deployment:
- [ ] MongoDB connection string tested locally
- [ ] JWT secret is at least 32 characters
- [ ] Brevo SMTP credentials obtained
- [ ] All sensitive values are strong/secure
- [ ] No spaces before/after values
- [ ] URLs have correct protocol (https://)

### After Backend Deployment:
- [ ] Test health endpoint: `curl https://YOUR-BACKEND/health`
- [ ] Verify MongoDB connection in logs
- [ ] Test API endpoint: `curl https://YOUR-BACKEND/api/parking/zones`
- [ ] Check Railway logs for errors

### After Frontend Deployment:
- [ ] Test homepage loads
- [ ] Check browser console for errors
- [ ] Verify API calls work (Network tab)
- [ ] Test authentication flow
- [ ] Test booking flow

---

## 🔧 How to Set Variables

### Railway:
1. Go to your project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Click "Add" for each one
7. Railway will auto-redeploy with new variables

### Vercel:
1. Go to your project settings
2. Click "Environment Variables"
3. Add variable name: `VITE_API_URL`
4. Add value: Your Railway backend URL + `/api`
5. Select "Production" environment
6. Click "Save"
7. Redeploy to apply changes

### Render:
1. Go to your service dashboard
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Add each variable name and value
5. Click "Save Changes"
6. Render will auto-redeploy

---

## 🔄 Updating Variables

If you need to change any variable after deployment:

### Backend:
1. Update variable in platform dashboard
2. Service will auto-restart with new values
3. Test endpoints to verify

### Frontend:
1. Update VITE_API_URL in Vercel
2. Trigger manual redeploy or wait for auto-deploy
3. Clear browser cache and test

---

## 🚨 Common Issues

### Issue 1: CORS Error
**Error:** "Access-Control-Allow-Origin"  
**Solution:** Verify `CLIENT_URL` exactly matches your Vercel URL
```env
# ❌ Wrong
CLIENT_URL=http://scipark-app.vercel.app  # Should be https
CLIENT_URL=https://scipark-app.vercel.app/  # Remove trailing slash

# ✅ Correct
CLIENT_URL=https://scipark-app.vercel.app
```

### Issue 2: Database Connection Failed
**Error:** "MongooseServerSelectionError"  
**Solution:** 
1. Verify connection string format
2. Check MongoDB Atlas IP whitelist (must include 0.0.0.0/0)
3. Verify database user credentials
4. Test connection string locally first

### Issue 3: JWT Errors
**Error:** "jwt malformed" or "invalid signature"  
**Solution:**
1. Verify JWT_SECRET is set in backend
2. Ensure JWT_SECRET is at least 32 characters
3. Clear browser cookies and try again

### Issue 4: API Not Found
**Error:** 404 on API calls  
**Solution:**
1. Verify VITE_API_URL includes `/api` at the end
2. Check backend is actually deployed and running
3. Test backend directly: `curl https://YOUR-BACKEND/health`

### Issue 5: Email Not Sending
**Error:** SMTP connection failed  
**Solution:**
1. Verify Brevo credentials are correct
2. Check EMAIL_PORT is 587 (not 465 or 25)
3. Verify EMAIL_HOST is smtp-relay.brevo.com
4. Test with Brevo dashboard

---

## 🔐 Security Best Practices

### ✅ DO:
- Use strong, random JWT secret (64+ characters)
- Use strong MongoDB password (16+ characters, mixed case, numbers, symbols)
- Keep .env files in .gitignore
- Use different secrets for dev/staging/production
- Rotate secrets periodically (every 3-6 months)
- Use environment variables (never hardcode)

### ❌ DON'T:
- Commit .env files to Git
- Share secrets in Slack/Discord/Email
- Use simple/guessable secrets
- Use same secret across environments
- Store secrets in code comments
- Screenshot secrets and share publicly

---

## 📊 Environment Checklist

Use this to track your setup:

### MongoDB Atlas:
- [ ] Account created
- [ ] M0 FREE cluster created (Singapore region)
- [ ] Database user created with strong password
- [ ] IP whitelist set to 0.0.0.0/0
- [ ] Connection string obtained
- [ ] Connection tested locally
- [ ] MONGO_URI set in Railway/Render

### JWT Secret:
- [ ] Secret generated (64+ characters)
- [ ] Secret saved securely
- [ ] JWT_SECRET set in Railway/Render

### Brevo SMTP:
- [ ] Account created
- [ ] SMTP key generated
- [ ] EMAIL_* variables set in Railway/Render
- [ ] Test email sent successfully

### Railway/Render:
- [ ] Account created
- [ ] Project created
- [ ] All backend variables set
- [ ] Service deployed successfully
- [ ] Backend URL copied

### Vercel:
- [ ] Account created
- [ ] Project created
- [ ] VITE_API_URL set with backend URL
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] CLIENT_URL updated in Railway/Render

---

## 🎯 Quick Setup Template

Copy this template and fill in your values:

```
=== PRODUCTION ENVIRONMENT VARIABLES ===

Backend URL: https://______________________.railway.app
Frontend URL: https://______________________.vercel.app

MONGO_URI=mongodb+srv://___________:___________@___________.mongodb.net/___________?retryWrites=true&w=majority
JWT_SECRET=_________________________________________________________________
EMAIL_USER=___________@smtp-brevo.com
EMAIL_PASS=_________________________
CLIENT_URL=https://______________________.vercel.app
VITE_API_URL=https://______________________.railway.app/api

Deployment Date: ___________
Deployed By: ___________
```

---

**Need help?** Check:
- `PRODUCTION_SETUP.md` for detailed setup instructions
- `DEPLOYMENT_CHECKLIST.md` for complete deployment workflow
- `START_HERE.md` for quick start guide

**Ready to deploy?** Run:
```powershell
.\QUICK_DEPLOY.ps1  # Option 5: Create Production Environment File
```

---

**Created**: November 8, 2025  
**Last Updated**: November 8, 2025  
**Status**: ✅ Ready for Use
