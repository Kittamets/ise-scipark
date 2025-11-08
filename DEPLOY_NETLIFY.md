# 🚀 Deploy SciPark บน Netlify + Railway

## ✅ ทำไมต้องเลือก Netlify?

### **Frontend (Netlify) - ฟรี 100%! 🎉**
- ✅ **ฟรีไม่มีค่าใช้จ่าย** - ไม่ต้องใส่บัตรเครดิต!
- ✅ **Deploy อัตโนมัติ** จาก GitHub
- ✅ **CDN ทั่วโลก** - เร็วมาก
- ✅ **SSL ฟรี** - HTTPS อัตโนมัติ
- ✅ **Bandwidth ไม่จำกัด**
- ✅ **Deploy ไม่จำกัดครั้ง**
- ✅ **Custom domain ฟรี**

### **Backend (Railway) - $5-10/เดือน**
- ✅ **Auto-restart** เมื่อ crash
- ✅ **Easy monitoring**
- ✅ **GitHub integration**

---

## 🎯 สถาปัตยกรรมระบบ

```
┌──────────────┐
│   ผู้ใช้      │
└──────┬───────┘
       │
       ↓
┌─────────────────────┐
│  Netlify (Frontend) │  ← ฟรี!
│  React + Vite       │
└──────────┬──────────┘
           │ API calls
           ↓
┌──────────────────────┐
│  Railway (Backend)   │  ← $5-10/เดือน
│  Express.js + Node   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  MongoDB Atlas       │  ← ฟรี!
│  Database            │
└──────────────────────┘
```

---

## 📋 ขั้นตอนการ Deploy (30 นาที)

### ขั้นที่ 0: เตรียม JWT Secret (2 นาที)

```powershell
# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))

# หรือใช้ Script
.\QUICK_DEPLOY.ps1  # เลือก option 1
```

📝 **เก็บ Secret นี้ไว้!**

---

### ขั้นที่ 1: Deploy Backend ไป Railway (10 นาที)

#### 1.1 สมัคร Railway
1. ไปที่: https://railway.app
2. คลิก **"Start a New Project"**
3. เข้าสู่ระบบด้วย **GitHub**

#### 1.2 Deploy Backend
1. คลิก **"Deploy from GitHub repo"**
2. เลือก repository: **`Kittamets/ise-scipark`**
3. Railway จะ detect โปรเจค

#### 1.3 ตั้งค่า Backend
1. คลิกที่ service ที่สร้าง
2. ไปที่ **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`

#### 1.4 ตั้งค่า Environment Variables
ไปที่ Tab **"Variables"** แล้วเพิ่ม:

```env
MONGO_URI=mongodb+srv://admin:1234@ise.qxi98tc.mongodb.net/scipark_production?retryWrites=true&w=majority
JWT_SECRET=<ใส่ Secret ที่สร้างจากขั้นที่ 0>
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=972cc2001@smtp-brevo.com
EMAIL_PASS=your_brevo_api_key_here
EMAIL_FROM=noreply@scipark.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.netlify.app
REDIS_ENABLED=false
```

⚠️ **สำคัญ**: `CLIENT_URL` ให้ใส่ชื่อที่จะใช้บน Netlify (ขั้นตอนถัดไป)

#### 1.5 Deploy
1. คลิก **"Deploy"**
2. รอ 2-3 นาที
3. คัดลอก URL ที่ได้: `https://scipark-backend-xxx.up.railway.app`

#### 1.6 ทดสอบ Backend
```powershell
# Test health endpoint
curl https://YOUR-RAILWAY-URL/health

# ควรได้ response:
# {
#   "status": "ok",
#   "database": "connected",
#   ...
# }
```

✅ **Backend พร้อมแล้ว!**

---

### ขั้นที่ 2: Deploy Frontend ไป Netlify (10 นาที)

#### 2.1 สมัคร Netlify
1. ไปที่: https://netlify.com
2. คลิก **"Sign up"**
3. เข้าสู่ระบบด้วย **GitHub** (แนะนำ)

#### 2.2 Deploy Frontend
1. ใน Dashboard คลิก **"Add new site"** → **"Import an existing project"**
2. เลือก **"Deploy with GitHub"**
3. อนุญาตให้ Netlify เข้าถึง GitHub
4. เลือก repository: **`Kittamets/ise-scipark`**

