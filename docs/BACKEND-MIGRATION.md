# 🔄 Backend Migration Guide

## Overview
This document explains the migration from Netlify Functions to Express.js backend for the SciPark parking system.

## Why Express.js?

The existing Express.js backend provides superior features:

- ✅ **Email Verification**: Nodemailer + Brevo SMTP integration
- ✅ **OTP System**: Secure one-time password authentication
- ✅ **Advanced Security**: Helmet, rate limiting, XSS protection, NoSQL injection prevention
- ✅ **Proper MVC Architecture**: Clean separation of concerns
- ✅ **Production Ready**: Environment-based configuration
- ✅ **Better Scalability**: Easy to deploy on Railway, Render, or any Node.js hosting

---

## 📋 What's Been Updated

### ✅ Phase 1: Models & Schema Updates (COMPLETED)

#### 1. User Model (`userModel.js`)
**New Fields:**
- `name`: Full name
- `email`: Email address (unique, indexed)
- `phone`: Phone number (10 digits)
- `rank`: Membership tier (Iron/Diamond/Predator)
- `points`: Reward points system
- `subscriptionExpiry`: Premium membership expiry date

**Purpose:** Support membership tiers, rewards, and user profiles

---

#### 2. ParkingSpot Model (`parkingSpotModel.js`)
**New Fields:**
- `name`: Human-readable spot name
- `zoneName`: Reference zone name
- `floor`: Floor location (ชั้น 1, ชั้น 2, etc.)
- `building`: Building name
- `pricePerHour`: Hourly rate for this specific spot
- `facilities`: Array of amenities (CCTV, ร่มเงา, etc.)

**Purpose:** Rich spot information for better UX

---

#### 3. ParkingZone Model (`parkingZoneModel.js`)
**New Fields:**
- `name`: Thai display name (โซนเคมี, โซนฟิสิกส์)
- `description`: Zone description
- `building`: Building location

**Purpose:** Better zone identification and localization

---

#### 4. Booking Model (`bookingModel.js`)
**Updated Fields:**
- `vehicle`: Now optional (default: null)
- `zone`: Now optional (default: null)
- `floor`: Added floor information
- `cost`: Final calculated cost
- `status`: Default changed to "active"

**Purpose:** Flexible booking (with/without vehicle registration)

---

#### 5. NEW: Subscription Model (`subscriptionModel.js`)
**Purpose:** Track Diamond/Predator paid memberships

**Fields:**
- `user`: Reference to User
- `tier`: "Diamond" or "Predator"
- `tierName`: Thai display name
- `price`: Subscription price
- `paymentMethod`: "credit_card", "promptpay", "qr_code"
- `status`: "active", "expired", "cancelled"
- `startedAt`: Subscription start date
- `expiresAt`: Subscription expiry date

**Features:**
- Automatic expiry tracking
- Payment history
- Upgrade/downgrade tracking

---

#### 6. NEW: PromoCode Model (`promoCodeModel.js`)
**Purpose:** Promo code redemption system

**Fields:**
- `code`: Unique promo code (e.g., "SCIPARK2024")
- `type`: "subscription", "points", or "discount"
- `tier`: For subscription codes (Diamond/Predator)
- `durationDays`: Subscription duration
- `points`: Points to award
- `discountPercent`: Discount percentage
- `maxUses`: Maximum redemption limit
- `usedBy`: Array of users who redeemed
- `expiresAt`: Code expiry date

**Features:**
- Three types: subscription upgrade, points reward, discount
- Usage tracking and limits
- Expiry management

---

### ✅ Phase 2: Controllers Update (COMPLETED)

#### 1. Auth Controller (`authController.js`)
**Updated Functions:**

**`register()`:**
- Now accepts: name, email, username, password, phone
- Creates user with rank="Iron", points=0
- JWT token with 7-day expiry
- Thai language responses
- Returns full user object

**`login()`:**
- Accepts email OR username
- Returns token + full user object
- Thai language responses
- 7-day JWT expiry

