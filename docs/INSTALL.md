# 🚀 SciPark Installation Guide

## Quick Start (5 นาที!)

### 1. ติดตั้ง Dependencies

```powershell
# ติดตั้ง Node packages สำหรับ Frontend
npm install

# ติดตั้ง packages สำหรับ Backend Functions
cd netlify/functions
npm install
cd ../..
```

### 2. สร้าง MongoDB Atlas Database (ฟรี!)

1. ไปที่ https://www.mongodb.com/cloud/atlas/register
2. สร้างบัญชีใหม่ (ฟรี)
3. สร้าง Cluster ใหม่:
   - เลือก **FREE** tier
   - เลือก region ที่ใกล้ที่สุด (เช่น Singapore)
   - คลิก "Create Cluster"
   
4. รอ Cluster สร้างเสร็จ (2-3 นาที)

5. สร้าง Database User:
   - ไปที่ **Database Access**
   - คลิก **Add New Database User**
   - Username: `scipark`
   - Password: สร้างรหัสผ่าน (จดไว้!)
   - Permissions: **Read and write to any database**
   - คลิก **Add User**

6. เพิ่ม IP Address:
   - ไปที่ **Network Access**
   - คลิก **Add IP Address**
   - คลิก **Allow Access from Anywhere** (0.0.0.0/0)
   - คลิก **Confirm**

7. Get Connection String:
   - กลับไปที่ **Database**
   - คลิก **Connect**
   - เลือก **Connect your application**
   - คัดลอก Connection String
   - แทนที่ `<password>` ด้วยรหัสผ่านที่สร้างไว้

### 3. Setup Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```powershell
# คัดลอกจาก template
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
# MongoDB Atlas Connection (ใส่ connection string ที่คัดลอกมา)
MONGODB_URI=mongodb+srv://scipark:<PASSWORD>@cluster0.xxxxx.mongodb.net/scipark?retryWrites=true&w=majority

# JWT Secret (สุ่มข้อความยาว ๆ ไว้)
JWT_SECRET=my-super-secret-key-change-this-to-random-string-12345678

# Email (ถ้าต้องการใช้ OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NODE_ENV=development
VITE_API_URL=http://localhost:8888/.netlify/functions
```

### 4. ติดตั้ง Netlify CLI

```powershell
npm install -g netlify-cli
```

### 5. Run Development Server

เปิด 2 terminals:

**Terminal 1 - Frontend (Vite)**
```powershell
npm run dev
```

**Terminal 2 - Backend (Netlify Functions)**
```powershell
netlify dev
```

เปิดเบราว์เซอร์ที่: http://localhost:3000

## 🎨 ทดสอบระบบ

1. **ลงทะเบียน**:
   - เข้า http://localhost:3000/register
   - กรอกข้อมูล: email, username, password
   - คลิก "ลงทะเบียน"

2. **เข้าสู่ระบบ**:
   - เข้า http://localhost:3000/login
   - กรอก username และ password
   - คลิก "เข้าสู่ระบบ"

3. **ดูหน้าหลัก**:
   - จะเห็นที่จอดรถที่ว่าง
   - ลองคลิกดูรายละเอียด

## 📦 Deploy to Netlify

### วิธีที่ 1: Deploy ผ่าน Git (แนะนำ)

1. **Push code ขึ้น GitHub**:
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scipark.git
git push -u origin main
```

2. **Deploy on Netlify**:
   - ไปที่ https://app.netlify.com
   - คลิก **"New site from Git"**
   - เชื่อมต่อ GitHub
   - เลือก repository **scipark**
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - คลิก **"Deploy site"**

3. **Add Environment Variables**:
   - ไปที่ **Site settings** → **Environment variables**
   - เพิ่มตัวแปรเหล่านี้:
     ```
     MONGODB_URI=your_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Redeploy**:
   - ไปที่ **Deploys**
   - คลิก **"Trigger deploy"** → **"Deploy site"**

### วิธีที่ 2: Deploy ผ่าน CLI

```powershell
# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --prod
```

## 🔧 Troubleshooting

### ปัญหา: `npm install` ล้มเหลว
```powershell
# ลบ node_modules และลองใหม่
rm -rf node_modules package-lock.json
npm install
```

### ปัญหา: MongoDB connection failed
- ตรวจสอบ connection string ใน `.env`
- ตรวจสอบว่า password ถูกต้อง
- ตรวจสอบว่าเพิ่ม IP whitelist แล้ว (0.0.0.0/0)

### ปัญหา: Netlify Functions ไม่ทำงาน
```powershell
# ติดตั้ง dependencies ของ functions
cd netlify/functions
npm install
cd ../..

# รัน netlify dev ใหม่
netlify dev
```

### ปัญหา: Port 3000 ถูกใช้งานอยู่
```powershell
# ใช้ port อื่น
npm run dev -- --port 3001
```

## 📝 Next Steps

1. ✅ ทดสอบระบบให้ครบทุก Feature
2. ✅ Add sample data ลง MongoDB
3. ✅ Customize colors และ UI ตามที่ต้องการ
4. ✅ เพิ่ม Features เพิ่มเติม
5. ✅ Deploy to Netlify
6. ✅ Share กับเพื่อน ๆ!

## 🎉 เสร็จแล้ว!

ตอนนี้คุณมีระบบจองที่จอดรถที่:
- ✨ สวยงาม มี Animation ลื่นไหล
- 🚀 Deploy บน Netlify (ฟรี!)
- 💾 ใช้ MongoDB Atlas (ฟรี!)
- 📱 Responsive รองรับทุกหน้าจอ
- 🔐 มีระบบ Authentication
- 💳 พร้อม Payment Flow

## 🆘 Need Help?

มีปัญหาติดตรงไหน สามารถ:
1. เช็ค `README-FULLSTACK.md` สำหรับ documentation ครบ
2. เช็ค `STRUCTURE.md` สำหรับโครงสร้างโปรเจค
3. ดู Console logs (F12) เพื่อหา error
4. ดู Netlify Functions logs

Happy Coding! 🚗💨
