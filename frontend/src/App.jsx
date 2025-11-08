import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Pages
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Home from './pages/Home'
import ParkingDetail from './pages/ParkingDetail'
import ActiveBooking from './pages/ActiveBooking'
import Privileges from './pages/Privileges'
import Profile from './pages/Profile'
import Payment from './pages/Payment'
import PaymentMethods from './pages/PaymentMethods'

// Layout
import Layout from './components/layout/Layout'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="parking/:id" element={<ParkingDetail />} />
        <Route path="booking" element={<ActiveBooking />} />
        <Route path="privileges" element={<Privileges />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payment" element={<Payment />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