**`logout()`:**
- Thai language response
- Proper cookie clearing

---

#### 2. NEW: Privileges Controller (`privilegesController.js`)
**Purpose:** Membership tier management

**Functions:**

**`getTiers()`:**
Returns 3 membership tiers with features:
- **Iron (ฟรี)**: 2 แต้ม/ชั่วโมง, 1 ชม.แรกฟรี
- **Diamond (199฿/เดือน)**: 5 แต้ม/ชั่วโมง, ส่วนลด 10%, 1 ชม.แรกฟรี
- **Predator (499฿/เดือน)**: 10 แต้ม/ชั่วโมง, ส่วนลด 20%, 1 ชม.แรกฟรี, จองล่วงหน้า

**`subscribe()`:**
- Upgrade to Diamond/Predator
- Process payment (mocked)
- Create Subscription record
- Update user rank and expiry
- Award bonus points

**`redeemCode()`:**
- Validate promo code
- Check usage limits and expiry
- Apply benefits:
  - Subscription: Upgrade tier + extend expiry
  - Points: Add points to user
  - Discount: Apply discount (future booking)
- Track usage

---

#### 3. NEW: User Controller (`userController.js`)
**Purpose:** User profile and statistics

**Functions:**

**`getProfile()`:**
- Get user profile with statistics
- Calculate: totalBookings, completedBookings, totalSpent, totalSavings
- Show subscription status

**`updateProfile()`:**
- Update name and phone
- Validate phone format (10 digits)
- Thai language responses

**`changePassword()`:**
- Verify current password
- Validate new password (min 8 chars)
- Hash and save new password

**`getBookingHistory()`:**
- Paginated booking history
- Filter by status
- Include spot and vehicle details
- Calculate duration for each booking

**`getUserStats()`:**
- Comprehensive user statistics
- Total/active/completed bookings
- Total spent and savings by rank
- Favorite parking zone
- Subscription status

---

#### 4. NEW: Enhanced Booking Controller (`bookingControllerNew.js`)
**Purpose:** Complete booking lifecycle management

**Functions:**

**`createBooking()`:**
- Create booking with or without vehicle
- Check for existing active booking
- Transaction-based (atomic operation)
- Update spot status to "occupied"
- Return booking details with pricing

**`getActiveBooking()`:**
- Get user's current active booking
- Calculate real-time duration
- Calculate estimated cost with rank discount
- Show first-hour-free logic
- Display spot facilities and location

**`completeBooking()`:**
- End active booking
- Calculate final cost:
  - First hour free
  - Rank-based discount (10% Diamond, 20% Predator)
- Award points based on rank:
  - Iron: 2 points/hour
  - Diamond: 5 points/hour
  - Predator: 10 points/hour
- Free up parking spot
- Transaction-based

**`cancelBooking()`:**
- Cancel active booking
- Update status to "cancelled"
- Free up parking spot
- Transaction-based

**`getBookingHistory()`:**
- Paginated history
- Filter by status
- Include spot and zone details
- Calculate duration for each booking

---

#### 5. NEW: Enhanced Parking Controller (`parkingControllerNew.js`)
**Purpose:** Parking zone and spot management

**Functions:**

**`getAllZones()`:**
- Get all parking zones
- Calculate real-time availability for each zone
- Show occupancy rate
- Include spot counts (total, available, occupied)

**`getZoneById()`:**
- Get zone details
- List all spots in zone
- Calculate zone statistics
- Show spot facilities

**`getAllSpots()`:**
- Get all parking spots
- Filter by: zone, status, floor, building
- Include zone information
- Show facilities and pricing

**`getSpotById()`:**
- Get detailed spot information
- Include full zone details
- Show facilities and status
- Display pricing

**`updateSpotStatus()`:**
- Admin function to update spot status
- Validate status values
- Thai language responses

**`getParkingStats()`:**
- System-wide parking statistics
- Total zones and spots
- Overall occupancy rate
- Available/occupied/reserved counts

---

