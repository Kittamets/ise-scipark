# 🧪 SciPark Test Cases (Updated Version)

**Date**: November 8, 2025  
**System Version**: 2.0 (Simplified - No Check-in Required)

---

## 📋 Test Case Overview

### System Changes from Original Test Cases:
- ❌ **REMOVED**: 30-minute countdown timer
- ❌ **REMOVED**: Check-in/QR scan requirement to enter parking
- ❌ **REMOVED**: Booking fee (20 THB)
- ✅ **ADDED**: First hour FREE parking
- ✅ **SIMPLIFIED**: Direct booking → parking → finish → payment flow

---

## 1️⃣ Registration Flow

### Test Case 1.1: Successful Registration
**Precondition**: Email/phone not registered, Valid authentication credentials

**Inputs**:
- Email: `newuser@test.com`
- Password: `password123`
- Name: `Test User`
- Phone: `0812345678`

**Expected Outputs**:
- ✅ Registration success message
- ✅ User redirected to login page
- ✅ Account created in database

**Post-condition**:
- Account status: ACTIVE
- User can login immediately

---

### Test Case 1.2: Duplicate Email/Phone Registration
**Precondition**: Email already exists in system

**Inputs**:
- Email: `iron@test.com` (existing user)

**Expected Outputs**:
- ❌ Error message: "อีเมลนี้ถูกใช้งานแล้ว"
- ❌ Registration blocked

**Post-condition**:
- No new account created
- User remains on registration screen

---

### Test Case 1.3: Profile Update
**Precondition**: User is logged in

**Inputs**:
- Click profile icon
- Edit name: `Updated Name`
- Edit phone: `0899999999`
- Click save

**Expected Outputs**:
- ✅ Profile updated successfully
- ✅ New data displayed

**Post-condition**:
- Changes saved to database
- Profile shows updated information

---

## 2️⃣ Vehicle Management Flow

### Test Case 2.1: Add Vehicle Information
**Precondition**: User is logged in

**Inputs**:
- License Plate: `กก 1234 กรุงเทพ`
- Brand: `Toyota`
- Model: `Camry`
- Color: `ดำ`

**Expected Outputs**:
- ✅ Vehicle added successfully
- ✅ Vehicle displayed in profile

**Post-condition**:
- Vehicle info saved in database
- Can be selected for booking

---

## 3️⃣ Parking Zone Display

### Test Case 3.1: View Available Zones
**Precondition**: User is logged in, System has active zones

**Inputs**:
- Navigate to home page

**Expected Outputs**:
- ✅ Display 5 parking zones:
  1. หน้าตึกจุฬาภรณวลัยลักษณ์ (30 ที่)
  2. ใต้ตึกพระจอมเกล้า (25 ที่)
  3. หลังคณะวิทยาศาสตร์ (35 ที่)
  4. หน้าตึกคณบดีคณะวิทยาศาสตร์ (20 ที่)
  5. หน้าคณะวิทยาศาสตร์ (30 ที่)
- ✅ Show available spots count for each zone
- ✅ Show price: 20 บาท/ชม (ชั่วโมงแรกฟรี)

**Post-condition**:
- User can select any zone with available spots

---

### Test Case 3.2: View Zone Details
**Precondition**: User selected a zone

**Inputs**:
- Click on "หน้าตึกจุฬาภรณวลัยลักษณ์"

**Expected Outputs**:
- ✅ Zone name displayed
- ✅ Building location shown
- ✅ Available spots by floor
- ✅ Facilities list
- ✅ Parking rules
- ✅ "จองที่จอด" button enabled

**Post-condition**:
- User can proceed to booking

---

## 4️⃣ Booking Flow (Simplified)

### Test Case 4.1: Successful Booking with Available Slots
**Precondition**: 
- User is logged in
- Selected zone has available slots (e.g., หน้าตึกจุฬาภรณวลัยลักษณ์ - 15 available)
- No active booking exists

**Inputs**:
1. Click "จองที่จอด" button
2. Confirm booking in modal

**Expected Outputs**:
- ✅ Booking success message: "จองสำเร็จ! 🎉"
- ✅ Navigate to Active Booking page
- ✅ Show booking details:
  - Zone name
  - Start time
  - Timer (elapsed time)
  - Cost: 0 บาท (first hour free)

**Post-condition**:
- Booking created with status "active"
- User has 1 active booking
- Can view QR code
- Can finish parking anytime

---

### Test Case 4.2: Booking with Full Zone
**Precondition**: 
- User is logged in
- Selected zone has 0 available slots