#### 2.3 ตั้งค่า Build
ใส่ค่าเหล่านี้:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |

#### 2.4 ตั้งค่า Environment Variables
1. คลิก **"Show advanced"**
2. คลิก **"New variable"**
3. เพิ่มตัวแปร:

```
Key: VITE_API_URL
Value: https://YOUR-RAILWAY-URL/api
```

⚠️ **สำคัญ**: 
- ใส่ Railway URL ที่คัดลอกจากขั้นที่ 1.5
- **ต้องมี `/api` ต่อท้าย!**
- ตัวอย่าง: `https://scipark-backend-production.up.railway.app/api`

#### 2.5 Deploy!
1. คลิก **"Deploy site"**
2. รอ 1-2 นาที
3. Netlify จะสร้าง URL ให้: `https://random-name-123.netlify.app`

#### 2.6 เปลี่ยนชื่อ Site (Optional)
1. ไปที่ **Site settings** → **Site details**
2. คลิก **"Change site name"**
3. ใส่ชื่อ: `scipark-app` (ถ้าว่าง)
4. Save
5. URL จะเป็น: `https://scipark-app.netlify.app`

#### 2.7 อัปเดต Backend CORS
1. กลับไป Railway dashboard
2. ไปที่ Variables
3. แก้ `CLIENT_URL` เป็น Netlify URL ที่ได้:
   ```
   CLIENT_URL=https://scipark-app.netlify.app
   ```
4. Railway จะ restart อัตโนมัติ

✅ **Frontend พร้อมแล้ว!**

---

### ขั้นที่ 3: ทดสอบระบบ (5 นาที)

#### 3.1 ทดสอบ Backend
```powershell
# Test API endpoints
$API = "https://YOUR-RAILWAY-URL"

# Health check
curl "$API/health"

# Parking zones
curl "$API/api/parking/zones"

# Parking spots
curl "$API/api/parking/spots"
```

#### 3.2 ทดสอบ Frontend
1. เปิด `https://scipark-app.netlify.app` ในเบราว์เซอร์
2. เช็ค:
   - [ ] หน้า Homepage โหลดได้
   - [ ] เห็น Parking Zones ทั้ง 5 โซน
   - [ ] กด F12 → Console → ไม่มี Error สีแดง
   - [ ] กด F12 → Network → API calls ไป Railway สำเร็จ (200/304)
   - [ ] ลองสมัครสมาชิก
   - [ ] ลอง Login
   - [ ] ลองจองที่จอด

#### 3.3 ทดสอบ Real-time Updates
1. เปิดหน้า Homepage
2. รอ 30 วินาที
3. ดู Network tab → ควรเห็น request ใหม่ไป `/api/parking/zones`
4. ตัวเลข availability ควร refresh อัตโนมัติ

✅ **ระบบทำงานสมบูรณ์!**

---

## 🔄 Auto-Deploy Setup

### Netlify Auto-Deploy (ตั้งค่าแล้ว!)
ทุกครั้งที่คุณ push code ขึ้น GitHub:
1. Netlify จะ detect การเปลี่ยนแปลง
2. Build และ deploy อัตโนมัติ
3. ใช้เวลา 1-2 นาที
4. ได้ URL ใหม่ทันที

### Railway Auto-Deploy (ตั้งค่าแล้ว!)
ทุกครั้งที่คุณ push code ขึ้น GitHub:
1. Railway จะ detect การเปลี่ยนแปลง
2. Build และ deploy อัตโนมัติ
3. Restart service
4. ใช้เวลา 2-3 นาที

---

## 🌐 Custom Domain (Optional)

### ตั้งค่า Domain สำหรับ Netlify (ฟรี!)

#### ถ้ามี Domain แล้ว:
1. ใน Netlify Dashboard → **Domain settings**
2. คลิก **"Add custom domain"**
3. ใส่ domain: `scipark.com`
4. ทำตาม DNS instructions:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: scipark-app.netlify.app
   ```
5. รอ DNS propagate (5-30 นาที)
6. Netlify จะออก SSL certificate อัตโนมัติ (HTTPS)

#### ถ้ายังไม่มี Domain:
ใช้ของ Netlify ฟรี: `https://scipark-app.netlify.app`

---

