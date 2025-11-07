# SciPark Project Structure

## Overview
โปรเจค SciPark เป็นระบบจองที่จอดรถแบบ Full-stack ที่สามารถ Deploy บน Netlify ได้

## Architecture

```
┌─────────────────────────────────────────┐
│  React Frontend (Vite)                  │
│  - Modern UI with Tailwind CSS          │
│  - Framer Motion animations             │
│  - React Router for navigation          │
│  - Zustand for state management         │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS
               ▼
┌─────────────────────────────────────────┐
│  Netlify Functions (Serverless API)     │
│  - /api/auth                            │
│  - /api/bookings                        │
│  - /api/parking                         │
│  - /api/privileges                      │
│  - /api/vehicles                        │
│  - /api/users                           │
└──────────────┬──────────────────────────┘
               │ MongoDB Driver
               ▼
┌─────────────────────────────────────────┐
│  MongoDB Atlas (Cloud Database)         │
│  - users collection                     │
│  - bookings collection                  │
│  - parkingSpots collection              │
│  - parkingZones collection              │
│  - privileges collection                │
│  - vehicles collection                  │
│  - otps collection                      │
└─────────────────────────────────────────┘
```

## Folder Structure

```
scipark/
├── 📁 src/                          # Frontend Source
│   ├── 📁 components/
│   │   ├── 📁 ui/                   # Reusable UI Components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Loading.jsx
│   │   ├── 📁 auth/                 # Authentication Components
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── 📁 parking/              # Parking Components
│   │   │   ├── ParkingCard.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   └── ParkingMap.jsx
│   │   └── 📁 layout/               # Layout Components
│   │       ├── Layout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   ├── 📁 pages/                    # Page Components
│   │   ├── Landing.jsx              # Landing page
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Register page
│   │   ├── Home.jsx                 # Dashboard
│   │   ├── ParkingDetail.jsx        # Parking spot details
│   │   ├── ActiveBooking.jsx        # Active booking view
│   │   ├── Privileges.jsx           # Membership tiers
│   │   ├── Profile.jsx              # User profile
│   │   └── Payment.jsx              # Payment page
│   ├── 📁 stores/                   # State Management
│   │   ├── authStore.js             # Authentication state
│   │   └── bookingStore.js          # Booking state
│   ├── 📁 utils/                    # Utilities
│   │   ├── api.js                   # Axios instance
│   │   ├── apiService.js            # API service functions
│   │   └── helpers.js               # Helper functions
│   ├── 📁 hooks/                    # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useBooking.js
│   │   └── useParking.js
│   ├── App.jsx                      # Main App component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
│
├── 📁 netlify/                      # Backend (Serverless)
│   └── 📁 functions/
│       ├── auth.js                  # Authentication API
│       ├── bookings.js              # Bookings API
│       ├── parking.js               # Parking spots API
│       ├── privileges.js            # Privileges API
│       ├── vehicles.js              # Vehicles API
│       ├── users.js                 # Users API
│       └── 📁 utils/
│           ├── db.js                # MongoDB connection
│           ├── auth.js              # JWT utilities
│           └── validation.js        # Input validation
│
├── 📁 public/                       # Static Assets
│   └── vite.svg
│
├── 📄 index.html                    # HTML template
├── 📄 package.json                  # Dependencies
├── 📄 vite.config.js                # Vite configuration
├── 📄 tailwind.config.js            # Tailwind configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 netlify.toml                  # Netlify configuration
├── 📄 .env.example                  # Environment variables example
└── 📄 README.md                     # Project documentation
```

## Key Components

### Frontend (src/)

