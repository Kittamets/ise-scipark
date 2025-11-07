# 🚀 คู่มือ Deploy แบบแยกส่วน (Frontend + Backend)

## 📋 ภาพรวม

```
Development (Local)                Production (Cloud)
├── Frontend: localhost:5173  →   Netlify/Vercel (HTTPS)
└── Backend:  localhost:3000  →   Railway/Render (HTTPS)
```

---

## 🎯 ขั้นตอนการ Deploy

### Phase 1: Deploy Backend ก่อน (Railway/Render)
### Phase 2: Deploy Frontend (Netlify/Vercel)  
### Phase 3: เชื่อมต่อ Frontend กับ Backend

---

## 🔧 Phase 1: Deploy Backend

### Option A: Railway (แนะนำ - ใช้ง่าย)

#### 1. สร้าง Account Railway
- ไปที่ https://railway.app
- Sign up ด้วย GitHub

#### 2. Create New Project
```bash
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. เลือก repository: Kittamets/ise-scipark
4. Set Root Directory: /backend
```

#### 3. Environment Variables
ใน Railway Dashboard → Variables → Add:

```env
MONGO_URI=mongodb+srv://admin:1234@ise.qxi98tc.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_production_secret_generate_new_one
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=972cc2001@smtp-brevo.com
EMAIL_PASS=your_brevo_api_key
EMAIL_FROM=noreply@scipark.com
NODE_ENV=production
CLIENT_URL=temporary_will_update_later
PORT=3000
```

**⚠️ Important: Generate new JWT_SECRET**
```bash
# ใน terminal (Windows)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 4. Deploy Settings
```
Build Command: npm install
Start Command: npm start
```

#### 5. Deploy!
- Railway จะ auto-deploy
- รอ 2-3 นาที
- จะได้ URL: `https://your-backend-name.up.railway.app`

#### 6. Test Backend
```bash
# เปิด browser ไปที่:
https://your-backend-name.up.railway.app

# ควรเห็น: "APIs is currently running..."

# Test API:
https://your-backend-name.up.railway.app/api/parking/zones
```

#### 7. Seed Database (ถ้ายังไม่ได้ seed)
```bash
# Clone repo ในเครื่องอื่น หรือใช้ Railway CLI
railway run node scripts/seed.js
```

---

### Option B: Render

#### 1. สร้าง Account Render
- ไปที่ https://render.com
- Sign up ด้วย GitHub

#### 2. Create New Web Service
```
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repo: Kittamets/ise-scipark
4. Name: scipark-backend
5. Root Directory: backend
6. Environment: Node
7. Build Command: npm install
8. Start Command: npm start
```

#### 3. Environment Variables
Add ทีละตัว (เหมือน Railway):
```env
MONGO_URI=...
JWT_SECRET=...
EMAIL_HOST=...
(ฯลฯ ตามด้านบน)
```

#### 4. Deploy
- Render จะ auto-deploy
- รอ 5-10 นาที (ครั้งแรกนานหน่อย)
- จะได้ URL: `https://scipark-backend.onrender.com`

---

## 🎨 Phase 2: Deploy Frontend

### Option A: Netlify (แนะนำ - ฟรี, เร็ว)

#### 1. สร้าง Account Netlify
- ไปที่ https://netlify.com
- Sign up ด้วย GitHub

#### 2. Import Project
```
1. Click "Add new site" → "Import an existing project"
2. Connect GitHub: Kittamets/ise-scipark
3. Base directory: frontend
4. Build command: npm run build
5. Publish directory: frontend/dist
```

#### 3. Environment Variables
ใน Site settings → Environment variables:

```env
VITE_API_URL=https://your-backend-name.up.railway.app/api
```

**⚠️ ใส่ Backend URL ที่ได้จาก Phase 1!**

#### 4. Deploy Settings
```yaml
Build command: npm run build
Publish directory: frontend/dist
Node version: 18
```

#### 5. Deploy!
- Netlify จะ auto-build และ deploy
- รอ 2-3 นาที
- จะได้ URL: `https://your-site-name.netlify.app`

#### 6. Custom Domain (Optional)
- Settings → Domain management
- Add custom domain: `scipark.yourdomain.com`
- Configure DNS ตาม Netlify guide

---

### Option B: Vercel

#### 1. สร้าง Account Vercel
- ไปที่ https://vercel.com
- Sign up ด้วย GitHub

#### 2. Import Project
```
1. Click "Add New" → "Project"
2. Import: Kittamets/ise-scipark
3. Root Directory: frontend
4. Framework Preset: Vite
5. Build Command: npm run build
6. Output Directory: dist
```

