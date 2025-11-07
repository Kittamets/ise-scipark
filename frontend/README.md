# Frontend README

## 🎨 SciPark Frontend

React + Vite frontend application for SciPark parking management system.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Development
```bash
npm run dev
```
App will run on `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Output will be in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── stores/          # Zustand state management
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── contexts/        # React contexts
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── vite.config.js       # Vite configuration
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing

## 🌐 Pages

1. **Landing** (`/`) - Homepage with features
2. **Login** (`/login`) - User login
3. **Register** (`/register`) - User registration
4. **Home** (`/home`) - Dashboard with zones
5. **Parking Detail** (`/parking/:id`) - Zone details
6. **Active Booking** (`/booking/active`) - Current booking
7. **Privileges** (`/privileges`) - Membership tiers
8. **Profile** (`/profile`) - User profile
9. **Payment** (`/payment`) - Subscription payment

## 📦 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set environment variable: `VITE_API_URL`

### Vercel
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_URL`

## 🔧 Configuration

### Vite Config (`vite.config.js`)
- Port: 5173
- Proxy setup for API (if needed)
- Build optimizations

### Tailwind Config (`tailwind.config.js`)
- Custom colors
- Custom fonts
- Plugin configurations

## 🎯 Environment Variables

Create `.env` file with:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SciPark
VITE_APP_VERSION=1.0.0
```

For production, update `VITE_API_URL` to your backend URL.

## 📝 Notes

- All API calls go through `src/utils/api.js`
- Authentication state managed by Zustand store
- Responsive design for mobile and desktop
- Thai language throughout the app