#### Components (`src/components/`)
- **ui/** - Reusable, generic UI components
- **auth/** - Authentication-specific components
- **parking/** - Parking and booking related components
- **layout/** - Layout wrapper components (Navbar, Sidebar, Footer)

#### Pages (`src/pages/`)
Each page represents a route in the application:
- Landing - Marketing/landing page
- Login/Register - Authentication pages
- Home - Main dashboard showing available parking
- ParkingDetail - Detailed view of a parking spot
- ActiveBooking - Current active booking management
- Privileges - Membership tier selection
- Profile - User profile and settings
- Payment - Payment processing

#### State Management (`src/stores/`)
Using Zustand for lightweight state management:
- authStore - User authentication state
- bookingStore - Active booking state

#### API Layer (`src/utils/`)
- api.js - Axios instance with interceptors
- apiService.js - API endpoints organized by feature

### Backend (netlify/functions/)

#### Serverless Functions
Each file exports a handler function that Netlify will deploy:

```javascript
exports.handler = async (event, context) => {
  // Handle request
  return {
    statusCode: 200,
    body: JSON.stringify({ data })
  }
}
```

#### API Endpoints

**Authentication** (`auth.js`)
- POST /api/auth - Handle login, register, verify, forgot password

**Bookings** (`bookings.js`)
- POST /api/bookings - Create, cancel, complete booking
- GET /api/bookings - Get active booking or history

**Parking** (`parking.js`)
- GET /api/parking - List all parking spots
- GET /api/parking?id=<id> - Get specific spot
- GET /api/parking?action=availability - Check availability

**Privileges** (`privileges.js`)
- GET /api/privileges - List membership tiers
- POST /api/privileges - Subscribe or redeem code

**Vehicles** (`vehicles.js`)
- GET /api/vehicles - List user vehicles
- POST /api/vehicles - CRUD operations

**Users** (`users.js`)
- GET /api/users - Get user profile
- POST /api/users - Update profile, change password

## Data Flow

### 1. User Authentication Flow
```
1. User submits login form
2. LoginForm component calls authAPI.login()
3. API request sent to /api/auth
4. Netlify function validates credentials
5. MongoDB queries users collection
6. JWT token generated and returned
7. Token stored in Zustand store (persisted)
8. User redirected to dashboard
```

### 2. Booking Flow
```
1. User selects parking spot
2. ParkingCard component navigates to detail page
3. User clicks "Book Now"
4. bookingAPI.createBooking() called
5. Netlify function validates request
6. MongoDB creates booking document
7. Booking added to user's active bookings
8. Booking state updated in Zustand
9. User sees confirmation and timer
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  phone: String,
  rank: String (Iron, Diamond, Predator),
  points: Number,
  vehicles: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  parkingSpotId: ObjectId,
  vehicleId: ObjectId,
  startTime: Date,
  endTime: Date,
  status: String (active, completed, cancelled),
  price: Number,
  discount: Number,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Parking Spots Collection
```javascript
{
  _id: ObjectId,
  zoneId: ObjectId,
  name: String,
  code: String,
  floor: String,
  status: String (available, occupied, reserved),
  pricePerHour: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment Checklist

### Prerequisites
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for production)
- [ ] Netlify account created

### Environment Variables
Set these in Netlify Dashboard:
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] SMTP credentials (optional)

### Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Post-Deployment
- [ ] Test all API endpoints
- [ ] Verify database connections
- [ ] Test authentication flow
- [ ] Test booking flow
- [ ] Check mobile responsiveness
- [ ] Monitor Netlify Functions logs

## Development Tips

1. **Hot Reload**: Vite provides instant HMR for frontend changes
2. **Debugging**: Use `console.log` in Netlify Functions and check Netlify logs
3. **Database**: Use MongoDB Compass to visualize your data
4. **State**: Use Redux DevTools for Zustand state debugging
5. **API Testing**: Use Postman or Thunder Client to test API endpoints

## Performance Optimization

1. **Code Splitting**: React.lazy() for route-based code splitting
2. **Image Optimization**: Use WebP format and lazy loading
3. **Bundle Analysis**: Run `npm run build -- --analyze`
4. **Caching**: Implement proper caching headers
5. **CDN**: Netlify automatically uses CDN for static assets

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Tokens**: Set appropriate expiration times
3. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
4. **Input Validation**: Validate all user inputs on backend
5. **CORS**: Configure proper CORS settings
6. **Rate Limiting**: Implement rate limiting for API endpoints

## Monitoring & Analytics

1. **Netlify Analytics**: Built-in analytics dashboard
2. **Error Tracking**: Consider Sentry integration
3. **Performance**: Use Lighthouse for performance audits
4. **Uptime**: Set up uptime monitoring
5. **Logs**: Regularly check Netlify Functions logs

---

ถ้ามีคำถามเพิ่มเติมเกี่ยวกับโครงสร้างโปรเจค สามารถดูได้ที่ README.md หรือ documentation