**Inputs**:
- Click on zone with 0 available slots

**Expected Outputs**:
- ❌ "จองที่จอด" button disabled
- ❌ Message: "เต็มแล้ว" badge shown

**Post-condition**:
- No booking created
- User must select different zone

---

### Test Case 4.3: Booking While Having Active Booking
**Precondition**:
- User already has 1 active booking

**Inputs**:
- Navigate to any zone
- Click "จองที่จอด"

**Expected Outputs**:
- ❌ Error toast: "คุณมีการจองอยู่แล้ว กรุณายกเลิกก่อนทำรายการใหม่"

**Post-condition**:
- No new booking created
- Existing booking remains active

---

## 5️⃣ Active Booking Management

### Test Case 5.1: View Active Booking
**Precondition**: User has active booking

**Inputs**:
- Navigate to "การจองของฉัน"

**Expected Outputs**:
- ✅ Display booking card with:
  - Zone name and slot number
  - Elapsed time (HH:MM:SS)
  - Current cost
  - Price per hour (20 บาท)
  - Note: "ชั่วโมงแรกฟรี"
- ✅ "แสดง QR Code" button
- ✅ "เสร็จสิ้นการจอด" button
- ✅ "ยกเลิกการจอง" button

**Post-condition**:
- User can perform actions on booking

---

### Test Case 5.2: View QR Code
**Precondition**: User has active booking

**Inputs**:
- Click "แสดง QR Code" button

**Expected Outputs**:
- ✅ Modal opens with QR code
- ✅ Shows booking ID
- ✅ QR code image displayed

**Post-condition**:
- QR code can be scanned by staff
- Modal can be closed

---

### Test Case 5.3: Finish Parking (Under 1 Hour - Free)
**Precondition**: 
- User has active booking
- Parking duration: 45 minutes

**Inputs**:
1. Click "เสร็จสิ้นการจอด" button
2. Modal shows: "ค่าจอดรถทั้งหมด: 0 ฿"
3. Click "เสร็จสิ้น" button

**Expected Outputs**:
- ✅ Success toast: "ขอบคุณที่ใช้บริการ! (ชั่วโมงแรกฟรี)"
- ✅ Navigate back to home page
- ✅ No payment required

**Post-condition**:
- Booking marked as "completed"
- Total cost: 0 บาท
- Slot released back to available

---

### Test Case 5.4: Finish Parking (Over 1 Hour - Paid)
**Precondition**:
- User has active booking
- Parking duration: 2 hours 30 minutes

**Inputs**:
1. Click "เสร็จสิ้นการจอด" button
2. Modal shows: "ค่าจอดรถทั้งหมด: 40 ฿"
   - Calculation: (3 hours - 1 free hour) × 20 = 40 บาท
3. Click "ไปชำระเงิน" button

**Expected Outputs**:
- ✅ Navigate to payment page
- ✅ Show total cost: 40 บาท
- ✅ Show payment methods
- ✅ Can select payment method

**Post-condition**:
- User on payment page
- Booking status: "pending_payment"

---

### Test Case 5.5: Cost Calculation Accuracy
**Precondition**: User has active booking

**Test Data & Expected Results**:

| Parking Duration | Calculation | Expected Cost |
|-----------------|-------------|---------------|
| 30 minutes | First hour free | 0 บาท |
| 59 minutes | First hour free | 0 บาท |
| 1 hour 01 minute | 2 hours × 20 - 1 free = 20 | 20 บาท |
| 2 hours | 2 hours × 20 - 1 free = 20 | 20 บาท |
| 2 hours 30 min | 3 hours × 20 - 1 free = 40 | 40 บาท |
| 5 hours | 5 hours × 20 - 1 free = 80 | 80 บาท |

**Post-condition**:
- Cost calculation matches formula
- First hour always free

---

### Test Case 5.6: Cancel Active Booking
**Precondition**: User has active booking

**Inputs**:
1. Click "ยกเลิกการจอง" button
2. Confirm cancellation in modal

**Expected Outputs**:
- ✅ Success message: "ยกเลิกการจองเรียบร้อย"
- ✅ Navigate back to home page
- ✅ Booking removed from active

**Post-condition**:
- Booking status: "cancelled"
- Slot released immediately
- No charges applied

---

## 6️⃣ Payment Flow

### Test Case 6.1: Complete Payment Successfully
**Precondition**:
- User on payment page
- Total cost displayed (e.g., 40 บาท)
- Valid payment method available

