# Backend APIs - SciPark

## 🚀 Netlify Functions

โปรเจคนี้ใช้ Netlify Functions เป็น Serverless Backend เชื่อมกับ MongoDB Atlas

## 📋 API Endpoints

### 1. Authentication (`/auth`)
```javascript
// Login
POST /.netlify/functions/auth
{ action: 'login', email: 'user@example.com', password: 'password' }

// Register
POST /.netlify/functions/auth
{ action: 'register', name: 'User', email: 'user@example.com', password: 'password', phone: '0812345678' }

// Verify Token
POST /.netlify/functions/auth
{ action: 'verify' }
```

### 2. Parking Spots (`/parking`)
```javascript
// Get all spots
GET /.netlify/functions/parking

// Get spot by ID
GET /.netlify/functions/parking?id=SPOT_ID

// Get spots by zone
GET /.netlify/functions/parking?zone=ZONE_ID

// Get all zones
POST /.netlify/functions/parking
{ action: 'getZones' }

// Check availability
POST /.netlify/functions/parking
{ action: 'checkAvailability', spotIds: ['id1', 'id2'] }
```

### 3. Bookings (`/bookings`)
```javascript
// Create booking
POST /.netlify/functions/bookings
{ action: 'create', spotId: 'SPOT_ID', floor: 'ชั้น 1', vehicle: 'LICENSE_PLATE' }

// Get active booking
GET /.netlify/functions/bookings/active

// Get booking history
GET /.netlify/functions/bookings/history?limit=10

// Cancel booking
PUT /.netlify/functions/bookings
{ bookingId: 'BOOKING_ID', newStatus: 'cancelled' }

// Complete booking
PUT /.netlify/functions/bookings
{ bookingId: 'BOOKING_ID', newStatus: 'completed', cost: 40 }
```

### 4. Privileges (`/privileges`)
```javascript
// Get all tiers and current subscription
GET /.netlify/functions/privileges

// Subscribe to tier
POST /.netlify/functions/privileges
{ action: 'subscribe', tierId: 'diamond', paymentMethod: 'credit' }

// Redeem promo code
POST /.netlify/functions/privileges
{ action: 'redeem', code: 'SCIPARK2024' }
```

### 5. Vehicles (`/vehicles`)
```javascript
// Get all vehicles
GET /.netlify/functions/vehicles

// Create vehicle
POST /.netlify/functions/vehicles
{ licensePlate: 'กก 1234', brand: 'Toyota', model: 'Camry', color: 'ดำ' }

// Update vehicle
PUT /.netlify/functions/vehicles
{ id: 'VEHICLE_ID', licensePlate: 'กก 1234', brand: 'Toyota' }

// Delete vehicle
DELETE /.netlify/functions/vehicles?id=VEHICLE_ID
```

### 6. Users (`/users`)
```javascript
// Get profile
GET /.netlify/functions/users

// Update profile
PUT /.netlify/functions/users
{ name: 'New Name', email: 'new@example.com', phone: '0812345678' }

// Change password
POST /.netlify/functions/users
{ action: 'changePassword', currentPassword: 'old', newPassword: 'new', confirmPassword: 'new' }

// Get booking history
POST /.netlify/functions/users
{ action: 'getBookingHistory', limit: 20 }
```

## 🗄️ Database Collections

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  rank: 'Iron' | 'Diamond' | 'Predator',
  points: Number,
  subscriptionExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### parking_zones
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  building: String,
  totalSpots: Number,
  createdAt: Date
}
```

### parking_spots
```javascript
{
  _id: ObjectId,
  name: String,
  zoneId: String,
  zoneName: String,
  floor: String,
  building: String,
  status: 'available' | 'occupied' | 'reserved',
  pricePerHour: Number,
  facilities: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### bookings
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  spotId: ObjectId,
  floor: String,
  vehicle: String,
  status: 'active' | 'completed' | 'cancelled',
  startTime: Date,
  endTime: Date,
  cost: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### vehicles
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  licensePlate: String,
  brand: String,
  model: String,
  color: String,
  createdAt: Date,
  updatedAt: Date
}
```

### subscriptions
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  tier: 'diamond' | 'predator',
  tierName: String,
  price: Number,
  paymentMethod: String,
  promoCode: String (optional),
  status: 'active' | 'cancelled' | 'expired',
  startedAt: Date,
  expiresAt: Date,
  createdAt: Date
}
```

### promo_codes
```javascript
{
  _id: ObjectId,
  code: String (unique),
  type: 'subscription' | 'points',
  tier: String (for subscription),
  durationDays: Number (for subscription),
  points: Number (for points),
  maxUses: Number,
  usedCount: Number,
  usedBy: [ObjectId],
  isActive: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

## 🌱 Seed Data

รัน script เพื่อสร้างข้อมูลทดสอบ:

```bash
cd netlify/functions
npm install
npm run seed
```

ข้อมูลที่จะถูกสร้าง:
- 4 โซนจอดรถ (เคมี, ฟิสิกส์, ชีววิทยา, คณิตศาสตร์)
- 90 ที่จอดรถ (75% ว่าง, 25% ไม่ว่าง)
- 3 โค้ดโปรโมชั่น:
  - `SCIPARK2024` - Diamond 30 วัน
  - `WELCOME100` - 100 แต้ม
  - `PREDATOR30` - Predator 30 วัน

## 🔐 Authentication

ทุก API (ยกเว้น `/auth` และ `/parking` GET) ต้องใช้ JWT Token:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

Token จะถูกส่งกลับมาหลังจาก login/register สำเร็จ

## ⚙️ Environment Variables

สร้างไฟล์ `.env` ใน root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scipark

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App
NODE_ENV=development
```

## 🧪 Testing APIs

ใช้ Thunder Client, Postman หรือ curl:

```bash
# Login
curl -X POST http://localhost:8888/.netlify/functions/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"demo@scipark.com","password":"demo123"}'

# Get parking spots
curl http://localhost:8888/.netlify/functions/parking

# Create booking (with token)
curl -X POST http://localhost:8888/.netlify/functions/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action":"create","spotId":"SPOT_ID","floor":"ชั้น 1"}'
```

## 📝 Notes

- ชั่วโมงแรกจอดฟรี
- สมาชิก Diamond ได้ส่วนลด 10%
- สมาชิก Predator ได้ส่วนลด 15%
- Points = Cost ÷ 10 (1 แต้มต่อ 10 บาท)
