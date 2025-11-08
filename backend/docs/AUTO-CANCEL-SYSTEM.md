# 🔄 Auto-Cancel Bookings System

## 📋 Overview

ระบบยกเลิกการจองอัตโนมัติสำหรับการจองที่**ไม่เข้าจอดภายใน 30 นาที**

ตาม Business Requirements:
> "⏱️ **ต้องเข้าจอดภายใน 30 นาที** หลังทำการจอง  
> 🚫 ไม่เข้าจอดตามเวลา → **ระบบยกเลิกการจองอัตโนมัติ**  
> 🔓 ที่จอดจะถูกปล่อยคืนให้ผู้อื่นใช้ทันที"

---

## 🎯 Features

### ✅ สิ่งที่ระบบทำ:

1. **ตรวจสอบการจองที่หมดเวลา**
   - หาการจองที่สร้างมากกว่า 30 นาที
   - Status: `pending` หรือ `active`
   - ยังไม่มี `endTime` (ยังไม่ได้เข้าจอด)

2. **ยกเลิกการจองอัตโนมัติ**
   - เปลี่ยน status → `cancelled`
   - บันทึก `endTime`
   - Set `cost = 0` (No-show, ไม่มีค่าใช้จ่าย)

3. **ปลดล็อคที่จอด**
   - เปลี่ยน spot status → `available`
   - ที่จอดพร้อมให้ผู้อื่นจองทันที

4. **Log รายละเอียด**
   - จำนวนการจองที่ยกเลิก
   - Spot ที่ถูกปลดล็อค
   - เวลาที่ทำงาน

---

## 🚀 Usage

### 1. Manual Run (ทดสอบ)

```bash
cd backend
npm run auto-cancel
```

**Output:**
```
🔄 Starting Auto-Cancel Job...
⏰ Time: 8/11/2025 14:30:00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MongoDB Connected for Auto-Cancel Job
⚠️  Found 3 expired booking(s)
   ✓ Spot A-101 released
   ✓ Booking 673f... cancelled (No-show)
   ✓ Spot B-205 released
   ✓ Booking 674a... cancelled (No-show)
   ✓ Spot C-310 released
   ✓ Booking 675b... cancelled (No-show)
✅ Successfully cancelled 3 booking(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Result: { success: true, cancelledCount: 3, message: 'Cancelled 3 expired booking(s)' }

✅ Job completed
```

---

### 2. Cron Job (Production)

#### Option A: Node-cron (Recommended)

**Install:**
```bash
npm install node-cron
```

**Create:** `backend/jobs/cronJobs.js`
```javascript
import cron from 'node-cron';
import autoCancelExpiredBookings from '../scripts/autoCancelBookings.js';

// รันทุก 5 นาที
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Running auto-cancel job...');
  await autoCancelExpiredBookings();
});

export default cron;
```

**Add to:** `backend/index.js`
```javascript
import './jobs/cronJobs.js'; // เพิ่มบรรทัดนี้
```

---

#### Option B: Linux Crontab

**Edit crontab:**
```bash
crontab -e
```

**Add line:**
```bash
# รันทุก 5 นาที
*/5 * * * * cd /path/to/backend && npm run auto-cancel >> /var/log/auto-cancel.log 2>&1
```

---

#### Option C: PM2 (Process Manager)

**Install PM2:**
```bash
npm install -g pm2
```

**Create:** `backend/ecosystem.config.cjs`
```javascript
module.exports = {
  apps: [
    {
      name: 'scipark-api',
      script: './index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'auto-cancel-job',
      script: './scripts/autoCancelBookings.js',
      cron_restart: '*/5 * * * *', // ทุก 5 นาที
      autorestart: false,
      watch: false,
    }
  ]
};
```

**Start:**
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

#### Option D: Cloud Functions (Serverless)

**Netlify Functions:**
```javascript
// netlify/functions/auto-cancel.js
import autoCancelExpiredBookings from '../../backend/scripts/autoCancelBookings.js';

export async function handler(event, context) {
  const result = await autoCancelExpiredBookings();
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
```

**Netlify Config:**
```toml
# netlify.toml
[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/.netlify/functions/auto-cancel"
  to = "/.netlify/functions/auto-cancel"
  status = 200
```

