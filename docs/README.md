# 🚗 SciPark - Smart Parking System

ระบบจองที่จอดรถอัจฉริยะแบบ Real-time ที่สวยงาม ทันสมัย และใช้งานง่าย

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Netlify](https://img.shields.io/badge/Netlify-Functions-00C7B7?style=for-the-badge&logo=netlify)

## ✨ Features

- 🎨 **Beautiful UI** - ออกแบบด้วย Tailwind CSS + Framer Motion
- ⚡ **Real-time** - อัพเดตที่จอดว่างแบบ Real-time
- 🔐 **Secure** - JWT Authentication + MongoDB Atlas
- 💳 **Payment Ready** - พร้อมระบบชำระเงิน
- 🏆 **Membership Tiers** - ระบบสิทธิพิเศษ 3 ระดับ
- 📱 **Responsive** - ใช้งานได้ทุกอุปกรณ์
- 🚀 **Fast** - Build ด้วย Vite
- ☁️ **Cloud Ready** - Deploy บน Netlify + MongoDB Atlas (ฟรี!)

## 🎯 Demo

**คำตอบคำถาม: ใช่! Deploy บน Netlify กับ MongoDB Atlas ได้แน่นอน**

โปรเจคนี้ออกแบบมาเพื่อ Deploy บน Netlify โดยเฉพาะ:
- ✅ Frontend (React) → Netlify Static Hosting
- ✅ Backend (API) → Netlify Functions (Serverless)
- ✅ Database → MongoDB Atlas (Cloud Database)

**ทุกอย่างฟรี 100%!** 🎉

## 🚀 Quick Start

### 1️⃣ ติดตั้ง Dependencies

```powershell
npm install
cd netlify/functions && npm install && cd ../..
```

### 2️⃣ Setup MongoDB Atlas (ฟรี!)

ดูคำแนะนำใน [INSTALL.md](INSTALL.md)

### 3️⃣ สร้างไฟล์ .env

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:8888/.netlify/functions
```

### 4️⃣ Run Development

```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
netlify dev
```

เปิดเบราว์เซอร์: http://localhost:3000

## 📚 Documentation

- 🔧 **[INSTALL.md](INSTALL.md)** - คู่มือติดตั้งแบบละเอียด (เริ่มที่นี่!)
- 📖 **[README-FULLSTACK.md](README-FULLSTACK.md)** - Documentation ครบทุกรายละเอียด
- 🏗️ **[STRUCTURE.md](STRUCTURE.md)** - โครงสร้างโปรเจคและ Architecture

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS + Framer Motion
- Zustand (State Management)
- React Router + Axios

### Backend
- Netlify Functions (Serverless)
- MongoDB Atlas (Cloud Database)
- JWT Authentication

## 🎨 Design Highlights

โปรเจคนี้มี Design ที่สวยงามมาก ๆ:
- ✨ Gradient backgrounds & buttons
- 🎭 Smooth animations with Framer Motion
- 💳 Modern card designs
- 📱 Responsive layout (Mobile-first)
- 🌈 Beautiful color schemes
- ⚡ Loading states & transitions

## 🚀 Deployment to Netlify

1. Push code to GitHub
2. Connect to Netlify (https://app.netlify.com)
3. Build settings:
   - Build: `npm run build`
   - Publish: `dist`
4. Add environment variables
5. Deploy! 🎉

ดูรายละเอียดใน [INSTALL.md](INSTALL.md)

## 📱 Pages & Features

- 🏠 **Landing** - Hero, Features, Testimonials
- 🔐 **Auth** - Login, Register (JWT)
- 📊 **Dashboard** - Available spots, Active booking
- 🚗 **Parking** - Spot details, Instant booking
- 💎 **Privileges** - Membership tiers (Iron, Diamond, Predator)
- 👤 **Profile** - User info, Vehicles, History
- 💳 **Payment** - Payment processing

## 🎯 Architecture

```
React (Vite) → Netlify Functions → MongoDB Atlas
    ↓              ↓                    ↓
  UI/UX      Serverless API        Cloud Database
```

## ⚡ Quick Commands

```powershell
# Install
npm install

# Development
npm run dev              # Frontend
netlify dev             # Backend + Frontend

# Build
npm run build

# Preview
npm run preview

# Deploy
netlify deploy --prod
```

## 🐛 Troubleshooting

มีปัญหา? ดูที่ [INSTALL.md](INSTALL.md#-troubleshooting)

## 🤝 Contributing

PRs welcome! Fork → Create branch → Commit → Push → PR

## 📄 License

MIT License

## 👨‍💻 Author

**SciPark Team** - Made with ❤️ and ☕

---

**🚀 พร้อมเริ่มต้นแล้ว?** อ่าน [INSTALL.md](INSTALL.md) เพื่อติดตั้งภายใน 5 นาที!