#### 3. Environment Variables
```env
VITE_API_URL=https://your-backend-name.up.railway.app/api
```

#### 4. Deploy
- Vercel จะ auto-deploy
- จะได้ URL: `https://your-site-name.vercel.app`

---

## 🔗 Phase 3: เชื่อมต่อ Frontend ↔ Backend

### 1. อัปเดต Backend CORS

ใน Railway/Render → Environment Variables:
```env
CLIENT_URL=https://your-frontend-name.netlify.app
```

**Redeploy Backend** (Railway/Render จะ auto-redeploy)

### 2. อัปเดต Frontend API URL

ใน Netlify/Vercel → Environment Variables:
```env
VITE_API_URL=https://your-backend-name.up.railway.app/api
```

**Redeploy Frontend** (Netlify/Vercel จะ auto-redeploy)

### 3. Test Connection

1. เปิด Frontend URL: `https://your-site-name.netlify.app`
2. ไปที่หน้า Login
3. Login ด้วย test account: `iron@test.com` / `password123`
4. ถ้า Login สำเร็จ → **เชื่อมต่อได้แล้ว! 🎉**

---

## 🔐 Security Checklist

### Backend
- [ ] เปลี่ยน JWT_SECRET ใหม่ (อย่าใช้ตัวเดิมจาก development)
- [ ] เปลี่ยน MongoDB password (ถ้าใช้ production DB แยก)
- [ ] เปิด MongoDB IP Whitelist เฉพาะ Railway/Render IP
- [ ] ตั้งค่า CORS `origin` เป็น Frontend URL จริง
- [ ] เปิด `NODE_ENV=production`
- [ ] เปิด HTTPS only cookies

### Frontend
- [ ] ตั้งค่า `VITE_API_URL` เป็น Backend URL จริง
- [ ] ตรวจสอบ API calls ใช้ HTTPS
- [ ] ตั้งค่า Netlify redirects สำหรับ SPA routing

---

## 📊 Flow Chart

```
┌─────────────────────────────────────────────────────────┐
│  1. User เปิด Frontend                                  │
│     https://scipark.netlify.app                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ (with credentials)
                     ↓
┌─────────────────────────────────────────────────────────┐
│  2. Backend API รับ request                             │
│     https://scipark-api.railway.app/api/*               │
│                                                          │
│     ├─ ตรวจสอบ CORS (origin ตรงไหม?)                   │
│     ├─ ตรวจสอบ JWT Token (ถูก cookie)                  │
│     ├─ Query MongoDB Atlas                              │
│     └─ Return JSON response                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Response + Set Cookies
                     ↓
┌─────────────────────────────────────────────────────────┐
│  3. Frontend แสดงผล                                     │
│     Browser save cookies                                │
│     Update UI                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Common Issues

### Issue 1: CORS Error หลัง Deploy
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```env
# Backend Environment Variables
CLIENT_URL=https://your-exact-frontend-url.netlify.app  # ต้องตรงทุกตัวอักษร!

# ไม่ต้องมี trailing slash
# ✅ https://scipark.netlify.app
# ❌ https://scipark.netlify.app/
```

Redeploy backend หลังแก้!

---

### Issue 2: Cookies ไม่ทำงาน
```
401 Unauthorized - No token provided
```

**Solution:**
```javascript
// Backend: index.js - Cookie settings for production
res.cookie('token', token, {
  httpOnly: true,
  secure: true,        // ต้องเป็น true สำหรับ HTTPS
  sameSite: 'none',    // เปลี่ยนเป็น 'none' สำหรับ cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000
})
```

---

### Issue 3: API URL ผิด
```
GET https://localhost:3000/api/... net::ERR_NAME_NOT_RESOLVED
```

**Solution:**
```bash
# ตรวจสอบ Netlify Environment Variables
VITE_API_URL=https://your-backend.railway.app/api  # ไม่ใช่ localhost!

# Rebuild frontend
# Netlify จะ auto-rebuild หลังเปลี่ยน env vars
```

---

### Issue 4: MongoDB Connection Timeout
```
MongoNetworkError: connection timed out
```

**Solution:**
```bash
# MongoDB Atlas → Network Access
# เพิ่ม IP ของ Railway/Render

Railway IP: 0.0.0.0/0 (allow all) หรือ
Render IP: ดู docs ที่ https://render.com/docs/static-outbound-ip-addresses

