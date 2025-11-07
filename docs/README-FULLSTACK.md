# SciPark - Smart Parking System 🚗

ระบบจองที่จอดรถอัจฉริยะแบบ Real-time พัฒนาด้วย React + Vite, Tailwind CSS, Framer Motion และ MongoDB Atlas

## 🌟 Features

- ✨ UI/UX ที่สวยงามและ Modern
- 🚀 Real-time parking availability
- 💳 ระบบชำระเงินที่ปลอดภัย
- 🎯 ระบบสิทธิพิเศษ (Membership Tiers)
- 📱 Responsive Design (รองรับทุกหน้าจอ)
- 🔐 Authentication & Authorization
- 🎨 Smooth Animations with Framer Motion
- ⚡ Fast performance with Vite

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State Management
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications

### Backend
- **Netlify Functions** - Serverless API
- **MongoDB Atlas** - Database
- **JWT** - Authentication

## 📁 Project Structure

```
scipark/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── auth/            # Login, Register components
│   │   ├── parking/         # Parking-related components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── stores/              # Zustand stores
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Entry point
├── netlify/
│   └── functions/           # Serverless functions
├── public/                  # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Netlify account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scipark.git
cd scipark
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scipark?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NODE_ENV=development
VITE_API_URL=http://localhost:8888/.netlify/functions
```

4. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. In another terminal, start Netlify Functions:
```bash
netlify dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🚀 Deployment to Netlify

### Option 1: Deploy via Netlify CLI

```bash
# Login to Netlify
netlify login

# Initialize your site
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via Git

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify dashboard
7. Deploy!

## 📝 Environment Variables for Netlify

Add these in Netlify Dashboard → Site settings → Environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🗄️ Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier is fine)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs in development)
5. Get your connection string
6. Replace `<username>`, `<password>` in the connection string
7. Add to `.env` file

### Database Collections

The system will automatically create these collections:

- `users` - User accounts
- `bookings` - Parking bookings
- `parkingSpots` - Available parking spots
- `parkingZones` - Parking zones
- `privileges` - Membership tiers
- `vehicles` - User vehicles
- `otps` - One-time passwords

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... },
      accent: { ... }
    }
  }
}
```

### Fonts

Add your preferred fonts in `index.html` and update `tailwind.config.js`

## 📱 Features

### 1. Landing Page
- Beautiful hero section
- Features showcase
- Testimonials
- Call-to-action

### 2. Authentication
- Login with email/password
- Register new account
- JWT-based authentication
- Protected routes

### 3. Home Dashboard
- View available parking spots
- Real-time availability
- Quick booking
- Current booking status

### 4. Parking Management
- Browse parking spots
- View detailed information
- Book instantly
- QR code verification

### 5. Booking Management
- Active booking view
- Timer display
- Cancel booking
- Complete booking
- Payment processing

### 6. Privileges System
- Multiple membership tiers (Iron, Diamond, Predator)
- Discount benefits
- Advanced booking
- Cancellation perks

### 7. Profile Management
- Edit user information
- Manage vehicles
- View booking history
- Settings

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Secure API endpoints
- Environment variables for sensitive data
- CORS configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth` - Login/Register/Verify

### Parking
- `GET /api/parking` - Get all parking spots
- `GET /api/parking?id=<id>` - Get specific spot

### Bookings
- `POST /api/bookings` - Create/Cancel/Complete booking
- `GET /api/bookings?action=active` - Get active booking
- `GET /api/bookings?action=history` - Get booking history

### Privileges
- `GET /api/privileges` - Get all tiers
- `POST /api/privileges` - Subscribe/Redeem

### Vehicles
- `GET /api/vehicles` - Get user vehicles
- `POST /api/vehicles` - CRUD operations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**SciPark Team**
- Website: [scipark.app](https://scipark.app)
- GitHub: [@scipark](https://github.com/scipark)

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev)
- Animations by [Framer Motion](https://www.framer.com/motion)
- UI inspiration from modern parking apps

---

Made with ❤️ by SciPark Team
