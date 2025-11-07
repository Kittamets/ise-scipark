# 🚀 Quick Start Guide - เริ่มต้น 10 นาที

## 📋 สิ่งที่ต้องมี

- ✅ Node.js (v18+) - [ดาวน์โหลด](https://nodejs.org)
- ✅ Git - [ดาวน์โหลด](https://git-scm.com)
- ✅ VS Code - [ดาวน์โหลด](https://code.visualstudio.com)
- ✅ บัญชี MongoDB Atlas (ฟรี) - [สมัคร](https://www.mongodb.com/cloud/atlas/register)

## ⚡ เริ่มต้นแบบเร็ว

### Step 1: ติดตั้ง Dependencies (2 นาที)

เปิด Terminal (PowerShell) ใน VS Code:

```powershell
# ติดตั้ง frontend packages
npm install

# ติดตั้ง backend packages
cd netlify/functions
npm install
cd ../..

# ติดตั้ง Netlify CLI (global)
npm install -g netlify-cli
```

### Step 2: Setup MongoDB Atlas (3 นาที)

#### 2.1 สร้าง Account & Cluster

1. ไปที่ https://www.mongodb.com/cloud/atlas/register
2. สมัครบัญชีใหม่ (ฟรี)
3. เลือก **Create a cluster**:
   - แท็บ: **Shared** (ฟรี)
   - Provider: **AWS**
   - Region: **Singapore** (ap-southeast-1)
   - Cluster Name: `scipark-cluster`
   - คลิก **Create**

#### 2.2 Create Database User

1. ไปที่ **Database Access** (เมนูซ้าย)
2. คลิก **Add New Database User**
3. กรอก:
   - Username: `scipark-admin`
   - Password: `SciPark2024!` (หรืออะไรก็ได้)
   - Database User Privileges: **Read and write to any database**
4. คลิก **Add User**

#### 2.3 Whitelist IP

1. ไปที่ **Network Access** (เมนูซ้าย)
2. คลิก **Add IP Address**
3. คลิก **Allow Access from Anywhere** (0.0.0.0/0)
4. คลิก **Confirm**

#### 2.4 Get Connection String

1. กลับไปที่ **Database** (เมนูซ้าย)
2. คลิก **Connect** ที่ cluster ของคุณ
3. เลือก **Drivers**
4. คัดลอก Connection String:
```
mongodb+srv://scipark-admin:<password>@scipark-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. **แทนที่** `<password>` ด้วยรหัสผ่านจริง (เช่น `SciPark2024!`)

### Step 3: Create .env File (1 นาที)

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```powershell
# Copy from template
Copy-Item .env.example .env
```

แก้ไข `.env` ด้วย VS Code:

```env
# ใส่ connection string ที่คัดลอกมา
MONGODB_URI=mongodb+srv://scipark-admin:SciPark2024!@scipark-cluster.xxxxx.mongodb.net/scipark?retryWrites=true&w=majority

# JWT Secret (สุ่มข้อความยาว ๆ)
JWT_SECRET=my-super-secret-key-change-this-12345678

# API URL (สำหรับ development)
VITE_API_URL=http://localhost:8888/.netlify/functions
```

### Step 4: Run Development Server (2 นาที)

เปิด **2 Terminals** ใน VS Code:

#### Terminal 1 - Frontend
```powershell
npm run dev
```

คุณจะเห็น:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### Terminal 2 - Backend
```powershell
netlify dev
```

คุณจะเห็น:
```
◈ Netlify Dev ◈
◈ Starting Netlify Dev with Vite
◈ Server now ready on http://localhost:8888
```

### Step 5: เปิดเบราว์เซอร์ (1 นาที)

1. เปิด Chrome/Edge
2. ไปที่ http://localhost:3000
3. คุณจะเห็น **Landing Page** สวย ๆ!

## 🎉 Success!

ตอนนี้คุณมี:
- ✅ Frontend running บน port 3000
- ✅ Backend API running บน port 8888
- ✅ MongoDB Atlas connected
- ✅ Ready to code!

## 🧪 ทดสอบระบบ

### Test 1: Register User

1. คลิก **"เริ่มต้นใช้งานฟรี"** หรือไปที่ http://localhost:3000/register
2. กรอกข้อมูล:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `test1234`
   - Confirm Password: `test1234`
3. คลิก **"ลงทะเบียน"**
4. ถ้าสำเร็จ จะ redirect ไปหน้า login

### Test 2: Login

1. ไปที่ http://localhost:3000/login
2. กรอก:
   - Username: `testuser`
   - Password: `test1234`
3. คลิก **"เข้าสู่ระบบ"**
4. ถ้าสำเร็จ จะเข้าสู่ Dashboard

### Test 3: Check MongoDB

1. ไปที่ MongoDB Atlas Dashboard
2. คลิก **Browse Collections**
3. คุณจะเห็น database `scipark` และ collection `users`
4. มี user ที่เพิ่งสร้างอยู่ข้างใน!

## 🐛 แก้ปัญหา

### ❌ Error: "Cannot connect to MongoDB"

```powershell
# ตรวจสอบ connection string
cat .env
# ตรวจสอบว่า <password> ถูกแทนที่แล้ว

# ตรวจสอบ IP whitelist ใน MongoDB Atlas
# ต้องมี 0.0.0.0/0 หรือ IP ของคุณ
```

### ❌ Error: "Port 3000 already in use"

```powershell
# ใช้ port อื่น
npm run dev -- --port 3001
```

### ❌ Error: "Command not found: netlify"

```powershell
# ติดตั้ง Netlify CLI ใหม่
npm install -g netlify-cli

# หรือใช้ npx
npx netlify dev
```

### ❌ Error: "Cannot find module"

```powershell
# ลบและติดตั้งใหม่
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Backend
cd netlify/functions
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
cd ../..
```

## 📱 ทดสอบ Responsive

1. เปิด DevTools (F12)
2. คลิก Toggle Device Toolbar (Ctrl+Shift+M)
3. เลือกอุปกรณ์:
   - iPhone 12 Pro
   - iPad Pro
   - Desktop 1920x1080
4. ทดสอบว่าทุกอย่างแสดงผลถูกต้อง

## 🎨 Customize Design

### เปลี่ยนสี

แก้ไข `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#3b82f6',  // Blue - เปลี่ยนเป็นสีที่ชอบ
    600: '#2563eb',
  },
  secondary: {
    500: '#a855f7',  // Purple - เปลี่ยนเป็นสีที่ชอบ
    600: '#9333ea',
  },
  accent: {
    500: '#f97316',  // Orange - เปลี่ยนเป็นสีที่ชอบ
    600: '#ea580c',
  }
}
```

บันทึกและ Vite จะ refresh อัตโนมัติ!

### เปลี่ยน Font

แก้ไข `index.html`:

```html
<!-- เพิ่ม Google Font -->
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

แก้ไข `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Kanit', 'sans-serif'],
}
```

## 📝 Next Steps

### 1. เพิ่ม Sample Data

สร้าง script เพื่อเพิ่ม parking spots:

```javascript
// scripts/seedData.js
// TODO: Create this file
```

### 2. เพิ่ม Backend APIs

สร้าง APIs ที่เหลือ:
- `bookings.js` - Booking management
- `parking.js` - Parking spots
- `privileges.js` - Membership
- `vehicles.js` - Vehicle management

### 3. Connect Frontend

เชื่อมต่อ Pages กับ APIs:
- Home page → parking API
- Booking page → booking API
- Profile → user API

### 4. Deploy to Netlify

เมื่อทุกอย่างพร้อม:

```powershell
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/scipark.git
git push -u origin main

# Deploy
netlify deploy --prod
```

## 🎓 Learning Resources

- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind: https://tailwindcss.com
- MongoDB: https://www.mongodb.com/docs
- Netlify: https://docs.netlify.com

## 🆘 Need Help?

1. อ่าน [README-FULLSTACK.md](README-FULLSTACK.md) สำหรับรายละเอียด
2. อ่าน [STRUCTURE.md](STRUCTURE.md) สำหรับโครงสร้าง
3. อ่าน [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) สำหรับสรุป
4. Check Console (F12) สำหรับ errors
5. Check Netlify Functions logs

## ✨ คุณพร้อมแล้ว!

ตอนนี้คุณมี:
- ✅ Beautiful React App
- ✅ Serverless Backend
- ✅ Cloud Database
- ✅ Complete Documentation
- ✅ Ready to Deploy!

**Happy Coding! 🚀**

---

Made with ❤️ by SciPark Team
