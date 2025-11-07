# 🅿️ SciPark - Smart Parking Management System# 🚗 SciPark - Smart Parking System



ระบบจัดการลานจอดรถอัจฉริยะสำหรับมหาวิทยาลัย พร้อมระบบสมาชิก, รีวอร์ด, และโปรโมชั่นระบบจองที่จอดรถอัจฉริยะแบบ Real-time ที่สวยงาม ทันสมัย และใช้งานง่าย



## 🏗️ โครงสร้างโปรเจค![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

```![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

ise-scipark/![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

├── frontend/              # React + Vite Frontend![Netlify](https://img.shields.io/badge/Netlify-Functions-00C7B7?style=for-the-badge&logo=netlify)

│   ├── src/              # Source code

│   ├── public/           # Static assets## ✨ Features

│   ├── index.html        # HTML entry point

│   ├── package.json      # Frontend dependencies- 🎨 **Beautiful UI** - ออกแบบด้วย Tailwind CSS + Framer Motion

│   └── vite.config.js    # Vite configuration- ⚡ **Real-time** - อัพเดตที่จอดว่างแบบ Real-time

│- 🔐 **Secure** - JWT Authentication + MongoDB Atlas

├── backend/              # Express + MongoDB Backend- 💳 **Payment Ready** - พร้อมระบบชำระเงิน

│   ├── config/          # Database & email config- 🏆 **Membership Tiers** - ระบบสิทธิพิเศษ 3 ระดับ

│   ├── controllers/     # Business logic- 📱 **Responsive** - ใช้งานได้ทุกอุปกรณ์

│   ├── models/          # MongoDB schemas- 🚀 **Fast** - Build ด้วย Vite

│   ├── routes/          # API endpoints- ☁️ **Cloud Ready** - Deploy บน Netlify + MongoDB Atlas (ฟรี!)

│   ├── middleware/      # Authentication middleware

│   ├── scripts/         # Utility scripts (seed, etc.)## 🎯 Demo

│   ├── index.js         # Express server

│   └── package.json     # Backend dependencies**คำตอบคำถาม: ใช่! Deploy บน Netlify กับ MongoDB Atlas ได้แน่นอน**

│

└── docs/                # Documentationโปรเจคนี้ออกแบบมาเพื่อ Deploy บน Netlify โดยเฉพาะ:

    ├── README.md        # Overview- ✅ Frontend (React) → Netlify Static Hosting

    ├── DEPLOYMENT.md    # Deployment guide- ✅ Backend (API) → Netlify Functions (Serverless)

    └── ...              # Other docs- ✅ Database → MongoDB Atlas (Cloud Database)

```

**ทุกอย่างฟรี 100%!** 🎉

---

## 🚀 Quick Start

## 🚀 Quick Start

### 1️⃣ ติดตั้ง Dependencies

### Prerequisites

- Node.js 18+ ```powershell

- MongoDB Atlas Accountnpm install

- npm or yarncd netlify/functions && npm install && cd ../..

```

### 1️⃣ Clone Repository

```bash### 2️⃣ Setup MongoDB Atlas (ฟรี!)

git clone https://github.com/Kittamets/ise-scipark.git

cd ise-sciparkดูคำแนะนำใน [INSTALL.md](INSTALL.md)

```

### 3️⃣ สร้างไฟล์ .env

### 2️⃣ Setup Backend

```bash```env

cd backendMONGODB_URI=mongodb+srv://...

JWT_SECRET=your-secret-key

# Install dependenciesVITE_API_URL=http://localhost:8888/.netlify/functions

npm install```



# Create .env file### 4️⃣ Run Development

# Copy from .env.example and fill in your values

```powershell

# Seed database# Terminal 1 - Frontend

node scripts/seed.jsnpm run dev



# Start development server# Terminal 2 - Backend  

npm run devnetlify dev

``````



Backend will run on: `http://localhost:3000`เปิดเบราว์เซอร์: http://localhost:3000



### 3️⃣ Setup Frontend## 📚 Documentation

