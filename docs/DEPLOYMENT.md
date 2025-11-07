# 🚀 คู่มือ Deploy SciPark

## 📋 สิ่งที่ต้องเตรียม

1. บัญชี [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ฟรี)
2. บัญชี [Netlify](https://www.netlify.com/) (ฟรี)
3. บัญชี [GitHub](https://github.com/) (ฟรี)

---

## 1️⃣ เตรียม MongoDB Atlas

### สร้าง Cluster (ฟรี)

1. ไปที่ https://www.mongodb.com/cloud/atlas
2. Sign up / Login
3. สร้าง Organization ใหม่
4. สร้าง Project ใหม่ชื่อ "SciPark"
5. กด **"Build a Database"**
6. เลือก **FREE** (M0 Sandbox)
7. เลือก Cloud Provider: **AWS**
8. เลือก Region ใกล้คุณที่สุด (แนะนำ: Singapore)
9. ตั้งชื่อ Cluster: `scipark-cluster`
10. กด **"Create"**

### ตั้งค่า Database Access

1. ไปที่ **"Database Access"** (เมนูซ้าย)
2. กด **"Add New Database User"**
3. เลือก **Password** authentication
4. ตั้ง Username: `scipark-admin`
5. กด **"Autogenerate Secure Password"** (เก็บรหัสนี้ไว้)
6. Database User Privileges: **"Read and write to any database"**
7. กด **"Add User"**

### ตั้งค่า Network Access

1. ไปที่ **"Network Access"** (เมนูซ้าย)
2. กด **"Add IP Address"**
3. เลือก **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Comment: `Netlify Functions`
5. กด **"Confirm"**

### รับ Connection String

1. ไปที่ **"Database"** (เมนูซ้าย)
2. กด **"Connect"** บน cluster ของคุณ
3. เลือก **"Connect your application"**
4. Driver: **Node.js**
5. คัดลอก Connection String:
   ```
   mongodb+srv://scipark-admin:<password>@scipark-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. แทนที่ `<password>` ด้วยรหัสผ่านจริง
7. เพิ่ม database name หลัง `.net/`:
   ```
   mongodb+srv://scipark-admin:YOUR_PASSWORD@scipark-cluster.xxxxx.mongodb.net/scipark?retryWrites=true&w=majority
   ```

---

## 2️⃣ Push โค้ดไปยัง GitHub

### สร้าง Repository

1. ไปที่ https://github.com/new
2. Repository name: `scipark-app`
3. เลือก **Public** (หรือ Private)
4. **ไม่ต้อง** เลือก README, .gitignore, license
5. กด **"Create repository"**

### Push โค้ด

```bash
# ใน VS Code Terminal (PowerShell)
cd C:\ise-scipark

# ถ้ายังไม่มี git init
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Complete SciPark app"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/scipark-app.git

# Push
git branch -M main
git push -u origin main
```

---

## 3️⃣ Deploy บน Netlify

### Connect to Git

1. ไปที่ https://app.netlify.com/
2. Sign up / Login (แนะนำใช้ GitHub account)
3. กด **"Add new site"** → **"Import an existing project"**
4. เลือก **"Deploy with GitHub"**
5. Authorize Netlify เข้าถึง GitHub
6. เลือก repository `scipark-app`

### Configure Build Settings

1. **Site name**: `scipark-app` (หรือชื่อที่คุณต้องการ)
2. **Branch to deploy**: `main`
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`
5. **Functions directory**: `netlify/functions` (ตั้งไว้แล้วใน netlify.toml)

### ตั้งค่า Environment Variables

กด **"Add environment variables"** และเพิ่ม:

```env
MONGODB_URI=mongodb+srv://scipark-admin:YOUR_PASSWORD@scipark-cluster.xxxxx.mongodb.net/scipark?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-please-change-this
NODE_ENV=production
```

⚠️ **สำคัญ**: แทนที่ `YOUR_PASSWORD` และ `JWT_SECRET` ด้วยค่าจริง

### Deploy!

1. กด **"Deploy site"**
2. รอประมาณ 2-3 นาที
3. เมื่อเสร็จจะได้ URL: `https://scipark-app.netlify.app`

---

## 4️⃣ Seed ข้อมูลทดสอบ

### ติดตั้ง Netlify CLI

```bash
npm install -g netlify-cli
```

### Login to Netlify

```bash
netlify login
```

### Link โปรเจค

```bash
cd C:\ise-scipark
netlify link
```

เลือก site ที่เพิ่งสร้าง

### รัน Seed Script

```bash
cd netlify/functions
npm install

# ตั้งค่า environment variables ใน .env
# (คัดลอกจาก Netlify dashboard)

npm run seed
```

ข้อมูลที่จะถูกสร้าง:
- ✅ 4 โซนจอดรถ
- ✅ 90 ที่จอดรถ
- ✅ 3 โค้ดโปรโมชั่น

---

## 5️⃣ ทดสอบระบบ

### เปิดเว็บไซต์

```
https://YOUR-SITE-NAME.netlify.app
```

### ทดสอบ Authentication

1. กดปุ่ม **"เริ่มใช้งานฟรี"** หรือ **"เข้าสู่ระบบ"**
2. ลงทะเบียนผู้ใช้ใหม่
3. Login เข้าสู่ระบบ

### ทดสอบการจอง

1. เลือกที่จอดจาก Dashboard
2. กด **"จองเลย"**
3. เลือกชั้นและยืนยัน
4. ดูการจองที่ **"การจองของฉัน"**
5. ทดสอบจบการจอง/ยกเลิก

### ทดสอบ Membership

1. ไปที่ **"สิทธิพิเศษ"**
2. กด **"แลกโค้ดตอนนี้"**
3. ใส่โค้ด: `SCIPARK2024`
4. ตรวจสอบว่าได้ Diamond tier แล้ว

### ทดสอบ Profile

1. ไปที่ **"โปรไฟล์"**
2. แก้ไขข้อมูลส่วนตัว
3. เพิ่มยานพาหนะ
4. ดูประวัติการจอง

---

## 🔧 Update โค้ด

เมื่อแก้ไขโค้ด:

```bash
git add .
git commit -m "Fix: your changes"
git push
```

Netlify จะ auto-deploy ใหม่ภายใน 2-3 นาที

---

## 🐛 Troubleshooting

### ❌ Build failed

1. ตรวจสอบ logs ใน Netlify dashboard
2. ตรวจสอบว่า environment variables ถูกต้อง
3. ตรวจสอบว่า `npm install` สำเร็จ

### ❌ API errors (500)

1. ไปที่ Netlify → Functions → เลือก function
2. ดู logs เพื่อหา error
3. ตรวจสอบ `MONGODB_URI` ถูกต้อง
4. ตรวจสอบ Network Access ใน MongoDB Atlas (0.0.0.0/0)

### ❌ Cannot connect to MongoDB

1. ตรวจสอบ Connection String
2. ตรวจสอบรหัสผ่าน (ต้อง URL encode ถ้ามีอักขระพิเศษ)
3. ตรวจสอบ IP Whitelist (ต้องมี 0.0.0.0/0)
4. ตรวจสอบว่า Database User มีสิทธิ์

### ❌ JWT errors

1. ตรวจสอบ `JWT_SECRET` ตั้งค่าถูกต้อง
2. ตรวจสอบว่า token ส่งไปใน header
3. ลอง logout และ login ใหม่

---

## 📊 Monitor & Analytics

### Netlify Analytics

- ไปที่ Netlify dashboard → Analytics
- ดูจำนวน visitors, page views
- ดู function invocations

### MongoDB Atlas Metrics

- ไปที่ MongoDB Atlas → Metrics
- ดู connections, queries per second
- ดู storage size

---

## 🎯 Production Checklist

- [ ] MongoDB Cluster สร้างเสร็จแล้ว
- [ ] Database User และ Password ตั้งแล้ว
- [ ] Network Access เปิด 0.0.0.0/0
- [ ] Connection String ทดสอบแล้ว
- [ ] GitHub Repository สร้างแล้ว
- [ ] Push โค้ดไปยัง GitHub แล้ว
- [ ] Netlify Site สร้างแล้ว
- [ ] Environment Variables ตั้งค่าครบ
- [ ] Deploy สำเร็จแล้ว
- [ ] Seed data ใส่แล้ว
- [ ] ทดสอบ Authentication ผ่าน
- [ ] ทดสอบ Booking ผ่าน
- [ ] ทดสอบ Membership ผ่าน
- [ ] ทดสอบ Profile ผ่าน
- [ ] Custom domain ตั้งแล้ว (ถ้ามี)

---

## 🎉 เสร็จแล้ว!

เว็บไซต์ของคุณพร้อมใช้งานแล้ว! 🚀

**URL**: https://YOUR-SITE-NAME.netlify.app

**Features**:
- ✅ Authentication ระบบ JWT
- ✅ Parking booking แบบ real-time
- ✅ Membership tiers (Iron/Diamond/Predator)
- ✅ Payment simulation
- ✅ Vehicle management
- ✅ Booking history
- ✅ Promo codes
- ✅ Responsive design (Mobile/Tablet/Desktop)
- ✅ Beautiful animations

**Cost**: 💯 ฟรี 100%!
- MongoDB Atlas M0: ฟรี
- Netlify Free Tier: ฟรี
- GitHub: ฟรี

---

## 📱 Share Your Work

แชร์โปรเจคของคุณ:

```
Check out my SciPark app! 🚗
https://YOUR-SITE-NAME.netlify.app

Features:
- Smart parking booking
- 3 membership tiers
- Real-time availability
- Beautiful UI with animations

Built with React + Vite + MongoDB + Netlify
```

---

## 💡 Next Steps

1. เพิ่ม Custom Domain
2. เพิ่ม Google Analytics
3. เพิ่ม Meta tags สำหรับ SEO
4. เพิ่ม Progressive Web App (PWA)
5. เพิ่ม Email notifications
6. เพิ่ม Line Notify integration
7. เพิ่ม Payment gateway จริง
8. เพิ่ม Admin dashboard

---

**Need help?** เปิด Issue ใน GitHub repository! 😊