### ✅ Phase 3: Routes Update (COMPLETED)

#### 1. Auth Routes (`authRoute.js`)
Already exists, compatible with updated controller

#### 2. NEW: User Routes (`userRoutes.js`)
```
GET    /api/user/profile         - Get user profile
PUT    /api/user/profile         - Update profile
PUT    /api/user/change-password - Change password
GET    /api/user/bookings        - Get booking history
GET    /api/user/stats           - Get user statistics
```

#### 3. NEW: Privileges Routes (`privilegesRoute.js`)
```
GET    /api/privileges           - Get membership tiers
POST   /api/privileges/subscribe - Subscribe to tier
POST   /api/privileges/redeem    - Redeem promo code
```

#### 4. NEW: Booking Routes (`bookingRoutesNew.js`)
```
POST   /api/bookings             - Create booking
GET    /api/bookings/active      - Get active booking
GET    /api/bookings/history     - Get booking history
PUT    /api/bookings/:id/complete - Complete booking
DELETE /api/bookings/:id         - Cancel booking
PUT    /api/bookings/update      - Update booking status (legacy)
```

#### 5. NEW: Parking Routes (`parkingRouteNew.js`)
```
GET    /api/parking/zones        - Get all zones
GET    /api/parking/zones/:id    - Get zone details
GET    /api/parking/spots        - Get all spots
GET    /api/parking/spots/:id    - Get spot details
GET    /api/parking/stats        - Get parking statistics
PUT    /api/parking/spots/:id/status - Update spot status
```

#### 6. Vehicle Routes (`vehicleRoutes.js`)
Already exists and compatible

---

### ✅ Phase 4: Server Configuration (COMPLETED)

Updated `index.js`:
- Imported userRouter and registered route
- All routes properly registered:
  - `/api/auth` → Authentication
  - `/api/user` → User profile
  - `/api/vehicles` → Vehicle management
  - `/api/bookings` → Booking management
  - `/api/parking` → Parking zones/spots
  - `/api/privileges` → Membership tiers

---

## 🌱 Database Seeding

Created comprehensive seed script (`backend/scripts/seed.js`):

**What it seeds:**
- ✅ 4 Parking Zones (เคมี, ฟิสิกส์, ชีววิทยา, คณิตศาสตร์)
- ✅ 90 Parking Spots (realistic distribution)
- ✅ 5 Promo Codes (subscription, points, discount types)
- ✅ 3 Test Users (Iron, Diamond, Predator)

**Run seed:**
```bash
cd backend
node scripts/seed.js
```

---

## 🔐 Environment Variables

Required in `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://admin:1234@ise.qxi98tc.mongodb.net/scipark?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_here

# Email (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=972cc2001@smtp-brevo.com
EMAIL_PASS=your_brevo_api_key_here
EMAIL_FROM=noreply@scipark.com

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Running the Backend

### Development:
```bash
cd backend
npm install
node scripts/seed.js  # Seed database first time
npm run dev           # Start with nodemon
```

### Production:
```bash
npm start
```

### Test Endpoints:
```bash
# Health check
curl http://localhost:3000

# Get parking zones
curl http://localhost:3000/api/parking/zones

# Get membership tiers
curl http://localhost:3000/api/privileges
```

---

## 📱 Frontend Integration

### Update API Base URL

In `frontend/src/utils/api.js` (or wherever you configure axios):

```javascript
// Change from:
const API_BASE_URL = '/.netlify/functions'

// To:
const API_BASE_URL = 'http://localhost:3000/api'
```

### Update Authentication

Express uses HTTP-only cookies for JWT tokens. Update your auth logic:

```javascript
// Login
const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials, {
    withCredentials: true // Important for cookies
  });
  
  // Save user data to state
  const { user, token } = response.data;
  // ...
};