```bash

cd frontend- 🔧 **[INSTALL.md](INSTALL.md)** - คู่มือติดตั้งแบบละเอียด (เริ่มที่นี่!)

- 📖 **[README-FULLSTACK.md](README-FULLSTACK.md)** - Documentation ครบทุกรายละเอียด

# Install dependencies- 🏗️ **[STRUCTURE.md](STRUCTURE.md)** - โครงสร้างโปรเจคและ Architecture

npm install

## 🛠️ Tech Stack

# Start development server

npm run dev### Frontend

```- React 18 + Vite

- Tailwind CSS + Framer Motion

Frontend will run on: `http://localhost:5173`- Zustand (State Management)

- React Router + Axios

---

### Backend

## 🌟 Features- Netlify Functions (Serverless)

- MongoDB Atlas (Cloud Database)

### For Users- JWT Authentication

- 🔐 **Authentication** - ลงทะเบียน/เข้าสู่ระบบด้วย Email/Username

- 🅿️ **Real-time Parking** - ดูช่องว่างแบบเรียลไทม์## 🎨 Design Highlights

- 📱 **Easy Booking** - จองช่องจอดง่ายๆ ไม่กี่คลิก

- ⏱️ **First Hour Free** - ชั่วโมงแรกฟรีสำหรับทุกคนโปรเจคนี้มี Design ที่สวยงามมาก ๆ:

- 💎 **Membership Tiers** - 3 ระดับ: Iron, Diamond, Predator- ✨ Gradient backgrounds & buttons

- ⭐ **Reward Points** - สะสมแต้มทุกครั้งที่จอด- 🎭 Smooth animations with Framer Motion

- 🎫 **Promo Codes** - รับส่วนลดและสิทธิพิเศษ- 💳 Modern card designs

- 📊 **Statistics** - ดูประวัติและสถิติการใช้งาน- 📱 Responsive layout (Mobile-first)

- 🚗 **Vehicle Management** - จัดการรถหลายคัน- 🌈 Beautiful color schemes

- ⚡ Loading states & transitions

### For Admins

- 📍 **Zone Management** - จัดการโซนจอดรถ## 🚀 Deployment to Netlify

- 🅿️ **Spot Control** - อัปเดตสถานะช่องจอดแบบเรียลไทม์

- 📈 **Analytics** - ดูสถิติการใช้งานระบบ1. Push code to GitHub