**Inputs**:
1. Select payment method (e.g., Credit Card)
2. Enter payment details
3. Click "ชำระเงิน" button

**Expected Outputs**:
- ✅ Payment processing message
- ✅ Success notification
- ✅ Receipt displayed
- ✅ Navigate to history/home

**Post-condition**:
- Payment recorded in database
- Booking status: "completed"
- Slot released

---

### Test Case 6.2: Payment Method Management
**Precondition**: User is logged in

**Inputs**:
1. Navigate to profile
2. Click "Payment Methods"
3. Add new card: `4111111111111111`
4. Save

**Expected Outputs**:
- ✅ Card added successfully
- ✅ Card displayed in list
- ✅ Can be selected for payment

**Post-condition**:
- Payment method saved
- Available for future bookings

---

## 7️⃣ Booking History

### Test Case 7.1: View Booking History
**Precondition**: User has completed bookings

**Inputs**:
- Navigate to "ประวัติการจอง"

**Expected Outputs**:
- ✅ List of past bookings
- ✅ Each showing:
  - Date and time
  - Zone name
  - Duration
  - Total cost
  - Status (completed/cancelled)

**Post-condition**:
- User can review past bookings

---

## 8️⃣ Edge Cases & Error Handling

### Test Case 8.1: Network Error During Booking
**Precondition**: Network connection lost

**Inputs**:
- Attempt to create booking

**Expected Outputs**:
- ❌ Error message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"

**Post-condition**:
- No booking created
- User can retry

---

### Test Case 8.2: Session Timeout
**Precondition**: User idle for extended period

**Inputs**:
- Try to perform action after session expires

**Expected Outputs**:
- ❌ Redirect to login page
- ❌ Message: "กรุณาเข้าสู่ระบบอีกครั้ง"

**Post-condition**:
- User must login again
- Session renewed after login

---

### Test Case 8.3: Concurrent Booking Conflict
**Precondition**: Two users try to book last available spot simultaneously

**Inputs**:
- User A clicks "จอง" for last spot
- User B clicks "จอง" for same spot at same time

**Expected Outputs**:
- ✅ First user (A) gets booking
- ❌ Second user (B) gets error: "ที่จอดถูกจองแล้ว"

**Post-condition**:
- Only one booking created
- Zone capacity accurate

---

## 📊 Test Summary Matrix

### Feature Coverage

| Feature | Test Cases | Status |
|---------|-----------|--------|
| Registration | 3 | ✅ Ready |
| Vehicle Management | 1 | ✅ Ready |
| Zone Display | 2 | ✅ Ready |
| Booking Flow | 3 | ✅ Ready |
| Active Booking | 6 | ✅ Ready |
| Payment | 2 | ✅ Ready |
| History | 1 | ✅ Ready |
| Edge Cases | 3 | ✅ Ready |
| **TOTAL** | **21** | **✅** |

---

## 🔧 Testing Tools & Methods

### 1. Manual Testing
**Tool**: Browser (Chrome/Edge)
**Scope**: All UI flows
**Duration**: 2-3 hours for full test

### 2. API Testing
**Tool**: Postman / Thunder Client
**Scope**: Backend endpoints
**Duration**: 1 hour

### 3. Automated Testing (Future)
**Framework**: Jest + React Testing Library
**Scope**: Component tests
**Status**: To be implemented

### 4. E2E Testing (Future)
**Framework**: Playwright / Cypress
**Scope**: Full user flows
**Status**: To be implemented

---

## ✅ Test Execution Checklist

- [ ] Start backend server
- [ ] Start frontend server
- [ ] Seed database with test data
- [ ] Create test accounts
- [ ] Execute all 21 test cases
- [ ] Document results
- [ ] Report bugs (if any)
- [ ] Verify fixes
- [ ] Sign off

---

## 📝 Test Results Template

```
Test Date: ___________
Tester Name: ___________
Environment: Development

Test Case ID | Status | Notes
-------------|--------|-------
1.1          | ✅ Pass | 
1.2          | ✅ Pass |
1.3          | ✅ Pass |
...          | ...    | ...

Total: ___ / 21 Passed
Bugs Found: ___
Critical Issues: ___
```

---

## 🐛 Known Issues (Fixed)

1. ✅ Check-in 401 error - FIXED (Feature removed)
2. ✅ Mock data on home page - FIXED (Real API now)
3. ✅ Old zone names - FIXED (5 new zones)
4. ✅ Missing finish modal - FIXED (Modal added)

---

## 📞 Support

For testing questions contact: Development Team