// All authenticated requests
axios.defaults.withCredentials = true;
```

---

## 🧪 Testing Checklist

### Auth Flow:
- [ ] Register new user
- [ ] Login with email
- [ ] Login with username
- [ ] Logout
- [ ] Change password

### Booking Flow:
- [ ] View available parking zones
- [ ] View spots in a zone
- [ ] Create booking
- [ ] View active booking
- [ ] Complete booking (calculate cost, award points)
- [ ] Cancel booking
- [ ] View booking history

### Privileges:
- [ ] View membership tiers
- [ ] Subscribe to Diamond
- [ ] Subscribe to Predator
- [ ] Redeem promo code (subscription)
- [ ] Redeem promo code (points)

### Profile:
- [ ] View profile with statistics
- [ ] Update profile
- [ ] View booking history
- [ ] View user statistics

---

## 🔄 Migration Status

| Component | Status | Notes |
|-----------|--------|-------|
| User Model | ✅ Complete | Added rank, points, subscription |
| ParkingSpot Model | ✅ Complete | Added facilities, pricing |
| ParkingZone Model | ✅ Complete | Added descriptions |
| Booking Model | ✅ Complete | Made vehicle optional, added cost |
| Subscription Model | ✅ Complete | New model for memberships |
| PromoCode Model | ✅ Complete | New model for promo codes |
| Auth Controller | ✅ Complete | Updated register, login, logout |
| Privileges Controller | ✅ Complete | New controller with 3 functions |
| User Controller | ✅ Complete | New controller for profiles |
| Booking Controller | ✅ Complete | New enhanced controller |
| Parking Controller | ✅ Complete | New enhanced controller |
| All Routes | ✅ Complete | All routes registered |
| Seed Script | ✅ Complete | Comprehensive seeding |
| Frontend API Update | ⏳ Pending | Need to change base URL |
| Testing | ⏳ Pending | Need to test all endpoints |

---

## 📦 Deployment

### Backend (Railway/Render):

1. **Create Railway/Render Project**
2. **Set Environment Variables** (all from .env)
3. **Deploy:**
   ```bash
   # Railway
   railway up
   
   # Render
   # Connect GitHub repo and deploy
   ```

### Frontend (Netlify):

1. **Update API_BASE_URL** to production backend URL
2. **Deploy as usual:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

---

## 🎯 Next Steps

1. ⏳ **Update Frontend API URLs**
   - Change base URL to Express backend
   - Update axios config for cookies
   - Test all API calls

2. ⏳ **Complete Testing**
   - Test auth flow
   - Test booking lifecycle
   - Test privileges redemption
   - Test profile management

3. ⏳ **Deploy Backend**
   - Deploy to Railway or Render
   - Configure production environment
   - Test production endpoints

4. ⏳ **Update Documentation**
   - Update DEPLOYMENT.md
   - Create API documentation
   - Update README.md

---

## 💡 Key Features

### Membership Tiers:
- **Iron (Free)**: 2 points/hour, first hour free
- **Diamond (199฿/month)**: 5 points/hour, 10% discount, first hour free
- **Predator (499฿/month)**: 10 points/hour, 20% discount, first hour free, priority booking

### Booking Logic:
- First hour always free (all tiers)
- Rank-based discounts applied
- Points awarded based on parking duration
- Real-time cost calculation
- Transaction-based operations

### Promo Code System:
- Subscription codes: Instant tier upgrade
- Points codes: Award bonus points
- Discount codes: Apply discounts
- Usage limits and expiry tracking

---

## 🆘 Troubleshooting

### MongoDB Connection Issues:
```bash
# Check connection string
echo $MONGO_URI

# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected!')).catch(err => console.log(err));"
```

### JWT Issues:
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Email Issues:
- Check Brevo SMTP credentials
- Verify EMAIL_USER and EMAIL_PASS
- Test with simple email first

---

## 📞 Support

- **Issues**: Check console logs in VS Code terminal
- **Database**: Use MongoDB Compass to inspect data
- **API Testing**: Use Thunder Client or Postman
- **Frontend**: Check browser console and Network tab

---

**Last Updated:** 2024
**Version:** 1.0.0
**Author:** GitHub Copilot
