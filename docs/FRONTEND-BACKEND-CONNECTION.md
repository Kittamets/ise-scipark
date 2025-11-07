# 🔗 การเชื่อมต่อ Frontend กับ Backend

## 📋 ภาพรวม

```
Frontend (React + Vite)          Backend (Express + MongoDB)
Port: 5173                       Port: 3000
├── HTTP Requests  ────────────> ├── API Endpoints
│   (with cookies)               │   /api/auth/*
│                                │   /api/parking/*
│                                │   /api/bookings/*
│                                │   /api/user/*
│                                │   /api/privileges/*
│                                │   /api/vehicles/*
└── Receives Response <──────────┴── Returns JSON + Set Cookies
```

---

## 🚀 วิธีเริ่มใช้งาน

### 1️⃣ เริ่ม Backend
```bash
cd backend
npm run dev
```
✅ Backend พร้อมใช้งานที่: `http://localhost:3000`

### 2️⃣ เริ่ม Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend พร้อมใช้งานที่: `http://localhost:5173`

---

## ⚙️ การตั้งค่าที่ทำแล้ว

### ✅ Frontend Configuration

**1. Environment Variables (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:3000/api
```

**2. API Client (`frontend/src/utils/api.js`)**
```javascript
// ✅ ตั้งค่า baseURL เป็น Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ✅ เปิด withCredentials เพื่อส่ง cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // สำคัญ! สำหรับ JWT cookies
})
```

### ✅ Backend Configuration

**1. Environment Variables (`backend/.env`)**
```env
CLIENT_URL=http://localhost:5173
PORT=3000
```

**2. CORS Setup (`backend/index.js`)**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,                // อนุญาตให้ส่ง cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

---

## 🔐 Authentication Flow

### การ Login
```javascript
// Frontend: src/pages/Login.jsx
const response = await api.post('/auth/login', {
  email: 'iron@test.com',
  password: 'password123'
})

// Backend จะ:
// 1. Verify credentials
// 2. Generate JWT token
// 3. Set HTTP-only cookie
// 4. Return user data

// Response:
{
  success: true,
  message: "เข้าสู่ระบบสำเร็จ",
  token: "jwt_token_here",
  user: {
    id: "...",
    name: "ทดสอบ ไอรอน",
    email: "iron@test.com",
    rank: "Iron",
    points: 50
  }
}
```

### การใช้งาน Authenticated Endpoints
```javascript
// Frontend ส่ง request (cookies ถูกส่งอัตโนมัติ)
const response = await api.get('/user/profile')

// Backend middleware จะ:
// 1. อ่าน JWT จาก cookies
// 2. Verify token
// 3. Attach userId to request
// 4. Continue to controller
```

---

## 📡 API Endpoints

### Authentication
```javascript
// Register
POST /api/auth/register
Body: { name, email, username, password, phone }

// Login
POST /api/auth/login
Body: { email, password } หรือ { username, password }

// Logout
POST /api/auth/logout
```

### Parking
```javascript
// Get all zones
GET /api/parking/zones

// Get zone details
GET /api/parking/zones/:id

// Get all spots
GET /api/parking/spots?zoneId=xxx&status=available

// Get spot details
GET /api/parking/spots/:id
```

### Bookings
```javascript
// Create booking
POST /api/bookings
Body: { spotId, vehicleId? }

// Get active booking
GET /api/bookings/active

// Complete booking
PUT /api/bookings/:id/complete

// Cancel booking
DELETE /api/bookings/:id

// Get history
GET /api/bookings/history?page=1&limit=10
```

### User Profile
```javascript
// Get profile
GET /api/user/profile

// Update profile
PUT /api/user/profile
Body: { name, phone }

// Change password
PUT /api/user/change-password
Body: { currentPassword, newPassword }

// Get statistics
GET /api/user/stats
```

### Privileges
```javascript
// Get membership tiers
GET /api/privileges

// Subscribe to tier
POST /api/privileges/subscribe
Body: { tier: "diamond" | "predator", paymentMethod: "credit_card" }

// Redeem promo code
POST /api/privileges/redeem
Body: { code: "SCIPARK2024" }
```

### Vehicles
```javascript
// Add vehicle
POST /api/vehicles
Body: { licensePlate, brand, model }

// Get all vehicles
GET /api/vehicles

// Delete vehicle
DELETE /api/vehicles/:id
```

---

## 🧪 ทดสอบการเชื่อมต่อ

### 1. Test Backend Health
```bash
curl http://localhost:3000
# Response: "APIs is currently running..."
```

### 2. Test CORS
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/parking/zones -v
```

### 3. Test API Endpoint
```bash
# Get parking zones
curl http://localhost:3000/api/parking/zones
```

### 4. Test Login from Frontend
1. เปิด `http://localhost:5173/login`
2. Login ด้วย: `iron@test.com` / `password123`
3. ตรวจสอบ Developer Tools → Network → Request Headers
4. ควรเห็น `Cookie: token=...`

---

## 🔍 Debug การเชื่อมต่อ