**Trigger with External Cron:**
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Uptime Robot](https://uptimerobot.com)

Set URL: `https://your-site.netlify.app/.netlify/functions/auto-cancel`

---

## 📊 Database Changes

### Booking Status Flow:

```
pending/active (created) 
    ↓
    ├─→ [เข้าจอดภายใน 30 นาที] → active → completed ✅
    │
    └─→ [ไม่เข้าจอดภายใน 30 นาที] → cancelled (auto) ❌
```

### Fields Updated:

```javascript
// Before Auto-Cancel
{
  _id: "673f...",
  status: "active",
  startTime: "2025-11-08T13:00:00Z",
  endTime: null,
  cost: 0,
  totalCost: 0
}

// After Auto-Cancel
{
  _id: "673f...",
  status: "cancelled", // ✅ Updated
  startTime: "2025-11-08T13:00:00Z",
  endTime: "2025-11-08T13:35:00Z", // ✅ Set
  cost: 0, // ✅ No-show fee
  totalCost: 0 // ✅ No-show fee
}
```

---

## 🧪 Testing

### Test Scenario 1: สร้างการจองและรอ 30 นาที

```javascript
// 1. สร้างการจอง
POST /api/bookings
{
  "spotId": "673f...",
  "vehicleId": "674a..."
}

// 2. รอ 30+ นาที

// 3. รัน auto-cancel
npm run auto-cancel

// 4. ตรวจสอบ
GET /api/bookings/:id
// Response:
{
  "status": "cancelled",
  "endTime": "2025-11-08T13:35:00Z"
}
```

---

### Test Scenario 2: Mock เวลาสำหรับการทดสอบ

**Create:** `backend/scripts/testAutoCancel.js`

```javascript
import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import autoCancelExpiredBookings from './autoCancelBookings.js';

const testAutoCancel = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // สร้างการจองที่หมดเวลาแล้ว (31 นาทีที่แล้ว)
  const thirtyOneMinutesAgo = new Date(Date.now() - 31 * 60 * 1000);
  
  const testBooking = new Booking({
    user: "673f...", // User ID จริง
    spot: "674a...", // Spot ID จริง
    zone: "675b...", // Zone ID จริง
    startTime: thirtyOneMinutesAgo, // ✅ Mock เวลาย้อนหลัง
    status: "active"
  });

  await testBooking.save();
  console.log('✅ Test booking created:', testBooking._id);

  // รัน auto-cancel
  const result = await autoCancelExpiredBookings();
  console.log('Result:', result);

  // ตรวจสอบ
  const updated = await Booking.findById(testBooking._id);
  console.log('Updated booking:', updated);

  await mongoose.connection.close();
};

testAutoCancel();
```

**Run:**
```bash
node backend/scripts/testAutoCancel.js
```

---

## 📈 Monitoring & Logs

### 1. Add Logging Service

**Install:**
```bash
npm install winston
```

**Create:** `backend/utils/logger.js`
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/auto-cancel.log' }),
    new winston.transports.Console()
  ]
});

export default logger;
```

**Use in script:**
```javascript
import logger from '../utils/logger.js';

logger.info('Auto-cancel job started');
logger.warn(`Found ${count} expired bookings`);
logger.error('Auto-cancel failed:', error);
```

---

### 2. Dashboard Metrics

**Track:**
- จำนวนการจองที่ยกเลิกต่อวัน
- % No-show rate
- เวลาเฉลี่ยที่ผู้ใช้เข้าจอด

**Example Query:**
```javascript
// สถิติ No-show
const stats = await Booking.aggregate([
  {
    $match: {
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    }
  },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);

// Result: { _id: 'cancelled', count: 15 }
```

---

## ⚠️ Important Notes

### 1. **Transaction Safety**
- ใช้ MongoDB Transaction เพื่อความปลอดภัย
- ถ้า cancel booking ล้มเหลว จะไม่ปลดล็อค spot

### 2. **Race Condition**
- ถ้าผู้ใช้เข้าจอดพร้อมกับ auto-cancel
- Transaction จะ handle ให้อัตโนมัติ

### 3. **No-show Policy**
- การจองที่ถูกยกเลิก: `cost = 0`
- ไม่คืนค่าธรรมเนียมการจอง (20 บาท)
- สามารถปรับเป็น penalty fee ได้

### 4. **Notification**
- ควรส่ง Email/SMS แจ้งเตือนก่อนยกเลิก
- แจ้งเตือนเมื่อยกเลิกแล้ว

---

## 🎯 Recommended Schedule

| Environment | Frequency | Method |
|-------------|-----------|--------|
| **Development** | Manual | `npm run auto-cancel` |
| **Staging** | Every 10 min | Node-cron |
| **Production** | Every 5 min | PM2 + Cron |

---

## 📝 Changelog

**v1.0.0 (2025-11-08)**
- ✅ Initial release
- ✅ 30-minute auto-cancel logic
- ✅ Spot release on cancel
- ✅ Transaction support
- ✅ Logging

**Planned v1.1.0:**
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Dashboard metrics
- [ ] Penalty fees for no-shows

---

**Status:** ✅ Ready for Production  
**Last Updated:** November 8, 2025