# หรือง่ายสุด: Allow access from anywhere (development only!)
```

---

### Issue 5: Frontend ไม่พบหน้า (404)
```
Page not found after refresh
```

**Solution Netlify:**
สร้างไฟล์ `frontend/public/_redirects`:
```
/*    /index.html   200
```

**Solution Vercel:**
สร้างไฟล์ `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📝 Deployment Checklist

### Before Deploy
- [ ] Test ทั้งหมดใน local ให้ทำงานได้
- [ ] Commit code ทั้งหมดไป GitHub
- [ ] สร้าง production .env files
- [ ] Generate JWT_SECRET ใหม่

### Deploy Backend
- [ ] เลือก platform (Railway/Render)
- [ ] Connect GitHub repo
- [ ] Set root directory: `/backend`
- [ ] Add environment variables
- [ ] Deploy และรอ
- [ ] Test backend URL
- [ ] Seed database

### Deploy Frontend
- [ ] เลือก platform (Netlify/Vercel)
- [ ] Connect GitHub repo
- [ ] Set root directory: `/frontend`
- [ ] Set build command และ output
- [ ] Add environment variables (`VITE_API_URL`)
- [ ] Deploy และรอ
- [ ] Test frontend URL

### Connect Frontend ↔ Backend
- [ ] อัปเดต Backend `CLIENT_URL`
- [ ] อัปเดต Frontend `VITE_API_URL`
- [ ] Redeploy ทั้งสองส่วน
- [ ] Test login flow
- [ ] Test API calls
- [ ] ตรวจสอบ cookies ใน DevTools

### Post-Deploy
- [ ] Test ทุก feature
- [ ] ตรวจสอบ Network tab (HTTPS, CORS)
- [ ] Test บนมือถือ
- [ ] Setup monitoring (optional)
- [ ] Setup custom domain (optional)

---

## 🎯 Recommended Setup

```
Production Environment:
├── Backend: Railway (Free tier)
│   └── URL: https://scipark-api.up.railway.app
│
├── Frontend: Netlify (Free tier)
│   └── URL: https://scipark.netlify.app
│
└── Database: MongoDB Atlas (Free M0 cluster)
    └── Already configured
```

**ทำไมเลือกแบบนี้:**
- ✅ Railway: Auto-deploy, easy setup, good for Node.js
- ✅ Netlify: Fast CDN, great for React/Vite, free SSL
- ✅ MongoDB Atlas: Managed, reliable, free tier
- ✅ ทั้งหมดมี Free tier ใช้ได้ฟรี!

---

## 💰 Cost Estimation

### Free Tier (Recommended for learning/demo)
```
Railway:    500 hrs/month free (ประมาณ 20 วัน)
Netlify:    100 GB bandwidth/month
MongoDB:    512 MB storage
Total:      $0/month
```

### Paid Plan (For production)
```
Railway:    $5/month (Hobby plan)
Netlify:    Free (enough for most cases)
MongoDB:    $0-9/month (M0-M2)
Domain:     ~$10-15/year
Total:      ~$5-15/month
```

---

## 🔄 Auto-Deploy (CI/CD)

ทั้ง Railway และ Netlify รองรับ auto-deploy:

```
git push origin main
    │
    ├─→ GitHub detects push
    │
    ├─→ Railway auto-deploys backend
    │   (ประมาณ 2-3 นาที)
    │
    └─→ Netlify auto-builds & deploys frontend
        (ประมาณ 1-2 นาที)
```

**ไม่ต้องทำอะไรเพิ่ม - push แค่ครั้งเดียว deploy ทั้ง 2 ที่!**

---

## 📚 Resources

### Railway
- Docs: https://docs.railway.app
- Status: https://status.railway.app
- Community: https://discord.gg/railway

### Netlify
- Docs: https://docs.netlify.com
- Status: https://www.netlifystatus.com
- Community: https://answers.netlify.com

### Render
- Docs: https://render.com/docs
- Status: https://status.render.com

---

## 🎉 Summary

1. **Deploy Backend ก่อน** (Railway/Render)
   - ได้ URL: `https://your-backend.railway.app`

2. **Deploy Frontend** (Netlify/Vercel)
   - ใส่ Backend URL ใน env vars
   - ได้ URL: `https://your-frontend.netlify.app`

3. **เชื่อม Frontend ↔ Backend**
   - Backend: ตั้ง `CLIENT_URL`
   - Frontend: ตั้ง `VITE_API_URL`
   - Redeploy ทั้งคู่

4. **Test!**
   - เปิด Frontend
   - Login
   - ใช้งานได้ → สำเร็จ! 🚀

---

**ตอนนี้พร้อม Deploy จริงแล้ว!** 
ถ้ามีปัญหาตอน Deploy ให้ส่ง error message มาได้เลยครับ 🙌