- 🎟️ **Promo Codes** - สร้างและจัดการโค้ดส่วนลด2. Connect to Netlify (https://app.netlify.com)

3. Build settings:

---   - Build: `npm run build`

   - Publish: `dist`

## 💎 Membership Tiers4. Add environment variables

5. Deploy! 🎉

| Tier | Price | Points/Hour | Discount | First Hour | Priority |

|------|-------|-------------|----------|------------|----------|ดูรายละเอียดใน [INSTALL.md](INSTALL.md)

| **Iron** 🔨 | ฟรี | 2 | - | ✅ | - |

| **Diamond** 💎 | 199฿/เดือน | 5 | 10% | ✅ | - |## 📱 Pages & Features

| **Predator** 👑 | 499฿/เดือน | 10 | 20% | ✅ | ✅ |

- 🏠 **Landing** - Hero, Features, Testimonials

---- 🔐 **Auth** - Login, Register (JWT)

- 📊 **Dashboard** - Available spots, Active booking

## 🛠️ Tech Stack- 🚗 **Parking** - Spot details, Instant booking

- 💎 **Privileges** - Membership tiers (Iron, Diamond, Predator)

### Frontend- 👤 **Profile** - User info, Vehicles, History

- **React 18** - UI framework- 💳 **Payment** - Payment processing

- **Vite 5** - Build tool & dev server

- **Tailwind CSS 3** - Styling## 🎯 Architecture

- **Framer Motion** - Animations

- **Zustand** - State management```

- **Axios** - HTTP clientReact (Vite) → Netlify Functions → MongoDB Atlas

    ↓              ↓                    ↓

### Backend  UI/UX      Serverless API        Cloud Database

- **Express.js** - Web framework```

- **MongoDB + Mongoose** - Database

- **JWT** - Authentication## ⚡ Quick Commands

- **Nodemailer** - Email service

- **Bcrypt** - Password hashing```powershell

# Install

### Securitynpm install

- Helmet.js - Security headers

- Rate limiting# Development

- XSS protectionnpm run dev              # Frontend

- NoSQL injection preventionnetlify dev             # Backend + Frontend

- HTTP-only cookies

# Build

---npm run build



## 📡 API Endpoints# Preview

npm run preview

### Authentication

- `POST /api/auth/register` - Register new user# Deploy

- `POST /api/auth/login` - Loginnetlify deploy --prod

- `POST /api/auth/logout` - Logout```



### Parking## 🐛 Troubleshooting

- `GET /api/parking/zones` - Get all zones

- `GET /api/parking/zones/:id` - Get zone detailsมีปัญหา? ดูที่ [INSTALL.md](INSTALL.md#-troubleshooting)

- `GET /api/parking/spots` - Get all spots

- `GET /api/parking/stats` - Get statistics## 🤝 Contributing



### BookingsPRs welcome! Fork → Create branch → Commit → Push → PR

- `POST /api/bookings` - Create booking

- `GET /api/bookings/active` - Get active booking## 📄 License

- `GET /api/bookings/history` - Get history

- `PUT /api/bookings/:id/complete` - Complete bookingMIT License

- `DELETE /api/bookings/:id` - Cancel booking

## 👨‍💻 Author

### User Profile

- `GET /api/user/profile` - Get profile**SciPark Team** - Made with ❤️ and ☕

- `PUT /api/user/profile` - Update profile

- `PUT /api/user/change-password` - Change password---

- `GET /api/user/stats` - Get user statistics

**🚀 พร้อมเริ่มต้นแล้ว?** อ่าน [INSTALL.md](INSTALL.md) เพื่อติดตั้งภายใน 5 นาที!

### Privileges
- `GET /api/privileges` - Get membership tiers
- `POST /api/privileges/subscribe` - Subscribe to tier
- `POST /api/privileges/redeem` - Redeem promo code

### Vehicles
- `POST /api/vehicles` - Add vehicle
- `GET /api/vehicles` - Get user's vehicles
- `DELETE /api/vehicles/:id` - Remove vehicle

---

## 🧪 Test Accounts

After running seed script:

| Rank | Email | Username | Password | Points |
|------|-------|----------|----------|--------|
| Iron | iron@test.com | ironuser | password123 | 50 |
| Diamond | diamond@test.com | diamonduser | password123 | 500 |
| Predator | predator@test.com | predatoruser | password123 | 1000 |

---

## 🎫 Test Promo Codes

| Code | Type | Benefit |
|------|------|---------|
| SCIPARK2024 | Subscription | Diamond 30 days |
| WELCOME100 | Points | 100 points |
| PREDATOR30 | Subscription | Predator 30 days |
| DISCOUNT50 | Discount | 50% off next booking |
| FREEPARKING | Points | 500 points |

---

## 🚢 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

Environment variables needed:
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render)
```bash
cd backend
# Connect to Railway/Render
# Set environment variables from .env
# Deploy automatically
```

Environment variables needed:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_USER=...
EMAIL_PASS=...
PORT=3000
CLIENT_URL=https://your-frontend.netlify.app
```

**📖 For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

---

## 📚 Documentation

- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment guide
- **[BACKEND-MIGRATION.md](docs/BACKEND-MIGRATION.md)** - Backend architecture & migration
- **[MIGRATION-SUMMARY.md](docs/MIGRATION-SUMMARY.md)** - Quick reference guide
- **[PROJECT-COMPLETE.md](docs/PROJECT-COMPLETE.md)** - Project completion report
- **[STRUCTURE.md](docs/STRUCTURE.md)** - Project structure details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Kittamets**
- GitHub: [@Kittamets](https://github.com/Kittamets)

---

## 🙏 Acknowledgments

- React Team
- Express.js Community
- MongoDB Team
- Tailwind CSS
- All open-source contributors

---

## 📞 Support

For issues and questions:
- 📧 Open an issue on GitHub
- 💬 Check existing documentation in `docs/`

---

**Made with ❤️ for better parking management**
