# 🧪 SciPark API Testing Script
# Postman Collection / Thunder Client

## Environment Variables
BASE_URL = http://localhost:3000/api
AUTH_TOKEN = (will be set after login)

---

## 1️⃣ Authentication Tests

### 1.1 Register New User
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "phone": "0812345678"
}

Expected: 201 Created
Response: {
  "success": true,
  "message": "ลงทะเบียนสำเร็จ"
}
```

### 1.2 Register Duplicate Email
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "name": "Test User 2",
  "email": "iron@test.com",
  "password": "password123",
  "phone": "0899999999"
}

Expected: 400 Bad Request
Response: {
  "success": false,
  "message": "อีเมลนี้ถูกใช้งานแล้ว"
}
```

### 1.3 Login Success
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "iron@test.com",
  "password": "password123"
}

Expected: 200 OK
Response: {
  "success": true,
  "user": {
    "name": "ทดสอบ ไอรอน",
    "email": "iron@test.com",
    "rank": "Iron"
  }
}

Note: Save cookie "token" for subsequent requests
```

### 1.4 Login Invalid Credentials
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "iron@test.com",
  "password": "wrongpassword"
}

Expected: 401 Unauthorized
Response: {
  "success": false,
  "message": "รหัสผ่านไม่ถูกต้อง"
}
```

---

## 2️⃣ Parking Zone Tests

### 2.1 Get All Zones
```http
GET {{BASE_URL}}/parking/zones

Expected: 200 OK
Response: {
  "success": true,
  "count": 5,
  "zones": [
    {
      "id": "...",
      "zoneName": "CHULA",
      "name": "หน้าตึกจุฬาภรณวลัยลักษณ์",
      "description": "...",
      "building": "ตึกจุฬาภรณวลัยลักษณ์",
      "totalSpots": 30,
      "availableSpots": 25,
      "occupiedSpots": 5,
      "hourlyRate": 20
    },
    ...
  ]
}

Verify:
✅ Returns 5 zones
✅ Each zone has correct structure
✅ availableSpots + occupiedSpots = totalSpots
```

### 2.2 Get Zone By ID
```http
GET {{BASE_URL}}/parking/zones/{{ZONE_ID}}

Expected: 200 OK
Response: {
  "success": true,
  "zone": {
    "id": "...",
    "zoneName": "CHULA",
    "name": "หน้าตึกจุฬาภรณวลัยลักษณ์",
    "totalSpots": 30,
    "availableSpots": 25,
    "hourlyRate": 20
  },
  "spots": [
    {
      "id": "...",
      "spotNumber": "C01",
      "name": "C01",
      "floor": "ชั้น 1",
      "status": "available",
      "pricePerHour": 20
    },
    ...
  ]
}

Verify:
✅ Returns zone details
✅ Returns all spots in zone
✅ Spots grouped by floor
```

### 2.3 Get Invalid Zone ID
```http
GET {{BASE_URL}}/parking/zones/invalid_id_123

Expected: 404 Not Found
Response: {
  "success": false,
  "message": "ไม่พบโซนจอดรถ"
}
```

---

## 3️⃣ Booking Tests

### 3.1 Create Booking (Success)
```http
POST {{BASE_URL}}/bookings
Content-Type: application/json
Cookie: token={{AUTH_TOKEN}}

{
  "zoneId": "{{ZONE_ID}}",
  "spotId": "{{SPOT_ID}}",
  "vehicleId": "{{VEHICLE_ID}}"
}

Expected: 201 Created
Response: {
  "success": true,
  "message": "จองสำเร็จ",
  "booking": {
    "id": "...",
    "zoneId": "...",
    "spotId": "...",
    "spotNumber": "C01",
    "startTime": "2025-11-08T10:00:00.000Z",
    "status": "active",
    "qrCode": {
      "qrCodeURL": "..."
    }
  }
}

Verify:
✅ Booking created with status "active"
✅ QR code generated
✅ Start time is current time
```

### 3.2 Create Booking (Duplicate Active)
```http
POST {{BASE_URL}}/bookings
Content-Type: application/json
Cookie: token={{AUTH_TOKEN}}

{
  "zoneId": "{{ZONE_ID}}",
  "spotId": "{{SPOT_ID_2}}"
}

Expected: 400 Bad Request
Response: {
  "success": false,
  "message": "คุณมีการจองที่กำลังใช้งานอยู่"
}

Verify:
✅ Cannot create second active booking
```

### 3.3 Get Active Booking
```http
GET {{BASE_URL}}/bookings/active
Cookie: token={{AUTH_TOKEN}}

Expected: 200 OK
Response: {
  "success": true,
  "booking": {
    "id": "...",
    "spotNumber": "C01",
    "zoneName": "หน้าตึกจุฬาภรณวลัยลักษณ์",
    "startTime": "2025-11-08T10:00:00.000Z",
    "status": "active",
    "price": 20
  }
}

Verify:
✅ Returns current active booking
✅ All required fields present
```

