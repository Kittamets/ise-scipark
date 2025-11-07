# Backend README

## 🔧 SciPark Backend

Express.js + MongoDB backend API for SciPark parking management system.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Edit .env and fill in your values
```

Required environment variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` - SMTP credentials
- `CLIENT_URL` - Frontend URL for CORS

### Seed Database
```bash
node scripts/seed.js
```

This will create:
- 4 Parking zones
- 90 Parking spots
- 5 Promo codes
- 3 Test users

### Development
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### Production
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── db.js           # MongoDB connection
│   └── nodemailer.js   # Email configuration
├── controllers/         # Business logic
│   ├── authController.js
│   ├── bookingController.js
│   ├── parkingController.js
│   ├── privilegesController.js
│   ├── userController.js
│   └── vehicleController.js
├── models/             # MongoDB schemas
│   ├── userModel.js
│   ├── bookingModel.js
│   ├── parkingSpotModel.js
│   ├── parkingZoneModel.js
│   ├── vehicleModel.js
│   ├── subscriptionModel.js
│   └── promoCodeModel.js
├── routes/             # API routes
│   ├── authRoute.js
│   ├── bookingRoutes.js
│   ├── parkingRoute.js
│   ├── privilegesRoute.js
│   ├── userRoutes.js
│   └── vehicleRoutes.js
├── middleware/         # Custom middleware
│   └── userAuth.js     # JWT authentication
├── scripts/            # Utility scripts
│   └── seed.js        # Database seeding
└── index.js            # Express server entry point
```

## 🔐 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent abuse (1000 requests/hour)
- **XSS Protection** - Prevent XSS attacks
- **NoSQL Injection Prevention** - Sanitize MongoDB queries
- **HTTP-only Cookies** - Secure JWT storage
- **CORS Configuration** - Controlled cross-origin requests

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with email/username
- `POST /logout` - Logout user

### Parking (`/api/parking`)
- `GET /zones` - Get all zones with availability
- `GET /zones/:id` - Get zone details
- `GET /spots` - Get all spots (with filters)
- `GET /spots/:id` - Get spot details
- `GET /stats` - Get parking statistics
- `PUT /spots/:id/status` - Update spot status

### Bookings (`/api/bookings`)
- `POST /` - Create new booking
- `GET /active` - Get user's active booking
- `GET /history` - Get booking history
- `PUT /:id/complete` - Complete booking
- `DELETE /:id` - Cancel booking

### User (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password
- `GET /bookings` - Get booking history
- `GET /stats` - Get user statistics

### Privileges (`/api/privileges`)
- `GET /` - Get membership tiers
- `POST /subscribe` - Subscribe to tier
- `POST /redeem` - Redeem promo code

### Vehicles (`/api/vehicles`)
- `POST /` - Add vehicle
- `GET /` - Get user's vehicles
- `DELETE /:id` - Remove vehicle

## 🗃️ Database Models

### User
- Authentication (email, username, password)
- Profile (name, phone)
- Membership (rank, points, subscriptionExpiry)

### ParkingZone
- Zone information (name, description, building)
- Pricing (hourlyRate)
- Capacity (totalSpots)

### ParkingSpot
- Spot details (spotNumber, name, floor)
- Status (available, occupied, reserved, unavailable)
- Pricing (pricePerHour)
- Facilities (array of amenities)

### Booking
- User and vehicle references
- Parking spot and zone
- Time tracking (startTime, endTime)
- Cost calculation
- Status (active, completed, cancelled)

### Subscription
- User reference
- Tier (diamond, predator)
- Pricing and payment
- Duration (startedAt, expiresAt)

### PromoCode
- Code and type (subscription, points, discount)
- Benefits (tier, points, discountPercent)
- Usage tracking (maxUses, usedBy)
- Expiry date

### Vehicle
- Vehicle details (licensePlate, brand, model)
- User ownership

## 🧪 Test Data

After seeding, you can use these accounts:

| Rank | Email | Username | Password |
|------|-------|----------|----------|
| Iron | iron@test.com | ironuser | password123 |
| Diamond | diamond@test.com | diamonduser | password123 |
| Predator | predator@test.com | predatoruser | password123 |

Promo codes:
- `SCIPARK2024` - Diamond 30 days
- `WELCOME100` - 100 points
- `PREDATOR30` - Predator 30 days
- `DISCOUNT50` - 50% discount
- `FREEPARKING` - 500 points

## 📦 Deployment

### Railway
1. Connect GitHub repository
2. Set environment variables from `.env`
3. Deploy automatically

### Render
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Environment Variables for Production
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=long_random_string
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_api_key
EMAIL_FROM=noreply@yourdomain.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend.netlify.app
```

## 🔍 Testing

### Test API with curl
```bash
# Health check
curl http://localhost:3000

# Get parking zones
curl http://localhost:3000/api/parking/zones

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"password123","phone":"0812345678"}'
```

### Test with Postman/Thunder Client
Import the API endpoints and test with your preferred tool.

## 📝 Notes

- All responses are in Thai language
- JWT tokens stored in HTTP-only cookies
- First hour parking is free for all users
- Membership discounts applied automatically
- Points awarded based on parking duration
- Transaction-based booking operations

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Email Issues
- Verify Brevo SMTP credentials
- Check email quota limits
- Test with simple email first

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001
npm run dev
```