## 💰 สรุปค่าใช้จ่าย

| บริการ | ราคา | Features |
|--------|------|----------|
| **Netlify** (Frontend) | **ฟรี 🎉** | 100GB bandwidth/month, Unlimited sites, SSL ฟรี, CDN |
| **Railway** (Backend) | **$5-10/เดือน** | 500MB RAM, Auto-restart, Monitoring |
| **MongoDB Atlas** | **ฟรี 🎉** | 512MB storage, Backups |
| **Brevo** (Email) | **ฟรี 🎉** | 300 emails/วัน |
| **รวมต่อเดือน** | **$5-10** | **ประหยัดกว่า 90% เทียบกับ cloud อื่น!** |

---

## 📊 Monitoring & Logs

### Netlify Dashboard
1. **Deploys**: ดูประวัติการ deploy
2. **Functions**: ดู logs (ถ้าใช้ Netlify Functions)
3. **Analytics**: ดู traffic (ฟรี tier มีจำกัด)
4. **Build logs**: Debug build issues

### Railway Dashboard
1. **Metrics**: CPU, Memory, Network
2. **Logs**: Real-time application logs
3. **Deployments**: Deploy history
4. **Usage**: ดูค่าใช้จ่าย

### MongoDB Atlas
1. **Metrics**: Database performance
2. **Logs**: Query logs
3. **Alerts**: Set up notifications

---

## 🔧 Netlify CLI (Advanced)

ถ้าอยากใช้ Command Line:

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link project
cd c:\ise-scipark\frontend
netlify link

# Deploy manually
netlify deploy --prod

# Open dashboard
netlify open
```

---

## 🚨 Troubleshooting

### ปัญหา 1: Frontend ไม่โหลด
**อาการ**: หน้าขาว หรือ 404
**แก้ไข**:
1. เช็ค Build logs ใน Netlify
2. ตรวจสอบ `netlify.toml` มี redirect rules
3. Verify publish directory: `frontend/dist`

### ปัญหา 2: API calls ไม่ทำงาน
**อาการ**: Console error "Failed to fetch"
**แก้ไข**:
1. เช็ค `VITE_API_URL` ใน Netlify environment variables
2. ต้องมี `/api` ต่อท้าย
3. ต้องเป็น `https://` ไม่ใช่ `http://`
4. ทดสอบ backend URL โดยตรง: `curl https://YOUR-RAILWAY-URL/health`

### ปัญหา 3: CORS Error
**อาการ**: "Access-Control-Allow-Origin"
**แก้ไข**:
1. เช็ค `CLIENT_URL` ใน Railway
2. ต้องตรงกับ Netlify URL
3. ไม่มี `/` ต่อท้าย
4. ตัวอย่าง: `https://scipark-app.netlify.app`

### ปัญหา 4: Environment Variables ไม่ทำงาน
**อาการ**: ตัวแปรเป็น `undefined`
**แก้ไข**:
1. Netlify: ต้องขึ้นต้นด้วย `VITE_`
2. Railway: ไม่ต้องมี prefix
3. หลังแก้ env vars ต้อง redeploy
4. Clear build cache ใน Netlify: Settings → Build & deploy → Clear cache and retry deploy

### ปัญหา 5: Build Failed
**อาการ**: Build error ใน Netlify
**แก้ไข**:
1. เช็ค Node version: ควรเป็น 18+
2. ลบ `node_modules` และ `package-lock.json`
3. Re-install: `npm install`
4. Test build locally: `npm run build`
5. Commit และ push ใหม่

---

## 📱 Branch Previews (Bonus!)

Netlify รองรับ Deploy Preview สำหรับทุก branch!

### การใช้งาน:
1. สร้าง branch ใหม่: `git checkout -b feature/new-feature`
2. แก้ code และ commit
3. Push: `git push origin feature/new-feature`
4. Netlify จะสร้าง deploy preview อัตโนมัติ
5. ได้ URL: `https://deploy-preview-123--scipark-app.netlify.app`
6. Test ก่อน merge ไป main

### ประโยชน์:
- ✅ Test features ก่อน production
- ✅ Share preview link กับทีม
- ✅ Review changes ก่อน merge
- ✅ Automatic cleanup เมื่อ merge แล้ว

---

## 🎯 Performance Tips