### 3.4 Cancel Booking
```http
PUT {{BASE_URL}}/bookings/{{BOOKING_ID}}/cancel
Cookie: token={{AUTH_TOKEN}}

Expected: 200 OK
Response: {
  "success": true,
  "message": "ยกเลิกการจองเรียบร้อย"
}

Verify:
✅ Booking status updated to "cancelled"
✅ Spot released back to available
```

---

## 4️⃣ Parking Spot Tests

### 4.1 Get All Spots
```http
GET {{BASE_URL}}/parking/spots

Expected: 200 OK
Response: {
  "success": true,
  "count": 140,
  "spots": [...]
}

Verify:
✅ Returns 140 total spots
✅ Each spot has zone information
```

### 4.2 Get Available Spots Only
```http
GET {{BASE_URL}}/parking/spots?status=available

Expected: 200 OK
Response: {
  "success": true,
  "spots": [
    {
      "status": "available",
      ...
    }
  ]
}

Verify:
✅ All returned spots have status "available"
```

---

## 5️⃣ Vehicle Tests

### 5.1 Add Vehicle
```http
POST {{BASE_URL}}/vehicles
Content-Type: application/json
Cookie: token={{AUTH_TOKEN}}

{
  "licensePlate": "กก 1234 กรุงเทพ",
  "brand": "Toyota",
  "model": "Camry",
  "color": "ดำ"
}

Expected: 201 Created
Response: {
  "success": true,
  "vehicle": {
    "id": "...",
    "licensePlate": "กก 1234 กรุงเทพ",
    "brand": "Toyota"
  }
}
```

### 5.2 Get User Vehicles
```http
GET {{BASE_URL}}/vehicles
Cookie: token={{AUTH_TOKEN}}

Expected: 200 OK
Response: {
  "success": true,
  "vehicles": [...]
}
```

---

## 6️⃣ Payment Tests

### 6.1 Add Payment Method
```http
POST {{BASE_URL}}/payment-methods
Content-Type: application/json
Cookie: token={{AUTH_TOKEN}}

{
  "type": "credit_card",
  "cardNumber": "4111111111111111",
  "cardName": "TEST USER",
  "expiryDate": "12/25",
  "cvv": "123"
}

Expected: 201 Created
```

### 6.2 Process Payment
```http
POST {{BASE_URL}}/payments
Content-Type: application/json
Cookie: token={{AUTH_TOKEN}}

{
  "bookingId": "{{BOOKING_ID}}",
  "amount": 40,
  "paymentMethodId": "{{PAYMENT_METHOD_ID}}"
}

Expected: 200 OK
Response: {
  "success": true,
  "message": "ชำระเงินสำเร็จ",
  "receipt": {
    "amount": 40,
    "date": "..."
  }
}
```

---

## 7️⃣ Booking History Tests

### 7.1 Get Booking History
```http
GET {{BASE_URL}}/bookings/history?limit=10
Cookie: token={{AUTH_TOKEN}}

Expected: 200 OK
Response: {
  "success": true,
  "bookings": [
    {
      "id": "...",
      "zoneName": "...",
      "date": "...",
      "duration": "2 hours",
      "cost": 20,
      "status": "completed"
    }
  ]
}
```

---

## 🔄 Test Flow Sequence

### Complete Booking Flow
```
1. POST /auth/login
   → Get auth token

2. GET /parking/zones
   → Get available zones

3. GET /parking/zones/{id}
   → Get zone details and spots

4. POST /bookings
   → Create booking
   → Save booking ID

5. GET /bookings/active
   → Verify active booking

6. Wait 10 seconds (simulate parking)

7. PUT /bookings/{id}/complete
   → Finish parking
   → Get cost calculation

8. POST /payments
   → Process payment (if cost > 0)

9. GET /bookings/history
   → Verify booking in history

10. GET /parking/zones/{id}
    → Verify spot released
```

---

## ✅ API Test Results Template

```
Test Date: ___________
API Version: 2.0
Environment: http://localhost:3000

Category           | Tests | Pass | Fail | Notes
-------------------|-------|------|------|-------
Authentication     | 4     |      |      |
Parking Zones      | 3     |      |      |
Bookings           | 4     |      |      |
Parking Spots      | 2     |      |      |
Vehicles           | 2     |      |      |
Payments           | 2     |      |      |
History            | 1     |      |      |
-------------------|-------|------|------|-------
TOTAL              | 18    |      |      |

Issues Found:
1. ___________
2. ___________
```

---

## 🚀 Quick Test Command

```bash
# Using curl for quick test
curl -X GET http://localhost:3000/api/parking/zones

# Expected: JSON with 5 zones

# Login and get cookie
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"iron@test.com","password":"password123"}' \
  -c cookies.txt

# Use cookie for authenticated request
curl -X GET http://localhost:3000/api/bookings/active \
  -b cookies.txt
```