### Frontend (Browser DevTools)

**1. Network Tab**
```
Request URL: http://localhost:3000/api/auth/login
Request Method: POST
Status Code: 200 OK

Request Headers:
  Content-Type: application/json
  Origin: http://localhost:5173

Response Headers:
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Credentials: true
  Set-Cookie: token=...; HttpOnly
```

**2. Console Tab**
```javascript
// ดูค่า API URL
console.log(import.meta.env.VITE_API_URL)
// Output: http://localhost:3000/api
```

**3. Application Tab → Cookies**
```
Name: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HttpOnly: ✓
Secure: - (development)
SameSite: Strict
```

### Backend (Terminal)

**1. Request Logging**
```bash
# ดู request ที่เข้ามา (morgan middleware)
POST /api/auth/login 200 150ms
GET /api/user/profile 200 50ms
GET /api/parking/zones 200 30ms
```

**2. MongoDB Connection**
```bash
# ตอน start server ควรเห็น:
MongoDB Connected: ac-tsvmovo-shard-00-01.qxi98tc.mongodb.net
Server is running on port 3000
```

---

## ❌ Common Issues & Solutions

### Issue 1: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
```javascript
// ตรวจสอบ backend/.env
CLIENT_URL=http://localhost:5173  // ✅ ถูกต้อง

// ตรวจสอบ backend/index.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true  // ต้องมี!
}))

// ตรวจสอบ frontend/src/utils/api.js
const api = axios.create({
  withCredentials: true  // ต้องมี!
})
```

### Issue 2: Cookie ไม่ถูกส่ง
```
401 Unauthorized - No token provided
```

**Solution:**
```javascript
// ตรวจสอบ axios config
axios.defaults.withCredentials = true

// หรือในแต่ละ request
api.post('/endpoint', data, { withCredentials: true })

// ตรวจสอบว่า backend set cookie ถูกต้อง
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'strict'
})
```

### Issue 3: API URL ไม่ถูกต้อง
```
Network Error / ERR_CONNECTION_REFUSED
```

**Solution:**
```bash
# ตรวจสอบ .env
cat frontend/.env
# VITE_API_URL=http://localhost:3000/api ✅

# Restart Vite dev server (สำคัญ!)
cd frontend
npm run dev
```

### Issue 4: Backend ไม่ทำงาน
```
GET http://localhost:3000/api/... net::ERR_CONNECTION_REFUSED
```

**Solution:**
```bash
# ตรวจสอบว่า backend รันอยู่หรือไม่
cd backend
npm run dev

# ตรวจสอบ port
netstat -ano | findstr :3000

# ตรวจสอบ MongoDB connection
# ต้องเห็น "MongoDB Connected" ใน terminal
```

---

## 🔄 Request Flow Example

### User Login Flow

```
┌─────────────┐                           ┌─────────────┐
│   Browser   │                           │   Backend   │
│ (Frontend)  │                           │   Server    │
└─────────────┘                           └─────────────┘
      │                                           │
      │ 1. POST /api/auth/login                  │
      │    { email, password }                   │
      ├──────────────────────────────────────────>│
      │                                           │
      │                                           │ 2. Verify credentials
      │                                           │    Generate JWT token
      │                                           │
      │ 3. Response + Set-Cookie                 │
      │    { user, token }                       │
      │<──────────────────────────────────────────┤
      │    Set-Cookie: token=xxx; HttpOnly       │
      │                                           │
      │ 4. GET /api/user/profile                 │
      │    Cookie: token=xxx                     │
      ├──────────────────────────────────────────>│
      │                                           │
      │                                           │ 5. Verify token
      │                                           │    Get user data
      │                                           │
      │ 6. Response                               │
      │    { user: {...}, stats: {...} }         │
      │<──────────────────────────────────────────┤
      │                                           │
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "สำเร็จ",
  "data": { ... },
  "token": "..." (optional)
}
```

### Error Response
```json
{
  "success": false,
  "message": "เกิดข้อผิดพลาด",
  "error": "Error details"
}
```

---

## 🚀 Production Deployment

### Frontend (Netlify)
```bash
# Build
cd frontend
npm run build

# Environment Variables
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway)
```bash
# Environment Variables
CLIENT_URL=https://your-frontend.netlify.app
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=production
```

---

## ✅ Checklist

การตั้งค่าครบถ้วน:

- [x] Backend `.env` มี `CLIENT_URL=http://localhost:5173`
- [x] Backend CORS config ตั้ง `origin` และ `credentials: true`
- [x] Frontend `.env` มี `VITE_API_URL=http://localhost:3000/api`
- [x] Frontend axios config มี `withCredentials: true`
- [x] Backend รันอยู่ที่ port 3000
- [x] Frontend รันอยู่ที่ port 5173
- [x] MongoDB เชื่อมต่อสำเร็จ
- [x] Test login ได้
- [x] Cookies ถูกส่งใน requests

---

**🎉 ระบบพร้อมใช้งาน! Frontend และ Backend เชื่อมต่อกันแล้ว**