### Netlify Optimizations:
1. **Image Optimization** (Paid):
   - Automatic image resize
   - WebP conversion
   - Lazy loading

2. **Asset Optimization**:
   - Vite จัดการให้แล้ว (tree-shaking, minification)
   - Gzip compression อัตโนมัติ

3. **CDN Caching**:
   - Static assets cache ที่ CDN
   - Header `Cache-Control` ตั้งค่าใน `netlify.toml` แล้ว

### Railway Optimizations:
1. **Redis Caching**: เปิดใช้เมื่อ traffic สูง
2. **Database Indexing**: เพิ่ม indexes ใน MongoDB
3. **PM2 Clustering**: ใช้หลาย process (ต้อง upgrade plan)

---

## 📈 Scaling Strategy

### เมื่อ Traffic เพิ่มขึ้น:

**Netlify (Frontend):**
- ✅ Auto-scale โดย CDN
- ✅ ไม่ต้องทำอะไร!
- ✅ รองรับ millions of requests

**Railway (Backend):**
- Level 1 (0-100 users): Starter $5/month
- Level 2 (100-1000 users): Pro $20/month
- Level 3 (1000+ users): Enterprise $50+/month

**MongoDB Atlas:**
- M0 Free: 512MB (100-500 bookings)
- M10: $0.08/hour (1000-5000 bookings)
- M20+: ขึ้นอยู่กับ usage

---

## ✅ Deployment Checklist

### Pre-Deploy:
- [x] Code committed และ pushed ไป GitHub
- [x] `netlify.toml` สร้างแล้ว
- [x] JWT secret generated
- [x] MongoDB connection string พร้อม
- [x] Brevo SMTP credentials พร้อม

### Railway Deploy:
- [ ] Railway account created
- [ ] Backend deployed
- [ ] Environment variables ใส่ครบ
- [ ] Backend URL คัดลอกแล้ว
- [ ] Health check ผ่าน

### Netlify Deploy:
- [ ] Netlify account created
- [ ] Frontend deployed
- [ ] VITE_API_URL ตั้งค่าแล้ว
- [ ] Site name เปลี่ยนแล้ว (optional)
- [ ] Frontend URL คัดลอกแล้ว

### Post-Deploy:
- [ ] อัปเดต CLIENT_URL ใน Railway
- [ ] ทดสอบ API calls
- [ ] ทดสอบ authentication
- [ ] ทดสอบ booking flow
- [ ] ทดสอบ mobile responsive
- [ ] Run seed script (ถ้าจำเป็น)

---

## 🎉 เสร็จแล้ว!

### URLs ของคุณ:
- **Frontend**: `https://scipark-app.netlify.app`
- **Backend**: `https://scipark-backend-xxx.up.railway.app`
- **Health Check**: `https://scipark-backend-xxx.up.railway.app/health`

### Next Steps:
1. ✅ Share URLs กับทีม
2. ✅ Monitor logs วันแรก
3. ✅ เก็บ feedback จาก users
4. ✅ Plan features ถัดไป

---

## 📞 Support & Resources

### Netlify:
- Docs: https://docs.netlify.com
- Support: https://netlify.com/support
- Community: https://answers.netlify.com

### Railway:
- Docs: https://docs.railway.app
- Support: https://railway.app/help
- Discord: https://discord.gg/railway

### SciPark Docs:
- `START_HERE.md` - Overview
- `PRODUCTION_SETUP.md` - Railway + Vercel setup
- `ENVIRONMENT_VARIABLES.md` - All env vars
- `API_TEST_SCRIPTS.md` - API testing

---

**สร้างโดย**: GitHub Copilot  
**วันที่**: 8 พฤศจิกายน 2568  
**Platform**: Netlify + Railway  
**ค่าใช้จ่าย**: ~$5-10/เดือน  
**Status**: ✅ พร้อม Deploy!

---

## 🚀 เริ่ม Deploy เลย!

```powershell
# ขั้นที่ 1: Generate JWT Secret
.\QUICK_DEPLOY.ps1  # Option 1

# ขั้นที่ 2: Deploy Backend (Railway)
# ไปที่ https://railway.app

# ขั้นที่ 3: Deploy Frontend (Netlify)  
# ไปที่ https://netlify.com

# Done! 🎉
```

**ขอให้โชคดี! 🚀**
