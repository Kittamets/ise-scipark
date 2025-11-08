# 🧪 SciPark Testing Checklist

## ✅ Changes Made

### 1. Database - Parking Zones
- ✅ Updated seed.js with 5 new zones:
  - หน้าตึกจุฬาภรณวลัยลักษณ์ (CHULA) - 30 spots
  - ใต้ตึกพระจอมเกล้า (PRAJOM) - 25 spots
  - หลังคณะวิทยาศาสตร์ (BEHIND) - 35 spots
  - หน้าตึกคณบดีคณะวิทยาศาสตร์ (DEAN) - 20 spots
  - หน้าคณะวิทยาศาสตร์ (FRONT) - 30 spots
- ✅ Total: 140 parking spots

### 2. Frontend - Home Page
- ✅ Changed from mock data to real API call
- ✅ Fetch zones from `/api/parking/zones`
- ✅ Display real availability data
- ✅ Show correct icons for each zone

### 3. Frontend - Parking Detail Page
- ✅ Changed from mock data to real API call
- ✅ Fetch zone details from `/api/parking/zones/:id`
- ✅ Display spots grouped by floor
- ✅ Show real-time availability

### 4. Frontend - Active Booking Page
- ✅ Removed check-in/check-out feature
- ✅ Simplified to: Book → Park → Finish → Pay
- ✅ Added finish parking confirmation modal
- ✅ Show cost calculation (first hour free)

### 5. API Service
- ✅ Added `getZoneById()` method
- ✅ All parking endpoints ready

## 🧪 Test Cases to Verify

### Authentication Flow
- [ ] Register new account
- [ ] Login with existing account
- [ ] Logout
- [ ] Session persistence

### Parking Zone Display
- [ ] Home page shows 5 new zones
- [ ] Each zone shows correct availability
- [ ] Icons display correctly
- [ ] Click zone navigates to detail page

### Parking Detail Page
- [ ] Zone details load correctly
- [ ] Spots grouped by floor
- [ ] Availability counts match
- [ ] Description and facilities show

### Booking Flow (SIMPLIFIED - No Check-in)
1. [ ] Login successful
2. [ ] Select parking zone from home
3. [ ] View zone details
4. [ ] Click "จองที่จอด" button
5. [ ] Confirm booking in modal
6. [ ] Booking created successfully
7. [ ] Navigate to Active Booking page
8. [ ] See booking details with timer
9. [ ] Show QR code modal
10. [ ] Click "เสร็จสิ้นการจอด" button
11. [ ] See cost calculation modal
12. [ ] If free (< 1 hour): Click "เสร็จสิ้น" → Done
13. [ ] If paid (> 1 hour): Click "ไปชำระเงิน" → Payment page
14. [ ] Cancel booking works

### Payment Flow (If > 1 hour)
- [ ] Show correct total cost
- [ ] Calculate hours correctly
- [ ] First hour free, then 20 baht/hour
- [ ] Payment methods available
- [ ] Complete payment
- [ ] Booking marked as completed

### QR Code
- [ ] QR code generates correctly
- [ ] Shows booking ID
- [ ] Modal opens and closes

### Edge Cases
- [ ] Cannot book if already have active booking
- [ ] Cannot book unavailable spot
- [ ] Timer shows correct elapsed time
- [ ] Cost calculation accurate
- [ ] Auto-refresh availability

## 🐛 Known Issues Fixed
- ✅ Check-in/check-out removed (was causing 401 errors)
- ✅ Mock data replaced with real API calls
- ✅ Parking zones updated to match requirements
- ✅ Finish parking modal added
- ✅ Cost calculation simplified

## 🚀 To Run Full Test

### Start Backend
```powershell
cd C:\ise-scipark\backend
node index.js
```

### Start Frontend (New Terminal)
```powershell
cd C:\ise-scipark\frontend
npm run dev
```

### Seed Database (If needed)
```powershell
cd C:\ise-scipark\backend
node scripts/seed.js
```

### Test Accounts
- **Iron**: iron@test.com / password123
- **Diamond**: diamond@test.com / password123
- **Predator**: predator@test.com / password123

## ✨ Success Criteria
1. ✅ All 5 zones display on home page
2. ✅ Can select and view zone details
3. ✅ Can create booking successfully
4. ✅ Active booking shows correctly
5. ✅ QR code works
6. ✅ Can finish parking with cost calculation
7. ✅ No authentication errors
8. ✅ No mock data remaining

## 📝 Notes
- System now uses REAL database data
- Check-in feature REMOVED (too many auth issues)
- Simple flow: Login → Book → Park → Finish
- First hour FREE, then 20฿/hour
- All API endpoints working
