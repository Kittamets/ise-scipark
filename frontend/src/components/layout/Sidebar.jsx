import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, User, Settings, Phone, LogOut, Trophy, Car } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    toast.success('ออกจากระบบสำเร็จ')
    navigate('/')
    onClose()
  }
  
  const menuItems = [
    { icon: User, label: 'แก้ไขโปรไฟล์', path: '/app/profile' },
    { icon: Car, label: 'ยานพาหนะของฉัน', path: '/app/profile?tab=vehicles' },
    { icon: Trophy, label: 'สิทธิพิเศษ', path: '/app/privileges' },
    { icon: Settings, label: 'ตั้งค่า', path: '/app/profile?tab=settings' },
    { icon: Phone, label: 'ติดต่อเรา', path: '/app/contact' },
  ]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">เมนู</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* User Profile Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name || 'User'}</h3>
                  <p className="text-sm opacity-90">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-xl p-3">
                <div>
                  <p className="text-xs opacity-80">Rank</p>
                  <p className="text-lg font-bold">{user?.rank || 'Iron'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">Points</p>
                  <p className="text-lg font-bold">{user?.points || 0}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-4 px-6 py-4 bg-gray-50 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white rounded-2xl transition-all duration-300 group"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
            
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-6 h-6" />
              <span>ออกจากระบบ</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
